from flask import Flask
from tests import env_patch

from spotipy import Spotify
from spotipy.exceptions import SpotifyException
from database import database

from tests.functional.helpers.mock_requests import *
from tests.functional.helpers.mock_responses import *
from utils.util import (
    get_tracks_from_playlist,
    create_new_playlist_with_tracks,
    reuse_existing_playlist_with_updated_tracks,
    add_all_tracks_to_playlist,
    add_tracks_with_retry,
)

SPOTIFY_PLAYLIST_URL = "open.spotify.com/playlist/spotifyPlaylistUrl"

create_user_playlist_response = {
    "id": "new_playlist_id",
    "external_urls": {
        "spotify": SPOTIFY_PLAYLIST_URL
    }
}

playlist_add_items_response = {
    "snapshot_id": "snapshot_id_0"
}

sample_tracks_list = [
    "spotify:track:sometrack0",
    "spotify:track:sometrack1",
    "spotify:track:sometrack2"
]

app = Flask('test')


############ get_tracks_from_playlist ################


def test_get_tracks_from_playlist_from_existing_playlist_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "playlist_items", side_effect=[mock_tracks_response, empty_all_user_playlists_response_sample])

        all_tracks = get_tracks_from_playlist(None, Spotify(), "playlist_id")

        assert len(all_tracks) == 2


def test_get_tracks_from_playlist_from_liked_songs_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "current_user_saved_tracks", side_effect=[mock_tracks_response, empty_all_user_playlists_response_sample])

        all_tracks = get_tracks_from_playlist(None, Spotify(), "likedTracks")

        assert len(all_tracks) == 2


def test_get_tracks_from_playlist_no_tracks_from_existing_playlist_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "playlist_items", side_effect=[empty_all_user_playlists_response_sample])

        all_tracks = get_tracks_from_playlist(None, Spotify(), "playlist_id")

        assert len(all_tracks) == 0


def test_get_tracks_from_playlist_no_tracks_from_liked_songs_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "current_user_saved_tracks", side_effect=[empty_all_user_playlists_response_sample])

        all_tracks = get_tracks_from_playlist(None, Spotify(), "likedTracks")

        assert len(all_tracks) == 0


def test_get_tracks_from_playlist_error_getting_playlist_items_failure(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "playlist_items", side_effect=Exception("playlist_items error"))

        try:
            all_tracks = get_tracks_from_playlist(None, Spotify(), "playlist_id")
        except Exception as e:
            assert str(e) == "playlist_items error"


def test_get_tracks_from_playlist_error_getting_liked_songs_failure(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "current_user_saved_tracks", side_effect=Exception("current_user_saved_tracks error"))

        try:
            all_tracks = get_tracks_from_playlist(None, Spotify(), "likedTracks")
        except Exception as e:
            assert str(e) == "current_user_saved_tracks error"




def test_get_tracks_from_playlist_stops_at_max_tracks_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        page = {"items": [
            {"track": {"uri": "spotify:track:track" + str(i), "name": "track" + str(i), "id": "id" + str(i), "artists": [], "is_local": False}}
            for i in range(50)
        ]}
        mocker.patch.object(Spotify, "playlist_items", side_effect=[page, page])

        all_tracks = get_tracks_from_playlist(None, Spotify(), "playlist_id", max_tracks=100)

        assert len(all_tracks) == 100


############ create_new_playlist_with_tracks ################


def test_create_new_playlist_with_tracks_trims_over_spotify_limit_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch.object(Spotify, "user_playlist_create", return_value=create_user_playlist_response)
        mocker.patch.object(Spotify, "playlist_add_items", return_value=playlist_add_items_response)

        large_tracks_list = ["spotify:track:sometrack" + str(i) for i in range(10001)]

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", large_tracks_list)

        assert response["status"] == "success"
        assert response["num_of_tracks"] == 10000
        assert response["playlist_trimmed"] is True


def test_create_new_playlist_with_tracks_exactly_max_tracks_not_trimmed_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch.object(Spotify, "user_playlist_create", return_value=create_user_playlist_response)
        mocker.patch.object(Spotify, "playlist_add_items", return_value=playlist_add_items_response)

        exact_max_tracks_list = ["spotify:track:sometrack" + str(i) for i in range(10000)]

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", exact_max_tracks_list)

        assert response["status"] == "success"
        assert response["num_of_tracks"] == 10000
        assert response["playlist_trimmed"] is False


