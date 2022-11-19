import React, { useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const SPOTIFY_AUTH_URI = process.env.REACT_APP_SPOTIFY_AUTH_URI;

const DeletePage = ({ isAuth }) => {
    const [auth, setAuth] = React.useState(
        localStorage.getItem("accessToken") != null
    );
    const [showDetailsTab, setShowDetailsTab] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const deleteShuffledPlaylistsCall = () => {
        // Call delete shuffled playlists
        setIsLoading(true);
        axios
            .post(process.env.REACT_APP_BACKEND_PATH + `/api/playist/delete`,
                {
                    spotifyAccessInfo: {
                        access_token: localStorage.getItem("accessToken"),
                        refresh_token: localStorage.getItem("refreshToken"),
                        expires_at: localStorage.getItem("expiresAt"),
                        scope: localStorage.getItem("scope"),
                        token_type: localStorage.getItem("tokenType"),
                    }
                },
                { headers: { "Content-Type": "application/json" } })
            .then(result => {
                console.log(result.data);
                setIsSuccess(true);
                setIsLoading(false);
                setIsError(false);
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false);
                setIsError(error);
            });
    }


    useEffect(() => {
        setAuth(localStorage.getItem("accessToken") != null);
    }, [isAuth]);

    return (
        <main>
            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>Delete</Typography>
            {auth == true ? (
                <Box>
                    <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                        Clear all shuffled playlists
                    </Typography>
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
                                width: "90%"
                            }}>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                                Instructions:
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ color: "white" }}>
                                1. Just use the below function to remove all shuffled playlists from your Spotify account
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ color: "white" }}>
                                Note: You don't need to remove an existing shuffled playlist to re-shuffle it
                            </Typography>
                        </Box>
                    }

                    <Box sx={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        {isSuccess &&
                            <Box>
                                <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                                    Successfully deleted
                                </Typography>
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
                                    href="/shuffle"
                                >
                                    Return to shuffle
                                </Button>
                            </Box>
                        }
                        {isLoading &&
                            <Box>
                                <CircularProgress />
                            </Box>
                        }
                        {!isLoading && !isSuccess && !isError &&
                            <Box>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                        bgcolor: "#1DB954",
                                        "&:hover": { backgroundColor: "#1DB954" },
                                    }}
                                    onClick={() => deleteShuffledPlaylistsCall()}
                                >
                                    Delete shuffled playlists
                                </Button>
                            </Box>
                        }
                    </Box>
                </Box>
            ) : (
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

export default DeletePage;
