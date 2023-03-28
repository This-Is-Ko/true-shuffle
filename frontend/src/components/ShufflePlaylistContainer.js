import React, { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import ShufflePlaylistResponse from "./ShufflePlaylistResponse";
import LoadingMessage from "./LoadingMessage";

// class ShufflePlaylistContainer extends React.Component {
const ShufflePlaylistContainer = ({ isAuth, setIsAuth }) => {
    const [playlistUri, setPlaylistUri] = React.useState("");
    const [error, setError] = React.useState(false);

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
                        is_make_new_playlist: "false"
                    },
                    { headers: { "Content-Type": "application/json" }, withCredentials: true })
                .then(result => {
                    setPlaylistUri(result.data.playlist_uri);
                    setError(false);
                })
                .catch((responseError) => {
                    if (responseError.response.status === 401) {
                        setError({ message: "Unable to authenticate your account, please logout and try again" });
                    } else {
                        setError({ message: "Unable to connect to Spotify, please try again later" });
                    }
                });
        } else {
            setError({ message: "No playlist selected" });
        }
    };

    useEffect(() => {
        getShuffleCall();
    }, []);

    return (
        <div className="shuffle-container">
            {error !== false ? (
                <ErrorMessage error={error} isGeneric={false} />
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