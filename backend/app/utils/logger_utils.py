from flask import current_app

from utils.logging_config import get_log_context

try:
    from spotipy.exceptions import SpotifyException
except ImportError:  # pragma: no cover - spotipy is a runtime dependency
    SpotifyException = None


def get_correlation_id():
    """Get correlation ID from the active Flask request or Celery task."""
    return get_log_context().get("correlation_id")


def _build_user_log_message(message: str, spotify_auth=None, user_id=None):
    # Get correlation ID
    correlation_id = get_correlation_id()

    # Resolve the user id from either a SpotifyAuth object, an explicit id or
    # the current request/task context.
    resolved_user_id = (
        user_id
        or (getattr(spotify_auth, "user_id", None) if spotify_auth else None)
        or get_log_context().get("user_id")
    )

    # Build log message with correlation ID and user_id if available
    log_parts = []
    if correlation_id:
        log_parts.append(f"[Correlation-ID: {correlation_id}]")
    if resolved_user_id:
        log_parts.append(f"User ID: {resolved_user_id}")

    if log_parts:
        message = " - ".join(log_parts) + " - " + message

    return message


def logErrorWithUser(message: str, spotify_auth=None, user_id=None, exc_info=False, extra=None):
    current_app.logger.error(
        _build_user_log_message(message, spotify_auth, user_id),
        exc_info=exc_info,
        extra=extra or {},
    )


def logInfoWithUser(message: str, spotify_auth=None, user_id=None, extra=None):
    current_app.logger.info(
        _build_user_log_message(message, spotify_auth, user_id),
        extra=extra or {},
    )


def _exception_context(exception):
    """
    Return structured, loggable fields for an exception.
    Handles spotipy's SpotifyException (http_status/code/msg/reason) as well as
    raw requests errors (which expose a response with status_code/text).
    """
    context: dict = {"error_type": type(exception).__name__}
    if SpotifyException is not None and isinstance(exception, SpotifyException):
        context.update({
            "http_status": exception.http_status,
            "code": exception.code,
            "msg": exception.msg,
            "reason": getattr(exception, "reason", None),
        })
    else:
        response = getattr(exception, "response", None)
        if response is not None:
            context["http_status"] = getattr(response, "status_code", None)
            context["body"] = (getattr(response, "text", "") or "")[:500]
    return {key: value for key, value in context.items() if value is not None}


def logOperationFailure(operation, exception=None, user_id=None, **context):
    """
    Log a single-line, greppable failure record for a playlist operation.

    Includes the operation name, arbitrary structured context (playlist id/uri,
    batch index/size, track counts, ...) and the exception details, while
    attaching the user id and correlation id via logErrorWithUser. The
    exception traceback is included when an exception is supplied.
    """
    log_parts = [f"playlist_op_failed operation={operation}"]
    log_parts.extend(f"{key}={value!r}" for key, value in context.items())
    if exception is not None:
        log_parts.extend(f"{key}={value!r}" for key, value in _exception_context(exception).items())
        context["error_type"] = type(exception).__name__
    logErrorWithUser(
        " ".join(log_parts),
        user_id=user_id,
        exc_info=exception if exception is not None else False,
        extra={"operation": operation, **context},
    )


def logError(message: str, exc_info=False, extra=None):
    """Log error message with correlation ID if available"""
    correlation_id = get_correlation_id()
    if correlation_id:
        message = f"[Correlation-ID: {correlation_id}] - " + message
    current_app.logger.error(message, exc_info=exc_info, extra=extra or {})


def logInfo(message: str, extra=None):
    """Log info message with correlation ID if available"""
    correlation_id = get_correlation_id()
    if correlation_id:
        message = f"[Correlation-ID: {correlation_id}] - " + message
    current_app.logger.info(message, extra=extra or {})


def logWarning(message: str, exc_info=False, extra=None):
    """Log warning message with correlation ID if available"""
    correlation_id = get_correlation_id()
    if correlation_id:
        message = f"[Correlation-ID: {correlation_id}] - " + message
    current_app.logger.warning(message, exc_info=exc_info, extra=extra or {})


def logDebug(message: str, extra=None):
    """Log debug message with correlation ID if available"""
    correlation_id = get_correlation_id()
    if correlation_id:
        message = f"[Correlation-ID: {correlation_id}] - " + message
    current_app.logger.debug(message, extra=extra or {})


def set_task_log_context(task, correlation_id=None, user_id=None):
    """Store correlation/user ids on the Celery task for later log records."""
    if not correlation_id and not user_id:
        return
    try:
        if not isinstance(getattr(task.request, "meta", None), dict):
            task.request.meta = {}
        if correlation_id:
            task.request.meta["correlation_id"] = correlation_id
        if user_id:
            task.request.meta["user_id"] = user_id
    except Exception:
        # Logging context must never break task execution.
        pass
