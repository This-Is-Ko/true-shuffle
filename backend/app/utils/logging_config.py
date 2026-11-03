import json
import logging
import os
import sys
from datetime import datetime, timezone

from flask import g, has_request_context, request

try:
    from celery import current_task
except ImportError:  # pragma: no cover - celery is a runtime dependency
    current_task = None

# Fields that are copied from the active request/task onto every log record.
CONTEXT_FIELDS = (
    "correlation_id",
    "user_id",
    "task_id",
    "method",
    "path",
    "status_code",
    "duration_ms",
)


def get_log_context():
    """
    Return the logging context for the current request or Celery task.

    Values are only included when they are available so that log records stay
    small outside of a request/task.
    """
    context = {}

    try:
        if has_request_context():
            context["correlation_id"] = getattr(g, "correlation_id", None)
            context["user_id"] = getattr(g, "user_id", None)
            context["method"] = request.method
            context["path"] = request.path
    except Exception:
        # Logging must never break request handling.
        pass

    try:
        task = current_task
        if task is not None:
            task_request = getattr(task, "request", None)
            context["task_id"] = getattr(task_request, "id", None)
            meta = getattr(task_request, "meta", None)
            if isinstance(meta, dict):
                if not context.get("correlation_id"):
                    context["correlation_id"] = meta.get("correlation_id")
                if not context.get("user_id"):
                    context["user_id"] = meta.get("user_id")
    except Exception:
        pass

    return {key: value for key, value in context.items() if value not in (None, "")}


class LogContextFilter(logging.Filter):
    """Attach request/task context to every log record."""

    def filter(self, record):
        for key, value in get_log_context().items():
            if getattr(record, key, None) is None:
                setattr(record, key, value)
        return True


class TextFormatter(logging.Formatter):
    """Human readable formatter that appends the structured context."""

    def __init__(self):
        super().__init__(
            fmt="%(asctime)s %(levelname)s [%(name)s] %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S%z",
        )

    def format(self, record):
        message = super().format(record)
        context = [
            f"{field}={getattr(record, field)}"
            for field in CONTEXT_FIELDS
            if getattr(record, field, None) not in (None, "")
        ]
        if context:
            message = f"{message} [{' '.join(context)}]"
        return message


class JsonFormatter(logging.Formatter):
    """Single-line JSON formatter suited to Loki/Grafana ingestion."""

    def __init__(self, service):
        super().__init__()
        self.service = service
        self._standard_attrs = set(
            logging.LogRecord("", 0, "", 0, "", (), None).__dict__.keys()
        )

    def format(self, record):
        payload = {
            "timestamp": datetime.now(timezone.utc)
            .isoformat(timespec="milliseconds")
            .replace("+00:00", "Z"),
            "level": record.levelname,
            "logger": record.name,
            "service": self.service,
            "message": record.getMessage(),
        }

        for field in CONTEXT_FIELDS:
            value = getattr(record, field, None)
            if value not in (None, ""):
                payload[field] = value

        # Include fields supplied through logger extra={...} so operational
        # context (playlist ids, batch indexes, ...) is queryable in Grafana.
        for key, value in record.__dict__.items():
            if key in self._standard_attrs or key in payload or key.startswith("_"):
                continue
            payload[key] = value

        if record.exc_info:
            exc_info = record.exc_info
            if isinstance(exc_info, BaseException):
                exc_info = (type(exc_info), exc_info, exc_info.__traceback__)
            elif exc_info is True:
                exc_info = sys.exc_info()
            exc_type, exc_value, _ = exc_info
            payload["exception"] = {
                "type": exc_type.__name__ if exc_type else None,
                "message": str(exc_value) if exc_value else None,
                "stacktrace": self.formatException(exc_info),
            }

        return json.dumps(payload, ensure_ascii=False, default=str)


def _build_handler(service, log_format):
    handler = logging.StreamHandler(sys.stdout)
    if log_format == "json":
        handler.setFormatter(JsonFormatter(service))
    else:
        handler.setFormatter(TextFormatter())
    handler._true_shuffle_handler = True
    return handler


def _configure_logger(logger, service, level, log_format, clear):
    if clear:
        for handler in list(logger.handlers):
            logger.removeHandler(handler)
    else:
        for handler in list(logger.handlers):
            if getattr(handler, "_true_shuffle_handler", False):
                logger.removeHandler(handler)

    handler = _build_handler(service, log_format)
    # Filters on a logger only run for records logged directly to it, not for
    # records propagated from child loggers. Attach the context filter to the
    # handler so every record it formats (including third-party/Celery child
    # loggers) carries the correlation context.
    handler.addFilter(LogContextFilter())
    logger.addHandler(handler)

    for log_filter in list(logger.filters):
        if isinstance(log_filter, LogContextFilter):
            logger.removeFilter(log_filter)
    logger.addFilter(LogContextFilter())

    logger.setLevel(level)
    if clear:
        # The app logger owns its handler; propagating would duplicate records
        # through the root handler.
        logger.propagate = False


def configure_logging(app=None, service="flask", log_level=None, log_format=None):
    """
    Configure application and root logging.

    Both containers write logs to stdout, where Grafana Alloy picks them up.
    JSON is the default so fields such as correlation_id, user_id and task_id
    can be filtered directly in Grafana. Set LOG_FORMAT=text for local use.
    """
    level_name = (
        log_level
        or (app.config.get("LOG_LEVEL") if app is not None else None)
        or os.getenv("LOG_LEVEL")
        or "INFO"
    ).upper()
    level = getattr(logging, level_name, logging.INFO)

    resolved_format = (
        log_format
        or (app.config.get("LOG_FORMAT") if app is not None else None)
        or os.getenv("LOG_FORMAT")
        or "json"
    ).lower()
    if resolved_format not in ("json", "text"):
        resolved_format = "json"

    if app is not None:
        _configure_logger(app.logger, service, level, resolved_format, clear=True)

    if service == "celery":
        # Configure Celery's own loggers up front. Celery skips adding its
        # default handlers when a logger already has one, so worker and task
        # lifecycle lines keep the same JSON shape as application logs.
        for logger_name in ("celery", "celery.task"):
            _configure_logger(
                logging.getLogger(logger_name),
                service,
                level,
                resolved_format,
                clear=True,
            )

    # Root logging covers Celery's own logs and third-party libraries.
    # Existing handlers (for example pytest) are left in place.
    _configure_logger(logging.getLogger(), service, level, resolved_format, clear=False)
