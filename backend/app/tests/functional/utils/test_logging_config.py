import json
import logging
import sys

from flask import Flask, g

from tests import client, env_patch  # noqa: F401

from utils.logging_config import (
    JsonFormatter,
    LogContextFilter,
    TextFormatter,
    get_log_context,
)


def _make_record(**extra):
    record = logging.LogRecord(
        name="test.logger",
        level=logging.ERROR,
        pathname=__file__,
        lineno=1,
        msg="something happened",
        args=(),
        exc_info=None,
    )
    for key, value in extra.items():
        setattr(record, key, value)
    return record


def test_json_formatter_includes_context_and_extras():
    record = _make_record(
        correlation_id="corr-1",
        user_id="user-1",
        method="POST",
        path="/api/playlist/shuffle",
        status_code=500,
        duration_ms=12.5,
        operation="add_tracks_batch",
        batch_index=2,
    )

    payload = json.loads(JsonFormatter("flask").format(record))

    assert payload["level"] == "ERROR"
    assert payload["service"] == "flask"
    assert payload["message"] == "something happened"
    assert payload["correlation_id"] == "corr-1"
    assert payload["user_id"] == "user-1"
    assert payload["status_code"] == 500
    assert payload["duration_ms"] == 12.5
    assert payload["operation"] == "add_tracks_batch"
    assert payload["batch_index"] == 2


def test_json_formatter_includes_exception_details():
    try:
        raise ValueError("boom")
    except ValueError:
        exc_info = sys.exc_info()

    record = logging.LogRecord(
        name="test.logger",
        level=logging.ERROR,
        pathname=__file__,
        lineno=1,
        msg="request failed",
        args=(),
        exc_info=exc_info,
    )

    payload = json.loads(JsonFormatter("flask").format(record))

    assert payload["exception"]["type"] == "ValueError"
    assert payload["exception"]["message"] == "boom"
    assert "ValueError: boom" in payload["exception"]["stacktrace"]


def test_text_formatter_appends_context():
    record = _make_record(correlation_id="corr-1", user_id="user-1")

    message = TextFormatter().format(record)

    assert "something happened" in message
    assert "correlation_id=corr-1" in message
    assert "user_id=user-1" in message


def test_log_context_filter_uses_request_context():
    app = Flask(__name__)
    record = _make_record()

    with app.test_request_context("/api/user/?tracker=x"):
        g.correlation_id = "corr-1"
        g.user_id = "user-1"

        assert LogContextFilter().filter(record) is True

    assert record.correlation_id == "corr-1"
    assert record.user_id == "user-1"
    assert record.method == "GET"
    assert record.path == "/api/user/"


def test_get_log_context_outside_request_is_empty():
    assert get_log_context() == {}


def test_request_logging_echoes_client_correlation_id(client, env_patch):  # noqa: F811
    response = client.get(
        "/api/does-not-exist",
        headers={"X-Correlation-ID": "trace-123"},
    )

    assert response.headers["X-Correlation-ID"] == "trace-123"


def test_request_logging_generates_correlation_id(client, env_patch):  # noqa: F811
    response = client.get("/api/does-not-exist")

    assert response.headers["X-Correlation-ID"]
    assert response.headers["X-Correlation-ID"] != "trace-123"
