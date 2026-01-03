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
        <Box sx={{ 
            width: { xs: "90%", sm: "50%" }, 
            margin: "auto" 
        }}>
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

            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                About
            </Typography>
            <Box 
                component="img"
                className="about-image"
                src={process.env.PUBLIC_URL + '/assets/images/listening.png'}
                alt="listening to music"
                sx={{ width: "300px", height: "300px", maxWidth: "100%", maxHeight: "100%" }}
            />
            <Typography variant='body1' component="div" sx={{ paddingTop: "20px", color: "white", textAlign: 'left' }}>
                Have you been wondering how to get a truly random shuffle experience on Spotify?
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                Welcome to True Shuffle, a way to shuffle your Spotify music without the same tracks being played repeatedly.
            </Typography>
            <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                How does it work?
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                True Shuffle allows you to randomly reorder your playlists to create a shuffled experience.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                In case you have a custom playlist order you would like to keep, we create a copy of your playlist which can easily be deleted at any time.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                If you add new music on Spotify, just shuffle again and the new tracks will be added to your shuffled playlist.
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
                This application only stores the Spotify user ID, access token to retrieved Liked Songs and counters for shuffles. 
                Cookies are used to keep you logged in and able to interact with the site. No passwords are stored and all authentication is handled by Spotify.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                Images were created by
                <Link underline="none" href={"https://www.flaticon.com/authors/paulalee"}> paulalee </Link>
                and icons by
                <Link underline="none" href={"https://www.flaticon.com/authors/freepik"}> Freepik </Link>
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                Spotify brand logos have been provided by Spotify.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", paddingBottom: "20px", color: "white", textAlign: 'left' }}>
                For any help or feedback, feel free to send me an email <Link underline="none" href={"mailto:" + process.env.REACT_APP_CONTACT_EMAIL_ADDRESS}>here</Link>.
            </Typography>
            <Footer></Footer>
        </Box>
    );
}

export default AboutPage;
