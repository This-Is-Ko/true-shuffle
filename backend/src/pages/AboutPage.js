import React, { useEffect } from "react";
import { Typography, Link, Box } from "@mui/material";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import { getStatisticsApi } from "../utils/StatisticsService";
import { formatNumberWithSpaces } from "../utils/NumberFormatter";

const AboutPage = () => {
    const [trackCounter, setTrackCounter] = React.useState(null);
    const [playlistCounter, setPlaylistCounter] = React.useState(null);
    const [analysisCounter, setAnalysisCounter] = React.useState(null);

    useEffect(() => {
        getStatisticsApi(setTrackCounter, setPlaylistCounter, setAnalysisCounter);
    }, []);

    return (
        <Box>
            <Helmet>
                <title>About | True Shuffle for Spotify</title>
                <meta name="description" content="Learn more about Spotify True Shuffle and how it provides an authentic, random playlist shuffling experience." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.trueshuffle.top/about" />
                <meta property="og:title" content="About | True Shuffle for Spotify" />
                <meta property="og:description" content="Learn more about Spotify True Shuffle and how it provides an authentic, random playlist shuffling experience." />
                <meta property="og:url" content="https://www.trueshuffle.top/about" />
                <meta property="og:type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white", textAlign: "center" }}>
                About
            </Typography>

            <Box sx={{ 
                paddingBottom: "20px",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "center",
                width: "100%"
            }}>
                <Box
                    sx={{
                        width: { xs: "90%", sm: '90%', md: "70%", lg: "60%", xl: "50%" },
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box',
                        gap: 1
                    }}
                >
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        Welcome to True Shuffle, the Spotify Shuffler designed to bring back actual shuffling to Spotify.
                    </Typography>

                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                        How It Works
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        True Shuffle creates a new playlist containing all the tracks in a random order.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        True Shuffle preserves the original playlist order and the date that tracks were added to it. In case you have a custom playlist order you would like to keep, a copy of your playlist is created which can easily be deleted at any time.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        True Shuffle supports shuffling Liked Songs as well as playlists.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        When you add new tracks, just shuffle again and the new tracks will be included.
                    </Typography>

                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                        About the Project
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        This is a personal project created because I wasn't happy with the listening experience provided by Spotify's built-in shuffle. Certain tracks and artists would keep playing even with a large Liked Songs collection. I created this website in 2022 to rediscover my own library and to be able to listen to tracks buried under more recent tracks. Additional features like Sharing Liked Songs and library analysis were added down the line.
                    </Typography>

                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                        Free to Use
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        True Shuffle is completely free. Currently I personally cover the hosting costs for running True Shuffle.
                    </Typography>
                    
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        Any support is greatly appreciated! <Link underline="none" href="https://ko-fi.com/trueshuffle">Buy me a coffee</Link>
                    </Typography>

                    {trackCounter !== null && playlistCounter !== null &&
                        <div>
                            <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                                Statistics
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                                Shuffled tracks: {formatNumberWithSpaces(trackCounter)}
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                                Shuffled playlists: {formatNumberWithSpaces(playlistCounter)}
                            </Typography>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                                Libraries analysed: {formatNumberWithSpaces(analysisCounter)}
                            </Typography>
                        </div>
                    }

                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                        Privacy and Credit
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        This application stores the Spotify user ID, access token to retrieve Liked Songs. The count of shuffled tracks and playlists are also stored for each user so users can track how many times they used True Shuffle. Cookies are used to keep you logged in and able to interact with the site. No passwords are stored and all authentication is handled by Spotify.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        Spotify brand logos have been provided by Spotify.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", paddingBottom: "20px", color: "white", textAlign: 'left' }}>
                        For any help or feedback, feel free to send me an email <Link underline="none" href={"mailto:" + process.env.REACT_APP_CONTACT_EMAIL_ADDRESS}>here</Link>.
                    </Typography>
                </Box>
            </Box>
            <Footer></Footer>
        </Box>
    );
}

export default AboutPage;
