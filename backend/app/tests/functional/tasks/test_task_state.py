from flask import Flask
from tests import env_patch  # noqa: F401

from classes.spotify_auth import SpotifyAuth
from tasks.task_state import get_celery_task_state

app = Flask('test')


def _mock_async_result(mocker, task_result):
    mock_async_result = mocker.patch("tasks.task_state.AsyncResult")
    mock_async_result.return_value.state = "SUCCESS"
    mock_async_result.return_value.info = {}
    mock_async_result.return_value.get.return_value = task_result
    return mock_async_result.return_value


def test_get_celery_task_state_maps_error_result_to_failure(mocker, env_patch):  # noqa: F811
    with app.app_context():
        mock_result = _mock_async_result(mocker, {
            "status": "error",
            "error": "Unable to add tracks to playlist playlist_id: playlist size limit reached",
            "error_code": "playlist_size_limit",
        })

        response = get_celery_task_state(SpotifyAuth(user_id="user_id"), "task_id", "Shuffle playlist")

        assert response["state"] == "FAILURE"
        assert response["error_code"] == "playlist_size_limit"
        assert response["result"]["status"] == "error"
        mock_result.forget.assert_called_once()


def test_get_celery_task_state_keeps_successful_result(mocker, env_patch):  # noqa: F811
    with app.app_context():
        _mock_async_result(mocker, {
            "status": "success",
            "playlist_uri": "https://open.spotify.com/playlist/shuffled",
        })

        response = get_celery_task_state(SpotifyAuth(user_id="user_id"), "task_id", "Shuffle playlist")

        assert response["state"] == "SUCCESS"
        assert "error_code" not in response
        assert response["result"]["playlist_uri"] == "https://open.spotify.com/playlist/shuffled"
