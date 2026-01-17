import React, { useEffect } from "react";
import { getAccessTokenCall } from "../utils/SpotifyAuthService";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import { Typography, Button, Backdrop, CircularProgress, Snackbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Box } from "@mui/system";
import { Helmet } from "react-helmet";

import Footer from "./Footer";
import MainPageFeaturesContainer from "./mainPageComponents/MainPageFeaturesContainer";
import { getStatisticsApi } from "../utils/StatisticsService";
import StatItem from "./mainPageComponents/StatItem";

const Main = ({ loginUri, isAuth, setIsAuth }) => {
    const [loadingAccessToken, setLoadingAccessToken] = React.useState(false);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const [trackCounter, setTrackCounter] = React.useState(null);
    const [playlistCounter, setPlaylistCounter] = React.useState(null);
    const [analysisCounter, setAnalysisCounter] = React.useState(null);

    const navigate = useNavigate();

    function getQueryParams() {
        return new URLSearchParams(window.location.search);
    }

    const handleMessageClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSuccessMessage(false)
        setShowErrorMessage(false);
    };

    useEffect(() => {
        getAccessTokenCall(getQueryParams().get('code'), setIsAuth, navigate, setLoadingAccessToken, setShowErrorMessage, setShowSuccessMessage);
        getStatisticsApi(setTrackCounter, setPlaylistCounter, setAnalysisCounter);
    }, [isAuth, navigate, setIsAuth]);


    return (
        <main>
            <Helmet>
                <title>Home | True Shuffle for Spotify</title>
                <meta name="description" content="True Shuffle is a Spotify shuffler that creates truly random playlist orders with no bias. Shuffle playlists and liked songs properly." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.trueshuffle.top/" />
                <meta property="og:title" content="True Shuffle - True Spotify Playlist Shuffler" />
                <meta property="og:description" content="A true Spotify shuffler that fixes Spotify’s biased shuffle. Randomize playlists and liked songs with real randomness." />
                <meta property="og:url" content="https://www.trueshuffle.top/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.trueshuffle.top/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingAccessToken}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar
                open={showErrorMessage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                autoHideDuration={10000}
                onClose={handleMessageClose}
                message="Login error. Please try again later"
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleMessageClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>}
            />
            <Snackbar
                open={showSuccessMessage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                autoHideDuration={10000}
                onClose={handleMessageClose}
                message="Successfully logged in"
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleMessageClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>}
            />

            <div className={"mainTopContainer"}>
                <Typography variant='h1' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                    True Shuffle
                </Typography>
                
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    paddingTop: "10px",
                    color: "white",
                    textAlign: "center",
                    maxWidth: "90%",
                    margin: "0 auto"
                  }}
                >
                    Properly shuffle your Spotify playlists and analyse stats about your library
                </Typography>

                <Box className={"centerSpacingContainer"}>
                    <Button
                        className={"largeButton"}
                        variant="contained"
                        disableElevation
                        sx={{
                            my: 2, color: 'white', display: 'block', bgcolor: "#1DB954",
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                        href="/shuffle"
                    >
                        <img 
                            className={"spotifyNameLogo"}
                            src={process.env.PUBLIC_URL + 'assets/icons/spotify-logo-white.svg'} 
                            alt={"spotify logo"}
                            style={{ height: '25px', width: 'auto' }}
                        />
                        Get started
                    </Button>
                </Box>
            </div>
            
            <div className={"mainPageStatsContainer"}>
                <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                    Current Stats
                </Typography>
                <Grid
                    sx={{ paddingTop: "20px", paddingBottom: "20px" }}
                    container
                    // spacing={1}
                    columnSpacing={9}
                    justifyContent="center"
                    alignItems="center"
                >
                    <StatItem stat={trackCounter} description="Shuffled tracks"></StatItem>
                    <StatItem stat={playlistCounter} description="Shuffled playlists"></StatItem>
                    <StatItem stat={analysisCounter} description="Libraries analysed"></StatItem>
                </Grid>
            </div>

            <Box sx={{ width: { xs: "90%", sm: '90%', md: "70%", lg: "60%", xl: "50%" }, margin: "0 auto", paddingBottom: "32px", justifyContent: "center" }}>
                <MainPageFeaturesContainer />
            </Box>

            <Footer></Footer>
        </main>
    );
}

export default Main;
