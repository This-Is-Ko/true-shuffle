import React, { useEffect } from "react";
import { getAccessTokenCall } from "../utils/SpotifyAuthService";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Grid } from "@mui/material";

const AUTH_CODE_URL = process.env.REACT_APP_BACKEND_PATH + "/api/spotify/auth/code";

const SPOTIFY_AUTH_URI = process.env.REACT_APP_SPOTIFY_AUTH_URI;

const Main = ({ loginUri, isAuth, setIsAuth }) => {
    // const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
    // const [localLoginUri, setLocalLoginUri] = React.useState("/#");
    const navigate = useNavigate();

    function useQuery() {
        return new URLSearchParams(window.location.search);
    }

    useEffect(() => {
        getAccessTokenCall(useQuery().get('code'), setIsAuth, navigate);
    }, [isAuth]);

    return (
        <>
            <main>
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
                                href={"/playlists"}
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
        </>
    );
}

export default Main;
