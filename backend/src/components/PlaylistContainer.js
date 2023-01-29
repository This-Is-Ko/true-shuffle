import React, { useEffect } from "react";
import axios from "axios";

import PlaylistList from "./PlaylistList";
import ErrorMessage from "./ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const PlaylistContainer = ({ selectPlaylist }) => {
    const [playlists, setPlaylists] = React.useState([]);
    const [error, setError] = React.useState(false);

    const getPlaylistsCall = () => {
        axios
            .post(process.env.REACT_APP_BACKEND_PATH + `/api/spotify/me/playlists`, {
                spotifyAccessInfo: {
                    access_token: localStorage.getItem("accessToken"),
                    refresh_token: localStorage.getItem("refreshToken"),
                    expires_at: localStorage.getItem("expiresAt"),
                    scope: localStorage.getItem("scope"),
                    token_type: localStorage.getItem("tokenType"),
                },
            })
            .then((result) => {
                setPlaylists(result.data.allPlaylists);
                setError(false);
            })
            .catch((error) => {
                console.log(error);
                setError({message: "Unable to connect to Spotify, please try again later"});
            });
    };

    useEffect(() => {
        getPlaylistsCall();
    }, []);

    return (
        <Box sx={{paddingBottom: "10px"}}>
            {error ? (
                <ErrorMessage error={error} />
            ) : playlists.length > 0 ? (
                <PlaylistList playlists={playlists} selectPlaylist={selectPlaylist} />
            ) : (
                <div className="loading-container">
                    <CircularProgress />
                </div>
            )}
        </Box>
    );
};

export default PlaylistContainer;
