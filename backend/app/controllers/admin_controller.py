from flask import Blueprint, current_app, request

from decorators.admin_auth_validator import admin_auth_validator
from services import admin_service

admin_controller = Blueprint('admin_controller', __name__, url_prefix='/api/admin')

DEFAULT_LIMIT = 20
MAX_LIMIT = 100


@admin_controller.route('/overview', methods=['GET'])
@admin_auth_validator
def get_admin_overview(spotify_auth):
    try:
        return admin_service.get_admin_overview()
    except Exception as e:
        current_app.logger.error("Unable to retrieve admin overview: " + str(e))
        return {"error": "Unable to retrieve admin overview"}, 400


@admin_controller.route('/users/monthly', methods=['GET'])
@admin_auth_validator
def get_monthly_active_users(spotify_auth):
    try:
        return {"monthly_active_users": admin_service.get_monthly_active_users()}
    except Exception as e:
        current_app.logger.error("Unable to retrieve monthly active users: " + str(e))
        return {"error": "Unable to retrieve monthly active users"}, 400


@admin_controller.route('/shuffles/recent', methods=['GET'])
@admin_auth_validator
def get_recent_shuffles(spotify_auth):
    try:
        limit = _parse_limit(request.args.get("limit"))
        return {"recent_shuffles": admin_service.get_recent_shuffles(limit)}
    except Exception as e:
        current_app.logger.error("Unable to retrieve recent shuffles: " + str(e))
        return {"error": "Unable to retrieve recent shuffles"}, 400


@admin_controller.route('/shuffles/failures', methods=['GET'])
@admin_auth_validator
def get_recent_failures(spotify_auth):
    try:
        limit = _parse_limit(request.args.get("limit"))
        return {"recent_failures": admin_service.get_recent_failures(limit)}
    except Exception as e:
        current_app.logger.error("Unable to retrieve recent shuffle failures: " + str(e))
        return {"error": "Unable to retrieve recent shuffle failures"}, 400


@admin_controller.route('/shuffles/failure-rate', methods=['GET'])
@admin_auth_validator
def get_failure_rate(spotify_auth):
    try:
        group_by = request.args.get("group_by", "day")
        return {"failure_rate": admin_service.get_failure_rate(group_by)}
    except Exception as e:
        current_app.logger.error("Unable to retrieve shuffle failure rate: " + str(e))
        return {"error": "Unable to retrieve shuffle failure rate"}, 400


def _parse_limit(value):
    if value is None:
        return DEFAULT_LIMIT
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return DEFAULT_LIMIT
    return max(1, min(parsed, MAX_LIMIT))
