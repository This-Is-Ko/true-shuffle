import React, { useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Grid, Typography } from "@mui/material";

import PlaylistList from "./PlaylistList";
import ErrorMessage from "./ErrorMessage";
import OverallStatItemCard from "./analysisPageComponents/OverallStatItemCard";

const PlaylistContainer = ({ selectPlaylist }) => {
    const [playlists, setPlaylists] = React.useState([]);
    const [userShuffleCounter, setUserShuffleCounter] = React.useState(false);
    const [error, setError] = React.useState(false);

    const getPlaylistsCall = () => {
        axios
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/me?include-stats=true`, { withCredentials: true })
            .then((result) => {
                setPlaylists(result.data.all_playlists);
                if ("user_shuffle_counter" in result.data) {
                    setUserShuffleCounter(result.data.user_shuffle_counter);
                }
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
                <Box>
                    {userShuffleCounter !== false ?
                        <Grid
                            sx={{
                                margin: { sm: "auto", md: "0 auto", },
                                maxWidth: "600px"
                            }}
                            container
                            spacing={3}
                            justifyContent="center"
                            alignItems="flex-start"
                        >
                            <OverallStatItemCard title={"Playlists"} stat={userShuffleCounter.playlist_count} description={"Total number of playlists you've shuffled using True Shuffle"} />
                            <OverallStatItemCard title={"Songs"} stat={userShuffleCounter.track_count} description={"Total number of songs you've shuffled using True Shuffle"} />
                        </Grid>
                        :
                        <Box></Box>
                    }
                    <Typography variant='h4' component="div" sx={{ paddingTop: "30px", color: "white" }}>Select a playlist</Typography>
                    <PlaylistList playlists={playlists} selectPlaylist={selectPlaylist} />
                </Box>
            ) : (
                <div className="loading-container">
                    <CircularProgress />
                </div>
            )}
        </Box>
    );
};

export default PlaylistContainer;
