from datetime import datetime, timezone


class SpotifyAuth:
    def __init__(
            self,
            user_id=None,
            access_token=None,
            refresh_token=None,
            expires_at=None,
            scope=None,
            session_expiry=None,
            is_admin=None
            ):
        self.user_id = user_id
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.expires_at = expires_at
        self.scope = scope
        self.token_type = "Bearer"
        self.session_expiry = session_expiry
        self.is_admin = is_admin

    @classmethod
    def from_session_entry(cls, session_entry):
        return cls(
            user_id=session_entry["user_id"],
            access_token=session_entry["access_token"],
            refresh_token=session_entry["refresh_token"],
            expires_at=session_entry["expires_at"],
            scope=session_entry["scope"],
            session_expiry=None,
            is_admin=session_entry.get("is_admin", False)
        )

    def is_expired(self):
        return self.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc)

    def to_dict(self):
        data = {}
        # Add non-None attribute values to the dictionary
        if self.user_id is not None:
            data["user_id"] = self.user_id
        if self.access_token is not None:
            data["access_token"] = self.access_token
        if self.refresh_token is not None:
            data["refresh_token"] = self.refresh_token
        if self.expires_at is not None:
            data["expires_at"] = self.expires_at
        if self.scope is not None:
            data["scope"] = self.scope
        if self.token_type is not None:
            data["token_type"] = self.token_type
        if self.session_expiry is not None:
            data["session_expiry"] = self.session_expiry
        if self.is_admin is not None:
            data["is_admin"] = self.is_admin
        return data
