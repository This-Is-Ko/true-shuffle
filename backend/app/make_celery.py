import logging
import os

# Set before importing main so its module-level app is configured as the Celery
# worker rather than duplicating app initialisation.
os.environ.setdefault("SERVICE_NAME", "celery")

# The module-level app is created by the import and already has Celery attached.
from main import app as flask_app  # noqa: E402
from __version__ import __version__  # noqa: E402

celery_app = flask_app.extensions["celery"]
logger = logging.getLogger(__name__)

# Log application version at startup
logger.info(f"True Shuffle Backend (Celery Worker) - Version {__version__}")
