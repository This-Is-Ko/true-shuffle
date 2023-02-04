import React, { useEffect } from "react";
import { getAccessTokenCall } from "../utils/SpotifyAuthService";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Backdrop, CircularProgress, Snackbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Helmet } from "react-helmet";
import Footer from "./Footer";
import MainPageFeaturesContainer from "./mainPageComponents/MainPageFeaturesContainer";
import { Box } from "@mui/system";

const Main = ({ loginUri, isAuth, setIsAuth }) => {
    const [loadingAccessToken, setLoadingAccessToken] = React.useState(false);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

    const navigate = useNavigate();

    function useQuery() {
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
        getAccessTokenCall(useQuery().get('code'), setIsAuth, navigate, setLoadingAccessToken, setShowErrorMessage, setShowSuccessMessage);
    }, [isAuth]);

    return (
        <main>
            <Helmet>
                <title>Home | True Shuffle for Spotify</title>
                <meta name='description' content='Create shuffled Spotify playlists that are randomly ordered' />
                <link rel="canonical" href="https://www.trueshuffle.top/" />
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
                <img className={"spotifyNameLogo"}
                    src={process.env.PUBLIC_URL + 'assets/icons/spotify-logo-green-name.png'} alt={"spotify logo"} />
                <Typography variant='h6' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                    Randomly shuffle your Spotify playlists
                </Typography>
                <div className={"centerSpacingContainer"}>
                    <Button
                        className={"largeButton"}
                        variant="contained"
                        disableElevation
                        sx={{
                            my: 2, color: 'white', display: 'block', bgcolor: "#1DB954"
                        }}
                        href="/shuffle"
                    >Get started</Button>
                </div>

                <div className={"homepageIconHolder"}>
                    <div className={"iconSet"}>
                        <img className={"homepageIcon"}
                            src={process.env.PUBLIC_URL + '/assets/icons/video-player.png'} alt={"login"} />
                        <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Login to Spotify
                        </Typography>
                    </div>
                    <div className={"iconSet"}>
                        <img className={"homepageIcon"}
                            src={process.env.PUBLIC_URL + 'assets/icons/shuffle.png'} alt={"shuffle"} />
                        <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Select a playlist
                        </Typography>
                    </div>
                    <div className={"iconSet"}>
                        <img className={"homepageIcon"}
                            src={process.env.PUBLIC_URL + 'assets/icons/headphones.png'} alt={"headphones"} />
                        <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Start listening
                        </Typography>
                    </div>
                </div>
            </div>
            <Box sx={{ width: { xs: "90%", sm: '90%', md: "70%", lg: "60%", xl: "50%" }, margin: "0 auto", paddingBottom: "32px", justifyContent: "center" }}>
                <MainPageFeaturesContainer />
            </Box>
            <Footer></Footer>
        </main>
    );
}

export default Main;
