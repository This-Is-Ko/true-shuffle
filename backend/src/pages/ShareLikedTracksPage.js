import React, { useEffect } from "react";
import { Typography, Button, Box, TextField, Stack, Paper } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet";
import ErrorMessage from "../components/ErrorMessage";

import RestrictedAccessPage from './RestrictedAccessPage'

const ShareLikedTracksPage = ({ isAuth }) => {
    const [auth, setAuth] = React.useState(
        localStorage.getItem("accessToken") != null
    );
    const [showDetailsTab, setShowDetailsTab] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [playlistName, setPlaylistName] = React.useState("");

    useEffect(() => {
        setAuth(localStorage.getItem("accessToken") != null);
    }, [isAuth]);

    const createLikedTracksPlaylistsCall = () => {
        // Call create liked tracks playlist
        setIsLoading(true);
        axios
            .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/share/liked-tracks`,
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
                setStep(3);
            })
            .catch(error => {
                setIsLoading(false);
                setIsError({ message: "Unable to connect to Spotify, please try again later" });
            });
    }

    const handlePlaylistNameChange = (e) => {
        setPlaylistName(e.target.value);
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setStep(2);
        setIsLoading(true);
        createLikedTracksPlaylistsCall()
    };

    const handleRetry = async () => {
        setStep(1);
        setIsError(false)
        setIsLoading(false);
    };

    if (auth === false) {
        return <RestrictedAccessPage />
    }

    const renderSwitch = (step) => {
        switch (step) {
            case 1:
                return (
                    <Box sx={{ display: "block" }}>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2,
                                color: "white",
                                bgcolor: "#1DB954",
                            }}
                            onClick={handleNext}
                        >
                            Start
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <div>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Box sx={{ width: '100%' }}>
                                <Stack spacing={1}>
                                    <Box>
                                        <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                            Enter a playlist name or leave as default
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <TextField
                                            id="filled-basic"
                                            label="Playlist Name"
                                            variant="filled"
                                            defaultValue="My Liked Songs"
                                            onChange={handlePlaylistNameChange}
                                            inputProps={{ style: { color: "white" } }}
                                            sx={{
                                                "& .MuiFormLabel-root": {
                                                    color: 'white'
                                                },
                                                "& .MuiFormLabel-root.Mui-focused": {
                                                    color: 'white'
                                                },
                                                "& .MuiInputBase-root.Mui-disabled": {
                                                    color: "white"
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            sx={{
                                                my: 2,
                                                color: "white",
                                                bgcolor: "#1DB954",
                                            }}
                                            onClick={handleSubmit}
                                        >
                                            Create
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div>
                        <Typography variant='h6' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                            <strong>Successfully created your new playlist</strong>
                        </Typography>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <main>
            <Helmet>
                <title>Share Liked Songs | True Shuffle</title>
            </Helmet>
            <Paper component={Stack} sx={{ height: "90vh", alignItems: "center", justifyContent: "center", boxShadow: "none", backgroundColor: "#292e2f" }}>
                <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>Share</Typography>
                <Typography variant='h6' component="div" sx={{ paddingTop: "10px", color: "white" }}>Easily share your Spotify library by creating a playlist containing all your liked songs</Typography>
                <Box sx={{
                    width: "90%",
                }}>
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
                                1. Click "Start"
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                2. Enter a playlist name or leave as default
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                3. A new playlist will be created with all the songs currently in your Liked Songs
                            </Typography>
                        </Box>
                    }
                </Box>
                <Box>
                    {!isError && renderSwitch(step)}
                </Box>
                {isError &&
                    <Box>
                        {/* <ErrorMessage error={isError} /> */}
                        <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                            Something went wrong. Please try again later.
                        </Typography>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2,
                                color: "white",
                                bgcolor: "#1DB954",
                            }}
                            onClick={handleRetry}
                        >
                            Retry
                        </Button>
                    </Box>
                }
            </Paper>
        </main>
    )
};

export default ShareLikedTracksPage;
