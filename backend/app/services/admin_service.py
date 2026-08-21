from datetime import datetime, timezone

from database import database
from utils.util import serialize_shuffle_events


def get_admin_overview():
    total_users = database.count_users()
    active_sessions = database.count_active_sessions(datetime.now(timezone.utc))

    overall_counter = database.find_shuffle_counter("overall_counter")
    total_playlists_shuffled = overall_counter.get("playlist_count", 0) if overall_counter else 0
    total_tracks_shuffled = overall_counter.get("track_count", 0) if overall_counter else 0

    averages = database.get_shuffle_averages()
    total_events = database.count_shuffle_events()
    total_failures = database.count_shuffle_failures()
    overall_failure_rate = (total_failures / total_events) if total_events else 0

    return {
        "total_users": total_users,
        "total_playlists_shuffled": total_playlists_shuffled,
        "total_tracks_shuffled": total_tracks_shuffled,
        "active_sessions": active_sessions,
        "total_failures": total_failures,
        "avg_tracks_per_shuffle": round(averages.get("avg_tracks_per_shuffle", 0) or 0, 2),
        "avg_shuffle_duration_seconds": round(averages.get("avg_shuffle_duration_seconds", 0) or 0, 2),
        "overall_failure_rate": round(overall_failure_rate, 4),
    }


def get_monthly_active_users():
    return database.get_monthly_active_users()


def get_recent_shuffles(limit):
    return serialize_shuffle_events(database.get_recent_shuffle_events(limit))


def get_recent_failures(limit):
    return serialize_shuffle_events(database.get_recent_shuffle_failures(limit))


def get_failure_rate(group_by):
    return database.get_shuffle_failure_rate(group_by)
