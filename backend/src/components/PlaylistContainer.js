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
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/me`, { withCredentials: true })
            .then((result) => {
                setPlaylists(result.data.all_playlists);
                setError(false);
            })
            .catch((error) => {
                setError({ message: "Unable to connect to Spotify, please try again later" });
            });
    };

    useEffect(() => {
        getPlaylistsCall();
    }, []);

    return (
        <Box sx={{ paddingBottom: "10px" }}>
            {error ? (
                <ErrorMessage error={error} isGeneric={true} />
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
