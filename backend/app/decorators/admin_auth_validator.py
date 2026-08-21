from functools import wraps
from flask import current_app, request
from exceptions.custom_exceptions import SessionExpired, SessionIdNone, SessionIdNotFound
from utils.auth_utils import validate_session


def admin_auth_validator(f):
    """
    Decorator for admin Flask endpoints.
    Validates the user's Spotify session and that the user is an admin.
    If valid, injects the `spotify_auth` object into the decorated function.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            spotify_auth = validate_session(request.cookies)
        except (SessionIdNone, SessionIdNotFound, SessionExpired) as e:
            current_app.logger.error("Invalid credentials: " + str(e))
            return {"error": "Invalid credentials"}, 401
        except Exception as e:
            current_app.logger.error("Invalid request: " + str(e))
            return {"error": "Invalid request"}, 400

        if spotify_auth.is_admin is not True:
            current_app.logger.error("Unauthorized admin access by user: " + str(spotify_auth.user_id))
            return {"error": "Forbidden"}, 403

        return f(*args, spotify_auth=spotify_auth, **kwargs)
    return decorated
