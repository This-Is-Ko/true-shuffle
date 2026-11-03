from flask import Flask, g, request
from flask_cors import CORS
import os
from flask_pymongo import PyMongo
from celery import Celery, Task
import faulthandler
import time
import uuid
from __version__ import __version__
from utils.logging_config import configure_logging

mongo = PyMongo()

MAX_CORRELATION_ID_LENGTH = 128
# High-frequency polling endpoints are logged at DEBUG on success so they do
# not drown out other events. Failures are still logged at WARNING/ERROR.
NOISY_POLL_PATH_PREFIXES = (
    '/api/playlist/shuffle/state/',
    '/api/playlist/share/liked-tracks/',
    '/api/user/aggregate/state/',
)


def create_app(service_name="flask"):
    app = Flask(__name__)

    # Select env and set up config
    CONFIG_TYPE = os.getenv('CONFIG_TYPE', default='config.DevelopmentConfig')
    app.config.from_object("config." + CONFIG_TYPE)

    # Single JSON logger for Flask, Celery and third-party logs. Docker forwards
    # stdout to Grafana Alloy, which forwards it to Grafana Cloud Logs.
    configure_logging(app, service=service_name)

    # Log application version at startup
    app.logger.info(f"True Shuffle Backend - Version {__version__}")
    app.logger.info("Config set up for " + CONFIG_TYPE)

    faulthandler.enable()

    # Enable CORS
    # CORS_ORIGIN supports a comma-separated list of origins, e.g.
    # 'http://localhost:3000,http://127.0.0.1:3000'
    cors_origins = [
        origin.strip()
        for origin in app.config["CORS_ORIGIN"].split(",")
        if origin.strip()
    ]
    CORS(
        app,
        supports_credentials=True,
        origins=cors_origins,
        expose_headers=["X-Correlation-ID"],
    )

    # Add correlation ID handling
    @app.before_request
    def handle_correlation_id():
        """Extract or generate X-Correlation-ID and store in Flask g object"""
        correlation_id = request.headers.get('X-Correlation-ID')
        if not correlation_id or len(correlation_id) > MAX_CORRELATION_ID_LENGTH:
            correlation_id = str(uuid.uuid4())
        g.correlation_id = correlation_id
        g.request_start_time = time.perf_counter()

    @app.after_request
    def log_request_and_add_correlation_id(response):
        """Log one line per request and return the correlation id to clients"""
        correlation_id = getattr(g, 'correlation_id', None)
        if correlation_id:
            response.headers['X-Correlation-ID'] = correlation_id
        else:
            correlation_id = str(uuid.uuid4())
            response.headers['X-Correlation-ID'] = correlation_id

        start_time = getattr(g, 'request_start_time', None)
        duration_ms = (
            round((time.perf_counter() - start_time) * 1000, 2)
            if start_time is not None
            else None
        )

        extra = {
            'correlation_id': correlation_id,
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'duration_ms': duration_ms,
        }
        user_id = getattr(g, 'user_id', None)
        if user_id:
            extra['user_id'] = user_id

        message = f"{request.method} {request.path} -> {response.status_code}"
        if response.status_code >= 500:
            app.logger.error(message, extra=extra)
        elif response.status_code >= 400:
            app.logger.warning(message, extra=extra)
        elif request.path.startswith(NOISY_POLL_PATH_PREFIXES):
            app.logger.debug(message, extra=extra)
        else:
            app.logger.info(message, extra=extra)

        return response

    # Register blueprints for app
    register_all_blueprints(app)

    # Initialise mongodb client
    try:
        mongo.init_app(app)
    except Exception:
        """We don't provide a URI when running unit tests, so PyMongo will fail to initialize.
        This is okay because we replace it with a version for testing anyway. """
        app.logger.info('PyMongo not initialized!')

    app.config.from_mapping(
        CELERY=dict(
            broker_url=app.config["CELERY_BROKER_URL"],
            result_backend=app.config["CELERY_RESULT_BACKEND_URL"],
            task_ignore_result=True,
            broker_connection_retry_on_startup=True,
            result_expires=3600,
            # Keep our JSON root logger instead of Celery's default handler.
            worker_hijack_root_logger=False,
        ),
    )
    celery_init_app(app)

    return app


def register_all_blueprints(app):
    from controllers.spotify_auth_controller import spotify_auth_controller
    from controllers.playlist_controller import playlist_controller
    from controllers.statistics_controller import statistics_controller
    from controllers.trackers_controller import trackers_controller
    from controllers.user_controller import user_controller
    from controllers.session_controller import session_controller
    from controllers.admin_controller import admin_controller

    app.register_blueprint(spotify_auth_controller)
    app.register_blueprint(playlist_controller)
    app.register_blueprint(statistics_controller)
    app.register_blueprint(trackers_controller)
    app.register_blueprint(user_controller)
    app.register_blueprint(session_controller)
    app.register_blueprint(admin_controller)


def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name)
    celery_app.config_from_object(app.config["CELERY"])
    # Keep our configured JSON root handler instead of Celery's default one.
    celery_app.conf.worker_hijack_root_logger = False
    celery_app.Task = FlaskTask
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app


app = create_app(service_name=os.getenv("SERVICE_NAME", "flask"))
