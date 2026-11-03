import sys
import time
from datetime import date, datetime, timezone
from typing import List
from celery import shared_task
import random
from flask import current_app

from database import database
from services.spotify_client import create_spotify_client
from utils import util, tracker_utils
from utils.logger_utils import logError, logInfo, logWarning, set_task_log_context
from classes.shuffle_type import Shuffle_Type

SHUFFLED_PLAYLIST_PREFIX = "[Shuffled] "
LIKED_TRACKS_PLAYLIST_ID = "likedTracks"
TRACK_SHUFFLES_ATTRIBUTE_NAME = "track_shuffles"


@shared_task(bind=True, ignore_result=False, expires=60)
def shuffle_playlist(self, spotify_auth_dict: dict, playlist_id, playlist_name, correlation_id=None, 
        shuffle_type: str = Shuffle_Type.REUSE_EXISTING_PLAYLIST.value
    ):
    # Store correlation/user ids in task metadata so every log record can be
    # traced back to the originating request.
    user_id = spotify_auth_dict.get("user_id") if isinstance(spotify_auth_dict, dict) else None
    if correlation_id:
        self.update_state(state='PROGRESS', meta={'correlation_id': correlation_id})
    set_task_log_context(self, correlation_id=correlation_id, user_id=user_id)

    start_time = time.time()
    celery_task_id = self.request.id if self.request else None
    response = None
    error_message = None
    tracks_shuffled = 0
    playlist_image_url = None

    logInfo(
        "shuffle_playlist started "
        f"playlist_id={playlist_id} playlist_name={playlist_name!r} "
        f"shuffle_type={shuffle_type} user_id={user_id}"
    )

    try:
        spotify_client = create_spotify_client(current_app, spotify_auth_dict)

        # Fetch playlist details to get image URL
        if playlist_id == LIKED_TRACKS_PLAYLIST_ID:
            # Use default liked songs image URL
            playlist_image_url = "https://misc.scdn.co/liked-songs/liked-songs-300.png"
        else:
            try:
                playlist_details = spotify_client.playlist(playlist_id)
                if playlist_details and "images" in playlist_details and len(playlist_details["images"]) > 0:
                    playlist_image_url = playlist_details["images"][0].get("url")
            except Exception as e:
                logWarning(f"Could not fetch playlist image for {playlist_id}: {str(e)}")

        # Grab all tracks from playlist (capped at Spotify's playlist limit)
        all_tracks = util.get_tracks_from_playlist(self, spotify_client, playlist_id, max_tracks=util.PLAYLIST_MAX_TRACKS)
        if not all_tracks:
            error_message = "No tracks found for playlist " + playlist_id
            response = {"error": error_message}
            return response

        tracks_shuffled = len(all_tracks)

        # Check if user exists
        me = spotify_client.me()
        user_id = me["id"] if me and me.get("id") else user_id
        set_task_log_context(self, user_id=user_id)
        user = database.find_user(user_id) if user_id else None
        if user is None:
            error_message = "No user found"
            response = {"error": error_message}
            return response

        util.update_task_progress(
            self,
            state='PROGRESS',
            meta={'progress': {'state': "Shuffling " + str(len(all_tracks)) + " tracks..."}},
            correlation_id=correlation_id
        )
        random.shuffle(all_tracks)

        # Check if shuffled playlist exists
        user_playlists = spotify_client.current_user_playlists()
        shuffled_playlist_id = None
        shuffled_playlist_uri = None
        for playlist in user_playlists["items"]:
            if playlist["name"] == (SHUFFLED_PLAYLIST_PREFIX + playlist_name):
                shuffled_playlist_id = playlist["id"]
                shuffled_playlist_uri = playlist["external_urls"]["spotify"]
                break

        all_tracks_uri = [track['uri'] for track in all_tracks]

        if shuffle_type == Shuffle_Type.REUSE_EXISTING_PLAYLIST.value and shuffled_playlist_id:
            # Reuse existing shuffled playlist if selected and exists
            response = util.reuse_existing_playlist_with_updated_tracks(
                self,
                spotify_client,
                shuffled_playlist_id,
                shuffled_playlist_uri,
                all_tracks_uri
            )
        else:
            # Classic: create new playlist
            # Clean up existing shuffled playlist
            if shuffled_playlist_id is not None:
                spotify_client.current_user_unfollow_playlist(shuffled_playlist_id)

            response = util.create_new_playlist_with_tracks(
                self,
                spotify_client,
                SHUFFLED_PLAYLIST_PREFIX + playlist_name,
                False,
                "Shuffled by True Shuffle",
                all_tracks_uri
            )

        if response is not None and response["status"] == "success":
            # Increment user counters for playlists and tracks
            tracker_utils.update_user_trackers(user, tracks_shuffled)

            # Increment overall counters for playlists and tracks
            tracker_utils.update_overall_trackers(tracks_shuffled)

        return response
    finally:
        duration_seconds = int(time.time() - start_time)

        # Detect an in-flight exception so failure events are recorded before it propagates
        active_exception = sys.exc_info()[1]
        if active_exception is not None:
            status = "failed"
            if not error_message:
                error_message = str(active_exception)
        else:
            status = "success" if (response is not None and response.get("status") == "success") else "failed"
            if not error_message and isinstance(response, dict):
                error_message = response.get("error")

        try:
            database.insert_shuffle_event({
                "user_id": user_id,
                "playlist_id": playlist_id,
                "playlist_name": playlist_name,
                "tracks_shuffled": tracks_shuffled,
                "duration_seconds": duration_seconds,
                "status": status,
                "error_message": error_message,
                "celery_task_id": celery_task_id,
                "playlist_image_url": playlist_image_url,
                "shuffled_at": datetime.now(timezone.utc)
            })
        except Exception as e:
            logError("Unable to record shuffle event: " + str(e), exc_info=True)

        log_message = (
            f"shuffle_playlist {status} "
            f"playlist_id={playlist_id} playlist_name={playlist_name!r} "
            f"user_id={user_id} tracks={tracks_shuffled} "
            f"duration_s={duration_seconds} celery_task_id={celery_task_id}"
        )
        if status == "success":
            logInfo(log_message)
        else:
            logError(
                f"{log_message} error={error_message}",
                exc_info=active_exception is not None,
            )


