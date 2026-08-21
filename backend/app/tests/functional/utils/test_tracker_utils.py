from flask import Flask
from tests import env_patch  # noqa: F401
from database import database

from utils.tracker_utils import update_user_trackers, update_overall_trackers
from datetime import datetime, timezone

TRACKERS_ENABLED_KEY = "trackers_enabled"
USER_ID_KEY = "user_id"
PLAYLIST_COUNT_KEY = "playlist_count"
TRACK_COUNT_KEY = "track_count"
LAST_UPDATED_KEY = "last_updated"

app = Flask('test')

test_user = {
    USER_ID_KEY: "user123",
    "user_attributes": {
        TRACKERS_ENABLED_KEY: True
    }
}


def test_update_user_trackers_success(mocker, env_patch):  # noqa: F811
    with app.app_context():
        track_count = 10

        existing_shuffle_counter = {
            PLAYLIST_COUNT_KEY: 5,
            TRACK_COUNT_KEY: 50,
            LAST_UPDATED_KEY: datetime.now(timezone.utc)
        }

        mock_find_shuffle_counter = mocker.patch.object(database,
                                                        "find_shuffle_counter",
                                                        return_value=existing_shuffle_counter)
        mock_find_and_update_shuffle_counter = mocker.patch.object(database,
                                                                   "find_and_update_shuffle_counter",
                                                                   return_value=None)

        update_user_trackers(test_user, track_count)

        mock_find_shuffle_counter.assert_called_once_with("user123")
        mock_find_and_update_shuffle_counter.assert_called_once()
        assert mock_find_and_update_shuffle_counter.call_args[0][1][PLAYLIST_COUNT_KEY] == 6
        assert mock_find_and_update_shuffle_counter.call_args[0][1][TRACK_COUNT_KEY] == 60
        assert mock_find_and_update_shuffle_counter.call_args[0][1][LAST_UPDATED_KEY] is not None


def test_update_user_trackers_no_existing_counter(mocker, env_patch):  # noqa: F811
    with app.app_context():
        track_count = 10

        mock_find_shuffle_counter = mocker.patch.object(database, "find_shuffle_counter", return_value=None)
        mock_find_and_update_shuffle_counter = mocker.patch.object(database,
                                                                   "find_and_update_shuffle_counter",
                                                                   return_value=None)

        update_user_trackers(test_user, track_count)

        mock_find_shuffle_counter.assert_called_once_with("user123")
        mock_find_and_update_shuffle_counter.assert_called_once_with("user123", mocker.ANY)


def test_update_user_trackers_user_not_found(mocker, env_patch):  # noqa: F811
    with app.app_context():
        user = None
        track_count = 10

        mock_find_and_update = mocker.patch.object(database, "find_and_update_shuffle_counter")
        update_user_trackers(user, track_count)

        mock_find_and_update.assert_not_called()


def test_update_user_trackers_trackers_disabled(mocker, env_patch):  # noqa: F811
    with app.app_context():
        user = {"user_id": "user123", "user_attributes": {TRACKERS_ENABLED_KEY: False}}
        track_count = 10

        mock_find_and_update = mocker.patch.object(database, "find_and_update_shuffle_counter")
        update_user_trackers(user, track_count)

        mock_find_and_update.assert_not_called()


def test_update_user_trackers_exception_handling(mocker, env_patch):  # noqa: F811
    with app.app_context():
        user = {"user_id": "user123", "user_attributes": {TRACKERS_ENABLED_KEY: True}}
        track_count = 10

        mocker.patch.object(database, "find_shuffle_counter", side_effect=Exception("Database error"))
        mock_find_and_update = mocker.patch.object(database, "find_and_update_shuffle_counter")

        update_user_trackers(user, track_count)

        mock_find_and_update.assert_not_called()


"""
Success scenarios - update_overall_trackers
"""


def test_update_overall_trackers_success(mocker):  # noqa: F811
    with app.app_context():
        # Arrange
        mock_find_shuffle_counter = mocker.patch.object(database, "find_shuffle_counter", return_value={
            "playlist_count": 5,
            "track_count": 100
        })
        mock_find_and_update = mocker.patch.object(database, "find_and_update_shuffle_counter")

        # Act
        update_overall_trackers(10)

        # Assert
        mock_find_shuffle_counter.assert_called_once_with("overall_counter")
        mock_find_and_update.assert_called_once_with("overall_counter", {
            "playlist_count": 6,
            "track_count": 110
        })


"""
Failure scenarios - update_overall_trackers
"""


def test_update_overall_trackers_no_existing_counter(mocker):  # noqa: F811
    with app.app_context():
        # Arrange
        mock_find_shuffle_counter = mocker.patch.object(database, "find_shuffle_counter", return_value=None)

        # Act
        update_overall_trackers(10)

        # Assert
        mock_find_shuffle_counter.assert_called_once_with("overall_counter")


def test_update_overall_trackers_db_update_failure(mocker):  # noqa: F811
    with app.app_context():
        # Arrange
        mock_find_shuffle_counter = mocker.patch.object(database, "find_shuffle_counter", return_value={
            "playlist_count": 5,
            "track_count": 100
        })
        mock_find_and_update = mocker.patch.object(database,
                                                   "find_and_update_shuffle_counter",
                                                   side_effect=Exception("DB error"))

        # Act
        update_overall_trackers(10)

        # Assert
        mock_find_shuffle_counter.assert_called_once_with("overall_counter")
        mock_find_and_update.assert_called_once()


def test_update_overall_trackers_none_track_count(mocker):  # noqa: F811
    with app.app_context():
        # Arrange
        mock_find_shuffle_counter = mocker.patch.object(database, "find_shuffle_counter")
        mock_find_and_update = mocker.patch.object(database, "find_and_update_shuffle_counter")

        # Act
        update_overall_trackers(None)

        # Assert
        mock_find_shuffle_counter.assert_not_called()
        mock_find_and_update.assert_not_called()
