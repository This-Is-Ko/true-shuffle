from spotipy.exceptions import SpotifyException

from utils.logger_utils import (
    _exception_context,
    logErrorWithUser,
    logInfoWithUser,
    logOperationFailure,
)


class _FakeResponse:
    status_code = 503
    text = "service unavailable"


class _FakeRequestsError(Exception):
    def __init__(self):
        self.response = _FakeResponse()


def test_exception_context_spotify_exception_with_reason():
    exception = SpotifyException(429, -1, "rate limited", reason="Too Many Requests")

    context = _exception_context(exception)

    assert context["error_type"] == "SpotifyException"
    assert context["http_status"] == 429
    assert context["code"] == -1
    assert context["msg"] == "rate limited"
    assert context["reason"] == "Too Many Requests"


def test_exception_context_spotify_exception_without_reason_omits_none_values():
    exception = SpotifyException(404, -1, "not found")

    context = _exception_context(exception)

    assert context["http_status"] == 404
    assert "reason" not in context


def test_exception_context_requests_error_reads_response():
    context = _exception_context(_FakeRequestsError())

    assert context["error_type"] == "_FakeRequestsError"
    assert context["http_status"] == 503
    assert context["body"] == "service unavailable"


def test_exception_context_plain_exception_only_has_type():
    context = _exception_context(ValueError("boom"))

    assert context == {"error_type": "ValueError"}


def test_log_operation_failure_includes_context_user_and_correlation(mocker):
    mock_app = mocker.Mock()
    mocker.patch("utils.logger_utils.current_app", mock_app)
    mocker.patch("utils.logger_utils.get_correlation_id", return_value="corr-123")
    exception = SpotifyException(429, -1, "rate limited", reason="Too Many Requests")

    logOperationFailure(
        "add_tracks_batch",
        exception,
        user_id="user_1",
        playlist_id="playlist_1",
        batch_index=2,
        batch_size=100,
    )

    message = mock_app.logger.error.call_args[0][0]
    assert "playlist_op_failed operation=add_tracks_batch" in message
    assert "playlist_id='playlist_1'" in message
    assert "batch_index=2" in message
    assert "error_type='SpotifyException'" in message
    assert "http_status=429" in message
    assert "reason='Too Many Requests'" in message
    assert "[Correlation-ID: corr-123]" in message
    assert "User ID: user_1" in message


def test_log_operation_failure_without_exception(mocker):
    mock_app = mocker.Mock()
    mocker.patch("utils.logger_utils.current_app", mock_app)
    mocker.patch("utils.logger_utils.get_correlation_id", return_value=None)

    logOperationFailure(
        "add_tracks_missing_snapshot_id",
        user_id="user_1",
        playlist_id="playlist_1",
        add_items_response={"error": "nope"},
    )

    message = mock_app.logger.error.call_args[0][0]
    assert "operation=add_tracks_missing_snapshot_id" in message
    assert "error_type" not in message
    assert "User ID: user_1" in message


def test_log_error_with_user_accepts_user_id_string(mocker):
    mock_app = mocker.Mock()
    mocker.patch("utils.logger_utils.current_app", mock_app)
    mocker.patch("utils.logger_utils.get_correlation_id", return_value="corr-1")

    logErrorWithUser("something failed", user_id="user_42")

    message = mock_app.logger.error.call_args[0][0]
    assert "User ID: user_42" in message
    assert "something failed" in message


def test_log_info_with_user_accepts_spotify_auth(mocker):
    mock_app = mocker.Mock()
    mocker.patch("utils.logger_utils.current_app", mock_app)
    mocker.patch("utils.logger_utils.get_correlation_id", return_value=None)
    spotify_auth = mocker.Mock(user_id="user_7")

    logInfoWithUser("hello", spotify_auth)

    message = mock_app.logger.info.call_args[0][0]
    assert message == "User ID: user_7 - hello"
