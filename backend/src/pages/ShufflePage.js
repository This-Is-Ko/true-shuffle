import React, { useEffect } from "react";
import PlaylistContainer from "../components/PlaylistContainer";
import { Typography, Button, Box } from "@mui/material";


const SPOTIFY_AUTH_URI = process.env.REACT_APP_SPOTIFY_AUTH_URI;

const ShufflePage = ({ isAuth }) => {
    const [auth, setAuth] = React.useState(
        localStorage.getItem("accessToken") != null
    );
    const [newPlaylistUri, setNewPlaylistUri] = React.useState("");
    const [showDetailsTab, setShowDetailsTab] = React.useState(false);

    function useQuery() {
        return new URLSearchParams(window.location.search);
    }

    const selectPlaylist = (playlistId, playlistName) => {
        console.log("clicked playlist " + playlistId + " " + playlistName);
        setNewPlaylistUri(playlistId)
    };

    useEffect(() => {
        setAuth(localStorage.getItem("accessToken") != null);
    }, [isAuth, newPlaylistUri]);

    return (
        <main>
            {auth === true ? (
                <Box>
                    <div className={"titleContainer"}>
                        <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Select a playlist from 
                        </Typography>
                        <img className={"spotifyNameLogoSubtitle"}
                                src={process.env.PUBLIC_URL + 'assets/icons/spotify-logo-green-name.png'} alt={"spotify logo"} />
                    </div>
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
                                bgcolor: "#ac2ca5",
                                "&:hover": { backgroundColor: "#1DB954" },

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
                                width: { xs: "90%", sm: '90%', md: "50%", lg: "40%" , xl: "35%"  },
                                textAlign:"left",
                            }}>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                                Instructions:
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                1. Select a playlist below. If the playlist you want isn't appearing, ensure it is either a playlist you created or are following
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                2. A new playlist will be created named "[Shuffled]" and your playlist name e.g. [Shuffled] My Playlist
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                3. If you have already shuffled the playlist before, the existing shuffled one will be replaced
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                4. Enjoy!
                            </Typography>
                        </Box>
                    }
                    <PlaylistContainer selectPlaylist={selectPlaylist} />
                </Box>
            ) : newPlaylistUri !== "" ? (<h1 className={"normalTitle"}> a playlist</h1>) : (
                <div className="loading-container">
                    <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                        Login to your spotify account to continue
                    </Typography>
                    <div className={"centerSpacingContainer"}>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2,
                                color: "white",
                                display: "block",
                                bgcolor: "#1DB954",
                                "&:hover": { backgroundColor: "#ac2ca5" },
                            }}
                            href={SPOTIFY_AUTH_URI}
                        >
                            Get started
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ShufflePage;
