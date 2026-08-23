from datetime import datetime, timezone

from flask_pymongo import PyMongo
from main import mongo
import pymongo
from pymongo.collection import ReturnDocument
from bson.objectid import ObjectId
from utils.constants import USER_ID_KEY, IS_ADMIN_KEY, CREATED_AT_KEY


# Liked tracks history functions
def insert_liked_tracks_history_entry(tracker_entry):
    return mongo.db.liked_tracks_history.insert_one(tracker_entry)


def find_user_latest_liked_tracks_history_entry(user_id):
    return mongo.db.liked_tracks_history.find_one(
        {USER_ID_KEY: user_id},
        sort=[('_id', pymongo.DESCENDING)]
    )


def get_all_user_liked_tracks_history_data(user_id):
    return mongo.db.liked_tracks_history.find(
        {USER_ID_KEY: user_id},
        # {USER_ID_KEY: 0, "_id": 0},
        sort=[('_id', pymongo.ASCENDING)]
    )


# Shuffled history total shuffle counters functions


def find_shuffle_counter(user_id):
    return mongo.db.shuffle_history.find_one(
        {USER_ID_KEY: user_id}
    )


def find_and_update_shuffle_counter(user_id, shuffle_history_counter):
    return mongo.db.shuffle_history.find_one_and_update(
        {USER_ID_KEY: user_id},
        {"$set": shuffle_history_counter},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )


# Track statistics update function
def update_track_statistics(tracks):
    """
    Increments the shuffle count or inserts new tracks if missing.
    """
    bulk_updates = [
        pymongo.UpdateOne(
            {"track_id": track["id"]},
            {
                "$set": {
                    "track_name": track["name"],
                    "artists": [
                        {"artist_id": artist["id"], "artist_name": artist["name"]}
                        for artist in track["artists"]
                    ]
                },
                "$inc": {"shuffle_count": 1}
            },
            upsert=True
        )
        for track in tracks
    ]

    if bulk_updates:
        mongo.db.track_statistics.bulk_write(bulk_updates)


def get_top_tracks(limit: int):
    """
    Retrieves the top shuffled tracks sorted by shuffle count.
    """
    return mongo.db.track_statistics.find(
        {},
        {"_id": 0, "track_id": 1, "track_name": 1, "shuffle_count": 1}
    ).sort("shuffle_count", -1).limit(limit)


def get_top_artists(limit: int):
    """
    Aggregates shuffle counts by artist and returns the top artists.
    """
    pipeline = [
        # Unwind the artists array to treat each artist separately
        {"$unwind": "$artists"},
        # Group by artist_id and sum shuffle_count
        {"$group": {
            "_id": "$artists.artist_id",
            "artist_name": {"$first": "$artists.artist_name"},
            "total_shuffles": {"$sum": "$shuffle_count"}
        }},
        {"$sort": {"total_shuffles": -1}},
        {"$limit": limit},
        {"$project": {
            "_id": 0,
            "artist_id": "$_id",
            "artist_name": 1,
            "total_shuffles": 1
        }}
    ]

    return list(mongo.db.track_statistics.aggregate(pipeline))


# User functions


def find_and_update_user(user_id, user_entry):
    return mongo.db.users.find_one_and_update(
        {USER_ID_KEY: user_id},
        {
            "$set": user_entry,
            "$setOnInsert": {
                CREATED_AT_KEY: datetime.now(timezone.utc),
                IS_ADMIN_KEY: False,
            },
        },
        upsert=True,
        return_document=ReturnDocument.AFTER
    )


def find_user(user_id):
    return mongo.db.users.find_one(
        {USER_ID_KEY: user_id}
    )


def get_all_users_with_attribute(attribute_name, attribute_value):
    return mongo.db.users.find({"user_attributes." + attribute_name: attribute_value})


# Session functions

def find_session(session_id):
    return mongo.db.sessions.find_one(
        {"session_id": session_id}
    )


def find_and_update_session(hashed_session_id, session_entry):
    return mongo.db.sessions.find_one_and_update(
        {"session_id": hashed_session_id},
        {"$set": session_entry},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )


def delete_session(session_id):
    return mongo.db.sessions.delete_one(
        {"session_id": session_id},
    )


def delete_expired_session(current_datetime):
    return mongo.db.sessions.delete_many(
        {"session_expiry": {"$lt": current_datetime}},
    )


