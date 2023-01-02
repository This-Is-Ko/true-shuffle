import React, { useEffect } from "react";
import { getAccessTokenCall } from "../utils/SpotifyAuthService";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Grid, Backdrop, CircularProgress, Snackbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Helmet } from "react-helmet";

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
                <title>Home | True Shuffle</title>
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
                anchorOrigin= {{
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
                anchorOrigin= {{
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
                <Typography variant='h6' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                    Randomly shuffle your Spotify playlists
                </Typography>
                <div className={"centerSpacingContainer"}>
                    <Button
                        className={"largeButton"}
                        variant="contained"
                        disableElevation
                        sx={{
                            my: 2, color: 'white', display: 'block', bgcolor: "#1DB954",
                            "&:hover": { backgroundColor: "#ac2ca5" },
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
            <div className={"featuresContainer"}>
                <Typography variant='h3' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                    Features
                </Typography>
                <Grid
                    sx={{ paddingTop: "20px", margin: "0 auto" }}
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <Grid item sx={{ width: "auto", maxWidth: "400px", textAlign: "left" }}>
                        <img className={"featureIcon"}
                            src={process.env.PUBLIC_URL + 'assets/icons/equalizer.png'} alt={"headphones"} />
                        <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Shuffle
                        </Typography>
                        <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                            Create shuffled playlists at the click of a button without affecting your original playlist order
                        </Typography>
                        <Button
                            className={"normalButton"}
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2, color: 'white', bgcolor: "#1DB954",
                                "&:hover": { backgroundColor: "#ac2ca5" },
                            }}
                            href={"/shuffle"}
                        >Select</Button>
                    </Grid>
                    <Grid item sx={{ width: "auto", maxWidth: "400px", textAlign: "left" }}>
                        <img className={"featureIcon"}
                            src={process.env.PUBLIC_URL + 'assets/icons/equalizer.png'} alt={"headphones"} />
                        <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Remove all shuffled
                        </Typography>
                        <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                            Easy function to clean up created shuffled playlists while keeping all your original playlists
                        </Typography>
                        <Button
                            className={"normalButton"}
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2, color: 'white', bgcolor: "#1DB954",
                                "&:hover": { backgroundColor: "#ac2ca5" },
                            }}
                            href={"/#"}
                        >Select</Button>
                    </Grid>
                </Grid>
            </div>
        </main>
    );
}

export default Main;