def test_add_tracks_with_retry_retries_then_succeeds(mocker, env_patch):
    with app.app_context():
        mocker.patch("utils.util.time.sleep", return_value=None)
        mock_spotify = mocker.Mock()
        mock_spotify.playlist_add_items.side_effect = [Exception("timeout"), {"snapshot_id": "snapshot_0"}]

        response = add_tracks_with_retry(mock_spotify, "playlist_id", ["spotify:track:sometrack0"])

        assert response == {"snapshot_id": "snapshot_0"}
        assert mock_spotify.playlist_add_items.call_count == 2


def test_add_tracks_with_retry_raises_after_max_attempts(mocker, env_patch):
    with app.app_context():
        mocker.patch("utils.util.time.sleep", return_value=None)
        mock_spotify = mocker.Mock()
        mock_spotify.playlist_add_items.side_effect = Exception("persistent error")

        try:
            add_tracks_with_retry(mock_spotify, "playlist_id", ["spotify:track:sometrack0"], max_attempts=3)
            assert False, "Expected exception to be raised"
        except Exception as e:
            assert str(e) == "persistent error"
        assert mock_spotify.playlist_add_items.call_count == 3


def test_create_new_playlist_with_tracks_success(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch.object(Spotify, "user_playlist_create", return_value=create_user_playlist_response)
        mocker.patch.object(Spotify, "playlist_add_items", return_value=playlist_add_items_response)

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", sample_tracks_list)

        assert response["status"] == "success"
        assert response["playlist_uri"] == SPOTIFY_PLAYLIST_URL
        assert response["num_of_tracks"] == 3
        assert response["creation_time"] is not None

def test_create_new_playlist_with_tracks_track_list_contains_invalid_values_failure(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch.object(Spotify, "user_playlist_create", return_value=create_user_playlist_response)
        mocker.patch.object(Spotify, "playlist_add_items", return_value=playlist_add_items_response)

        tracks_list_with_invalid = [
            "spotify:track:sometrack0",
            "sometrack1"
        ]

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", tracks_list_with_invalid)

        assert response["status"] == "success"
        assert response["playlist_uri"] == SPOTIFY_PLAYLIST_URL
        assert response["num_of_tracks"] == 1
        assert response["creation_time"] is not None


def test_create_new_playlist_with_tracks_track_list_contains_all_invalid_values_failure(mocker, env_patch):
    with app.app_context():

        tracks_list_with_invalid = [
            "sometrack0",
            "sometrack1"
        ]

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", tracks_list_with_invalid)
        
        assert response["error"] == "Unable to create new playlist / add tracks to playlist: No tracks to add"

        
def test_create_new_playlist_with_tracks_empty_track_list_failure(mocker, env_patch):
    with app.app_context():

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", [])

        assert response["error"] == "Unable to create new playlist / add tracks to playlist: No tracks to add"


def test_create_new_playlist_with_tracks_error_getting_spotify_user_failure(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "me", side_effect=Exception("mocked error"))

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", sample_tracks_list)

        assert response["error"] == "Unable to create new playlist / add tracks to playlist: mocked error"


def test_create_new_playlist_with_tracks_error_initialising_playlist_failure(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch.object(Spotify, "user_playlist_create", side_effect=Exception("mocked error"))

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", sample_tracks_list)

        assert response["error"] == "Unable to create new playlist / add tracks to playlist: mocked error"


def test_create_new_playlist_with_tracks_error_adding_items_failure(mocker, env_patch):
    with app.app_context():
        # Prepare mocks
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch.object(Spotify, "user_playlist_create", return_value=create_user_playlist_response)
        mocker.patch.object(Spotify, "playlist_add_items", side_effect=Exception("mocked error"))

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", sample_tracks_list)

        assert response["error"] == "Unable to add tracks to playlist new_playlist_id: mocked error"


############ structured failure logging ################


def test_create_new_playlist_validation_failure_logs_validate_operation(mocker, env_patch):
    with app.app_context():
        mock_log = mocker.patch("utils.util.logOperationFailure")

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", [])

        assert response["error"] == "Unable to create new playlist / add tracks to playlist: No tracks to add"
        assert mock_log.call_args[0][0] == "validate_tracks"


def test_create_new_playlist_create_failure_logs_create_operation(mocker, env_patch):
    with app.app_context():
        mock_log = mocker.patch("utils.util.logOperationFailure")
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch.object(Spotify, "user_playlist_create", side_effect=SpotifyException(500, -1, "server error"))

        response = create_new_playlist_with_tracks(None, Spotify(), "new_playlist_name", False, "playlist_description", sample_tracks_list)

        assert response["error"].startswith("Unable to create new playlist / add tracks to playlist: ")
        assert mock_log.call_args[0][0] == "create_playlist"
        assert mock_log.call_args[1]["user_id"] == mock_user_details_response["id"]
        assert mock_log.call_args[1]["track_count"] == 3


def test_reuse_existing_playlist_get_tracks_failure_logs_operation(mocker, env_patch):
    with app.app_context():
        mock_log = mocker.patch("utils.util.logOperationFailure")
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch("utils.util.get_tracks_from_playlist", side_effect=Exception("get tracks boom"))

        response = reuse_existing_playlist_with_updated_tracks(None, Spotify(), "shuffled_playlist_id", SPOTIFY_PLAYLIST_URL, sample_tracks_list)

        assert response["error"] == "Unable to reuse existing playlist / add tracks to playlist: get tracks boom"
        assert mock_log.call_args[0][0] == "get_existing_tracks"
        assert mock_log.call_args[1]["playlist_id"] == "shuffled_playlist_id"


def test_reuse_existing_playlist_clear_failure_logs_clear_operation(mocker, env_patch):
    with app.app_context():
        mocker.patch("utils.util.update_task_progress", return_value=None)
        mock_log = mocker.patch("utils.util.logOperationFailure")
        mocker.patch.object(Spotify, "me", return_value=mock_user_details_response)
        mocker.patch("utils.util.get_tracks_from_playlist", return_value=[{"uri": "spotify:track:sometrack0"}])
        mocker.patch.object(Spotify, "playlist_remove_all_occurrences_of_items", side_effect=SpotifyException(403, -1, "forbidden"))

        response = reuse_existing_playlist_with_updated_tracks(None, Spotify(), "shuffled_playlist_id", SPOTIFY_PLAYLIST_URL, sample_tracks_list)

        assert response["error"] == "Unable to clear existing playlist before adding new tracks"
        assert mock_log.call_args[0][0] == "clear_existing_playlist"
        assert mock_log.call_args[1]["playlist_id"] == "shuffled_playlist_id"
        assert mock_log.call_args[1]["batch_index"] == 0
        assert mock_log.call_args[1]["batch_size"] == 1


def test_add_all_tracks_to_playlist_batch_failure_logs_operation(mocker, env_patch):
    with app.app_context():
        mock_log = mocker.patch("utils.util.logOperationFailure")
        mocker.patch("utils.util.add_tracks_with_retry", side_effect=SpotifyException(429, -1, "rate limited"))

        response = add_all_tracks_to_playlist(None, Spotify(), sample_tracks_list, "user_id", SPOTIFY_PLAYLIST_URL, "new_playlist_id", False)

        assert response["error"].startswith("Unable to add tracks to playlist new_playlist_id: ")
        assert mock_log.call_args[0][0] == "add_tracks_batch"
        assert mock_log.call_args[1]["playlist_id"] == "new_playlist_id"
        assert mock_log.call_args[1]["batch_index"] == 0
        assert mock_log.call_args[1]["batch_size"] == 3
        assert mock_log.call_args[1]["total_tracks"] == 3


def test_add_all_tracks_to_playlist_missing_snapshot_logs_operation(mocker, env_patch):
    with app.app_context():
        mock_log = mocker.patch("utils.util.logOperationFailure")
        mocker.patch("utils.util.add_tracks_with_retry", return_value={"unexpected": "response"})

        response = add_all_tracks_to_playlist(None, Spotify(), sample_tracks_list, "user_id", SPOTIFY_PLAYLIST_URL, "new_playlist_id", False)

        assert response["error"] == "Unable to add tracks to playlist new_playlist_id"
        assert mock_log.call_args[0][0] == "add_tracks_missing_snapshot_id"
        assert mock_log.call_args[1]["batch_index"] == 0