@shared_task(bind=True, ignore_result=False, expires=60)
def create_playlist_from_liked_tracks(self, spotify_auth_dict: dict, new_playlist_name, correlation_id=None):
    user_id = spotify_auth_dict.get("user_id") if isinstance(spotify_auth_dict, dict) else None
    # Store correlation/user ids in task metadata so every log record can be
    # traced back to the originating request.
    if correlation_id:
        self.update_state(state='PROGRESS', meta={'correlation_id': correlation_id})
    set_task_log_context(self, correlation_id=correlation_id, user_id=user_id)

    start_time = time.time()
    logInfo(
        "create_playlist_from_liked_tracks started "
        f"playlist_name={new_playlist_name!r} user_id={user_id}"
    )

    try:
        spotify_client = create_spotify_client(current_app, spotify_auth_dict)

        all_tracks = util.get_tracks_from_playlist(
            self, spotify_client, LIKED_TRACKS_PLAYLIST_ID, max_tracks=util.PLAYLIST_MAX_TRACKS
        )
        if not all_tracks:
            logError(
                "create_playlist_from_liked_tracks failed "
                f"playlist_name={new_playlist_name!r} user_id={user_id} error='No tracks found for user's liked songs'"
            )
            return {"error": "No tracks found for user's liked songs"}

        today = date.today()
        all_tracks_uri = [track['uri'] for track in all_tracks]

        response = util.create_new_playlist_with_tracks(
            self,
            spotify_client,
            new_playlist_name,
            True,
            "True Shuffle | My Liked Tracks from " + today.strftime("%d/%m/%Y"),
            all_tracks_uri
        )

        duration_seconds = int(time.time() - start_time)
        if isinstance(response, dict) and response.get("status") == "success":
            logInfo(
                "create_playlist_from_liked_tracks success "
                f"playlist_name={new_playlist_name!r} user_id={user_id} "
                f"tracks={len(all_tracks_uri)} duration_s={duration_seconds}"
            )
        else:
            logError(
                "create_playlist_from_liked_tracks failed "
                f"playlist_name={new_playlist_name!r} user_id={user_id} "
                f"duration_s={duration_seconds} error={response!r}"
            )
        return response
    except Exception as e:
        logError(
            "create_playlist_from_liked_tracks failed "
            f"playlist_name={new_playlist_name!r} user_id={user_id} "
            f"duration_s={int(time.time() - start_time)} error={e}",
            exc_info=True,
        )
        raise


@shared_task(bind=True, ignore_result=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=2)
def update_track_statistics(self, user_id: str, tracks: List[str], correlation_id=None):
    """
    Updates database with track statistics.
    Increments shuffle counts or inserts new tracks if missing.
    """
    # Store correlation/user ids in task metadata so every log record can be
    # traced back to the originating request.
    if correlation_id:
        self.update_state(state='PROGRESS', meta={'correlation_id': correlation_id})
    set_task_log_context(self, correlation_id=correlation_id, user_id=user_id)

    if not tracks or not user_id:
        return 0

    # Remove any tracks which are the user's local tracks
    filtered_tracks = [track for track in tracks if not track.get("is_local", False)]

    if not filtered_tracks:
        return 0

    try:
        database.update_track_statistics(filtered_tracks)
    except Exception as e:
        logError(
            f"update_track_statistics failed user_id={user_id} error={e}",
            exc_info=True,
        )
        raise
    num_tracks_updated = len(filtered_tracks)
    logInfo("User: " + user_id + "; Successfully stored tracks: " + str(num_tracks_updated))
    return num_tracks_updated
