import pymongo
import pytest

from database import database

LOCK_KEY = "[Shuffled] Road Trip"
LOCK_ID = "user_id:" + LOCK_KEY


@pytest.fixture
def shuffle_locks(mocker):
    mock_db = mocker.MagicMock()
    mocker.patch.object(database.mongo, "db", new=mock_db)
    return mock_db[database.SHUFFLE_LOCKS_COLLECTION]


def test_acquire_shuffle_lock_claims_expired_or_missing_lock(shuffle_locks):
    shuffle_locks.find_one_and_update.return_value = {
        "_id": LOCK_ID,
        "task_id": "task-1",
    }

    acquired = database.acquire_shuffle_lock("user_id", LOCK_KEY, "task-1", 1800)

    assert acquired is True
    args, kwargs = shuffle_locks.find_one_and_update.call_args
    query, update = args
    assert query["_id"] == LOCK_ID
    # Only an expired lock may be reused
    assert "expires_at" in query
    assert update["$set"]["task_id"] == "task-1"
    assert "expires_at" in update["$set"]
    assert kwargs["upsert"] is True
    assert kwargs["return_document"] == pymongo.ReturnDocument.AFTER


def test_acquire_shuffle_lock_returns_false_when_lock_is_held(shuffle_locks):
    shuffle_locks.find_one_and_update.side_effect = pymongo.errors.DuplicateKeyError(
        "duplicate key"
    )

    assert database.acquire_shuffle_lock("user_id", LOCK_KEY, "task-2", 1800) is False


def test_find_shuffle_lock_returns_existing_lock(shuffle_locks):
    shuffle_locks.find_one.return_value = {"_id": LOCK_ID, "task_id": "task-1"}

    lock = database.find_shuffle_lock("user_id", LOCK_KEY)

    assert lock["task_id"] == "task-1"
    shuffle_locks.find_one.assert_called_once_with({"_id": LOCK_ID})


def test_release_shuffle_lock_only_deletes_owned_lock(shuffle_locks):
    database.release_shuffle_lock("user_id", LOCK_KEY, "task-1")

    shuffle_locks.delete_one.assert_called_once_with(
        {"_id": LOCK_ID, "task_id": "task-1"}
    )
