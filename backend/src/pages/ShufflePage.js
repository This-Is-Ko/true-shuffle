import React, { useEffect } from "react";
import PlaylistContainer from "../components/PlaylistContainer";
import { Typography, Button, Box } from "@mui/material";
import RestrictedAccessPage from './RestrictedAccessPage'

const ShufflePage = ({ isAuth }) => {
    const [auth, setAuth] = React.useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [newPlaylistUri, setNewPlaylistUri] = React.useState("");
    const [showDetailsTab, setShowDetailsTab] = React.useState(false);

    const selectPlaylist = (playlistId, playlistName) => {
        // console.log("clicked playlist " + playlistId + " " + playlistName);
        setNewPlaylistUri(playlistId)
    };

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth, newPlaylistUri]);

    return (
        <main>
            {auth === true ? (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography align="center" variant='body1' component="div"
                            sx={{
                                width: { sm: '90%', md: "50%" },
                                minWidth: "200px", maxWidth: "600px", paddingTop: "10px", color: "lightgrey"
                            }}>
                            Welcome to True Shuffle! Here you can select a playlist and a new playlist will be created in a truly random order. Unlike Spotifiy's algorithm there is no preference towards certain tracks so the order will be unique each time.
                            <br />
                            <br />
                            To see how to use True Shuffle, click the "How To" button below.
                        </Typography>
                    </Box>
                    <Box sx={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2,
                                color: "white",
                                display: "block",
                                bgcolor: "#1DB954",
                            }}
                            onClick={() => setShowDetailsTab(prev => !prev)}
                        >
                            How to
                        </Button>
                    </Box>
                    {showDetailsTab &&
                        <Box
                            sx={{
                                margin: "auto",
                                width: { xs: "90%", sm: '90%', md: "50%", lg: "40%", xl: "35%" },
                                textAlign: "left",
                            }}>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "lightgrey" }}>
                                Instructions:
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "lightgrey" }}>
                                1. Select a playlist below. If the playlist you want isn't appearing, ensure it is either a playlist you created or are following
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "lightgrey" }}>
                                2. A new playlist will be created named "[Shuffled]" and your playlist name e.g. [Shuffled] My Playlist
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "lightgrey" }}>
                                3. If you have already shuffled the playlist before, the existing shuffled one will be replaced (Prevents build up of playlists in your account)
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "lightgrey" }}>
                                4. Enjoy!
                            </Typography>
                        </Box>
                    }
                    <PlaylistContainer selectPlaylist={selectPlaylist} />
                </Box>
            ) : newPlaylistUri !== "" ? (<h1 className={"normalTitle"}> a playlist</h1>) : <RestrictedAccessPage />
            }
        </main >
    );
};

export default ShufflePage;
