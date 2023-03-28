import React, { useEffect } from "react";
import { Typography, Button, Box, Stack, Paper } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet";
import RestrictedAccessPage from './RestrictedAccessPage'
import { HowToDeletePlaylistsEntry } from '../components/howToComponents/HowToEntries';
import HowToModal from "../components/howToComponents/HowToModal";

const DeletePage = ({ isAuth }) => {
    const [auth, setAuth] = React.useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [isHowToModalOpen, setIsHowToModalOpen] = React.useState(false);

    const handleHowToModalOpen = () => setIsHowToModalOpen(true);
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth]);

    const deleteShuffledPlaylistsCall = () => {
        // Call delete shuffled playlists
        setIsLoading(true);
        axios
            .delete(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/delete`,
                { withCredentials: true }
            ).then(result => {
                setIsLoading(false);
                setIsError(false);
                setStep(2);
            }).catch(error => {
                setIsLoading(false);
                setIsError({ message: "Unable to connect to Spotify, please try again later" });
            });
    }

    const handleSubmit = async () => {
        setStep(1);
        setIsLoading(true);
        deleteShuffledPlaylistsCall()
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
                    <div>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Box sx={{ width: '100%' }}>
                                <Stack spacing={1}>
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
                                            Start
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div>
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
                                    bgcolor: "#1DB954"
                                }}
                                href="/shuffle"
                            >
                                Return to shuffle
                            </Button>
                        </Box>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <main>
            <Helmet>
                <title>Delete Playlists | True Shuffle for Spotify</title>
            </Helmet>
            <Paper component={Stack} sx={{ height: "90vh", alignItems: "center", justifyContent: "center", boxShadow: "none", backgroundColor: "#292e2f" }}>
                <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>Delete</Typography>
                <Typography variant='h6' component="div" sx={{ paddingTop: "10px", color: "white" }}>Clear all your True Shuffled playlists with one click</Typography>
                <Box>
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
                            onClick={handleHowToModalOpen}
                        >
                            How to
                        </Button>
                    </Box>
                    <HowToModal isModalOpen={isHowToModalOpen} handleClose={handleHowToModalClose} steps={HowToDeletePlaylistsEntry}></HowToModal>
                </Box>
                <Box>
                    {!isError && renderSwitch(step)}
                </Box>
                {isError &&
                    <Box>
                        {/* <ErrorMessage error={isError} isGeneric={true}/> */}
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
    );
};

export default DeletePage;
