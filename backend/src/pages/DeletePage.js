import React, { useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet";
import ErrorMessage from "../components/ErrorMessage";

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
            .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/delete`,
                {
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
                setIsSuccess(true);
                setIsLoading(false);
                setIsError(false);
            })
            .catch(error => {
                setIsLoading(false);
                setIsError({ message: "Unable to connect to Spotify, please try again later" });
            });
    }


    useEffect(() => {
        setAuth(localStorage.getItem("accessToken") != null);
    }, [isAuth]);

    return (
        <main>
            <Helmet>
                <title>Delete Playlists | True Shuffle</title>
            </Helmet>
            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>Delete</Typography>
            {auth === true ? (
                <Box>
                    <div className={"titleContainer"}>
                        <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Clear shuffled playlists from
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
                                textAlign: "left"
                            }}>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                                Instructions:
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                1. Just click the below button to remove all shuffled playlists from your Spotify account. This will not affect any of your existing playlists and only delete playlists named "[Shuffled] ..."
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
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
                            <Box sx={{ paddingTop: "10px" }}>
                                <Typography variant='h6' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                                    <strong>Successfully deleted</strong>
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
                                    }}
                                    onClick={() => deleteShuffledPlaylistsCall()}
                                >
                                    Delete shuffled playlists
                                </Button>
                            </Box>
                        }
                        {isError &&
                            <ErrorMessage error={isError} />
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
