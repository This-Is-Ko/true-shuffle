from flask import current_app, g
from celery import current_task
from spotipy.exceptions import SpotifyException

def get_correlation_id():
    """Get correlation ID from Flask g object or Celery task metadata"""
    # Try Flask request context first
    try:
        if hasattr(g, 'correlation_id'):
            return g.correlation_id
    except RuntimeError:
        # Not in Flask request context (e.g., in Celery task)
        pass
    
    # Try Celery task metadata
    try:
        if current_task and hasattr(current_task, 'request') and current_task.request:
            task_meta = current_task.request.get('meta', {})
            if isinstance(task_meta, dict):
                return task_meta.get('correlation_id')
    except Exception:
        pass
    
    return None

def logErrorWithUser(message: str, spotify_auth=None, user_id=None):
    # Get correlation ID
    correlation_id = get_correlation_id()

    # Resolve the user id from either a SpotifyAuth object or an explicit id
    resolved_user_id = user_id or (getattr(spotify_auth, "user_id", None) if spotify_auth else None)

    # Build log message with correlation ID and user_id if available
    log_parts = []
    if correlation_id:
        log_parts.append(f"[Correlation-ID: {correlation_id}]")
    if resolved_user_id:
        log_parts.append(f"User ID: {resolved_user_id}")

    if log_parts:
        message = " - ".join(log_parts) + " - " + message

    current_app.logger.error(message)

def logInfoWithUser(message: str, spotify_auth=None, user_id=None):
    # Get correlation ID
    correlation_id = get_correlation_id()

    # Resolve the user id from either a SpotifyAuth object or an explicit id
    resolved_user_id = user_id or (getattr(spotify_auth, "user_id", None) if spotify_auth else None)

    # Build log message with correlation ID and user_id if available
    log_parts = []
    if correlation_id:
        log_parts.append(f"[Correlation-ID: {correlation_id}]")
    if resolved_user_id:
        log_parts.append(f"User ID: {resolved_user_id}")

    if log_parts:
        message = " - ".join(log_parts) + " - " + message

    current_app.logger.info(message)


def _exception_context(exception):
    """
    Return structured, loggable fields for an exception.
    Handles spotipy's SpotifyException (http_status/code/msg/reason) as well as
    raw requests errors (which expose a response with status_code/text).
    """
    context: dict = {"error_type": type(exception).__name__}
    if isinstance(exception, SpotifyException):
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
    attaching the user id and correlation id via logErrorWithUser.
    """
    log_parts = [f"playlist_op_failed operation={operation}"]
    log_parts.extend(f"{key}={value!r}" for key, value in context.items())
    if exception is not None:
        log_parts.extend(f"{key}={value!r}" for key, value in _exception_context(exception).items())
    logErrorWithUser(" ".join(log_parts), user_id=user_id)


def logError(message: str):
    """Log error message with correlation ID if available"""
    correlation_id = get_correlation_id()
    if correlation_id:
        message = f"[Correlation-ID: {correlation_id}] - " + message
    current_app.logger.error(message)


def logInfo(message: str):
    """Log info message with correlation ID if available"""
    correlation_id = get_correlation_id()
    if correlation_id:
        message = f"[Correlation-ID: {correlation_id}] - " + message
    current_app.logger.info(message)


def logWarning(message: str):
    """Log warning message with correlation ID if available"""
    correlation_id = get_correlation_id()
    if correlation_id:
        message = f"[Correlation-ID: {correlation_id}] - " + message
    current_app.logger.warning(message)
