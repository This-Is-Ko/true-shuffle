import React, { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import ShufflePlaylistResponse from "./ShufflePlaylistResponse";
import LoadingMessage from "./LoadingMessage";

// class ShufflePlaylistContainer extends React.Component {
const ShufflePlaylistContainer = ({ isAuth, setIsAuth }) => {
    const [playlistUri, setPlaylistUri] = React.useState("");
    const [isError, setIsError] = React.useState(false);

    const useQuery = () => {
        return new URLSearchParams(window.location.search);
    }

    const getShuffleCall = () => {
        if (!(useQuery().get('playlistId') == null || useQuery().get('playlistId') === "")) {
            // Call shuffle
            axios
                .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/shuffle`,
                    {
                        is_use_liked_tracks: "false",
                        playlist_id: useQuery().get('playlistId'),
                        playlist_name: useQuery().get('playlistName'),
                        is_make_new_playlist: "false",
                        spotify_access_info: {
                            access_token: localStorage.getItem("accessToken"),
                            refresh_token: localStorage.getItem("refreshToken"),
                            expires_at: localStorage.getItem("expiresAt"),
                            scope: localStorage.getItem("scope"),
                            token_type: localStorage.getItem("tokenType"),
                        }
                    },
                    { headers: { "Content-Type": "application/json" } })
                .then(result => {
                    setPlaylistUri(result.data.playlist_uri);
                    setIsError(false);
                })
                .catch(error => {
                    setIsError(error);
                });
        } else {
            setIsError({ message: "No playlist selected" });
        }
    };

    useEffect(() => {
        getShuffleCall();
    }, []);

    return (
        <div className="shuffle-container">
            {isError ? (
                <ErrorMessage error={isError} isGeneric={true} />
            ) : (
                playlistUri !== "" ? (
                    <ShufflePlaylistResponse playlistUri={playlistUri} />
                ) : (
                    <div className="loading-container">
                        <CircularProgress />
                        <LoadingMessage />
                    </div>
                )
            )}
        </div>
    )
}

export default ShufflePlaylistContainer