# User/session count functions

def count_users():
    return mongo.db.users.count_documents({})


def count_active_sessions(current_datetime):
    return mongo.db.sessions.count_documents(
        {"session_expiry": {"$gt": current_datetime}}
    )


# Shuffle events functions

def insert_shuffle_event(shuffle_event):
    return mongo.db.shuffle_events.insert_one(shuffle_event)


def get_recent_shuffle_events(limit):
    return list(mongo.db.shuffle_events.find(
        {},
        {"_id": 0},
    ).sort("shuffled_at", pymongo.DESCENDING).limit(limit))


def get_recent_shuffle_failures(limit):
    return list(mongo.db.shuffle_events.find(
        {"status": "failed"},
        {"_id": 0},
    ).sort("shuffled_at", pymongo.DESCENDING).limit(limit))


def get_user_recent_shuffle_events(user_id, limit):
    return list(mongo.db.shuffle_events.find(
        {"user_id": user_id},
        {"_id": 0},
    ).sort("shuffled_at", pymongo.DESCENDING).limit(limit))


def count_shuffle_events():
    return mongo.db.shuffle_events.count_documents({})


def count_shuffle_failures():
    return mongo.db.shuffle_events.count_documents({"status": "failed"})


def get_shuffle_averages():
    result = list(mongo.db.shuffle_events.aggregate([
        {"$match": {"status": "success"}},
        {
            "$group": {
                "_id": None,
                "avg_tracks_per_shuffle": {"$avg": "$tracks_shuffled"},
                "avg_shuffle_duration_seconds": {"$avg": "$duration_seconds"},
            }
        },
    ]))
    if result:
        return {
            "avg_tracks_per_shuffle": result[0].get("avg_tracks_per_shuffle", 0),
            "avg_shuffle_duration_seconds": result[0].get("avg_shuffle_duration_seconds", 0),
        }
    return {"avg_tracks_per_shuffle": 0, "avg_shuffle_duration_seconds": 0}


def get_monthly_active_users():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "month": {"$dateToString": {"format": "%Y-%m", "date": "$shuffled_at"}},
                    "user_id": "$user_id",
                }
            }
        },
        {
            "$group": {
                "_id": "$_id.month",
                "active_users": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
        {"$project": {"_id": 0, "month": "$_id", "active_users": 1}},
    ]
    return list(mongo.db.shuffle_events.aggregate(pipeline))


def get_shuffle_failure_rate(group_by):
    format_map = {"day": "%Y-%m-%d", "week": "%G-%V", "month": "%Y-%m"}
    date_format = format_map.get(group_by, "%Y-%m-%d")
    pipeline = [
        {
            "$group": {
                "_id": {"$dateToString": {"format": date_format, "date": "$shuffled_at"}},
                "total": {"$sum": 1},
                "failures": {"$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}},
            }
        },
        {"$sort": {"_id": 1}},
        {
            "$project": {
                "_id": 0,
                "period": "$_id",
                "total": 1,
                "failures": 1,
                "rate": {"$cond": [{"$eq": ["$total", 0]}, 0, {"$divide": ["$failures", "$total"]}]},
            }
        },
    ]
    return list(mongo.db.shuffle_events.aggregate(pipeline))


def get_monthly_created_users(months):
    """
    Returns the number of users created per month for the last `months` months
    (including the current month). Months with no new users are included with 0.
    """
    today = datetime.now(timezone.utc)
    current_month_index = today.year * 12 + (today.month - 1)
    start_index = current_month_index - (months - 1)

    start_year, start_month_0based = divmod(start_index, 12)
    start = datetime(start_year, start_month_0based + 1, 1, tzinfo=timezone.utc)

    pipeline = [
        {
            "$match": {
                CREATED_AT_KEY: {"$gte": start, "$type": "date"},
            }
        },
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m", "date": "$" + CREATED_AT_KEY}},
                "created_users": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
        {"$project": {"_id": 0, "month": "$_id", "created_users": 1}},
    ]
    counts = {
        entry["month"]: entry["created_users"]
        for entry in mongo.db.users.aggregate(pipeline)
    }

    result = []
    for offset in range(months):
        index = start_index + offset
        year, month_0based = divmod(index, 12)
        month_str = "%04d-%02d" % (year, month_0based + 1)
        result.append({
            "month": month_str,
            "created_users": counts.get(month_str, 0),
        })
    return result
