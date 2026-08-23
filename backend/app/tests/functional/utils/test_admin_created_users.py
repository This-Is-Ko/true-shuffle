from datetime import datetime, timezone
from tests import env_patch  # noqa: F401

from database import database


def _current_month_str():
    now = datetime.now(timezone.utc)
    return "%04d-%02d" % (now.year, now.month)


def test_get_monthly_created_users_fills_empty_months(mocker, env_patch):  # noqa: F811
    mock_users = mocker.MagicMock()
    mock_users.aggregate.return_value = []

    mock_db = mocker.MagicMock()
    mock_db.users = mock_users

    mock_mongo = mocker.MagicMock()
    mock_mongo.db = mock_db

    mocker.patch.object(database, "mongo", mock_mongo)

    result = database.get_monthly_created_users(6)

    assert len(result) == 6
    # Last entry is the current month, months are consecutive
    assert result[-1]["month"] == _current_month_str()
    for i in range(1, len(result)):
        assert result[i]["month"] > result[i - 1]["month"]
    assert all(entry["created_users"] == 0 for entry in result)


def test_get_monthly_created_users_maps_counts(mocker, env_patch):  # noqa: F811
    mock_users = mocker.MagicMock()
    mock_users.aggregate.return_value = [
        {"month": _current_month_str(), "created_users": 5},
    ]

    mock_db = mocker.MagicMock()
    mock_db.users = mock_users

    mock_mongo = mocker.MagicMock()
    mock_mongo.db = mock_db

    mocker.patch.object(database, "mongo", mock_mongo)

    result = database.get_monthly_created_users(6)

    assert len(result) == 6
    assert result[-1]["month"] == _current_month_str()
    assert result[-1]["created_users"] == 5
    assert all(entry["created_users"] == 0 for entry in result[:-1])
