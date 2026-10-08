from datetime import datetime, timedelta, timezone
from tests import client, env_patch  # noqa: F401

from database import database
from services import admin_service

test_expiry = datetime.now(timezone.utc) + timedelta(hours=4)


def _mock_admin_session(mocker, is_admin):
    mocker.patch.object(
        database,
        "find_session",
        return_value={
            "user_id": "user_id",
            "access_token": "access_token",
            "refresh_token": "refresh_token",
            "expires_at": "expires_at",
            "scope": "scope",
            "session_expiry": test_expiry,
            "is_admin": is_admin,
        }
    )


def _set_cookies(client):
    client.set_cookie('trueshuffle-sessionId', 'sessionId')
    client.set_cookie('trueshuffle-auth', 'true')


def test_get_admin_overview_success(mocker, client, env_patch):  # noqa: F811
    _mock_admin_session(mocker, True)
    mocker.patch.object(admin_service, "get_admin_overview", return_value={"total_users": 42})
    _set_cookies(client)

    response = client.get('/api/admin/overview')
    response_json = response.get_json()

    assert response.status_code == 200
    assert response_json["total_users"] == 42


def test_get_admin_overview_forbidden(mocker, client, env_patch):  # noqa: F811
    _mock_admin_session(mocker, False)
    _set_cookies(client)

    response = client.get('/api/admin/overview')
    response_json = response.get_json()

    assert response.status_code == 403
    assert response_json["error"] == "Forbidden"


def test_get_admin_overview_unauthorized(mocker, client, env_patch):  # noqa: F811
    mocker.patch.object(database, "find_session", return_value=None)
    _set_cookies(client)

    response = client.get('/api/admin/overview')
    response_json = response.get_json()

    assert response.status_code == 401
    assert response_json["error"] == "Invalid credentials"


def test_get_monthly_active_users_success(mocker, client, env_patch):  # noqa: F811
    _mock_admin_session(mocker, True)
    mocker.patch.object(
        admin_service,
        "get_monthly_active_users",
        return_value=[{"month": "2026-01", "active_users": 3}]
    )
    _set_cookies(client)

    response = client.get('/api/admin/users/monthly')
    response_json = response.get_json()

    assert response.status_code == 200
    assert response_json["monthly_active_users"][0]["month"] == "2026-01"


def test_get_created_users_success(mocker, client, env_patch):  # noqa: F811
    _mock_admin_session(mocker, True)
    mocker.patch.object(
        admin_service,
        "get_created_users_monthly",
        return_value=[{"month": "2026-03", "created_users": 2}]
    )
    _set_cookies(client)

    response = client.get('/api/admin/users/created?months=6')
    response_json = response.get_json()

    assert response.status_code == 200
    assert response_json["created_users_monthly"][0]["month"] == "2026-03"
    assert response_json["created_users_monthly"][0]["created_users"] == 2


def test_get_recent_shuffles_success(mocker, client, env_patch):  # noqa: F811
    _mock_admin_session(mocker, True)
    mocker.patch.object(
        admin_service,
        "get_recent_shuffles",
        return_value=[{"user_id": "user_id", "playlist_name": "Playlist 1", "tracks_shuffled": 5}]
    )
    _set_cookies(client)

    response = client.get('/api/admin/shuffles/recent?limit=10')
    response_json = response.get_json()

    assert response.status_code == 200
    assert response_json["recent_shuffles"][0]["playlist_name"] == "Playlist 1"


def test_get_failure_rate_success(mocker, client, env_patch):  # noqa: F811
    _mock_admin_session(mocker, True)
    mocker.patch.object(
        admin_service,
        "get_failure_rate",
        return_value=[{"period": "2026-01-01", "total": 10, "failures": 1, "rate": 0.1}]
    )
    _set_cookies(client)

    response = client.get('/api/admin/shuffles/failure-rate?group_by=day')
    response_json = response.get_json()

    assert response.status_code == 200
    assert response_json["failure_rate"][0]["total"] == 10
