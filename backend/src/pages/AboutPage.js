import React, { useEffect } from "react";
import { Typography, Link, Box } from "@mui/material";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import { getStatisticsApi } from "../utils/StatisticsService";

const AboutPage = () => {
    const [trackCounter, setTrackCounter] = React.useState(null);
    const [playlistCounter, setPlaylistCounter] = React.useState(null);

    useEffect(() => {
        getStatisticsApi(setTrackCounter, setPlaylistCounter);
    }, []);

    return (
        <Box sx={{ width: "90%", margin: "auto" }}>
            <Helmet>
                <title>About | True Shuffle</title>
            </Helmet>
            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                About
            </Typography>
            <img className="about-image"
                src={process.env.PUBLIC_URL + '/assets/images/listening.png'} alt={"listening to music"} />
            <Typography variant='body1' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                Have you been wondering how to get a truly random shuffle experience on Spotify?
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                Welcome to True Shuffle, a way to shuffle your Spotify music without the same music being recommended repeatedly.
            </Typography>
            <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white" }}>
                How does it work?
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                True Shuffle allows you to randomly reorder your playlists to create a shuffled experience.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                In case you have a custom playlist order you would like to keep, we create a copy of your playlist which can easily be deleted at any time.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                If you add new music on Spotify, just shuffle again and the new tracks will be added to your shuffled playlist.
            </Typography>
            {trackCounter !== null && playlistCounter !== null && 
                <div>
                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white" }}>
                        Statistics
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>Shuffled tracks: {trackCounter} | Shuffled playlists: {playlistCounter}</Typography>
                </div>
            }
            <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white" }}>
                Privacy and Credit
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                This application doesn't store any of your data and all authentication is handled by Spotify.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                Images were created by
                <Link underline="none" href={"https://www.flaticon.com/authors/paulalee"}> paulalee </Link>
                and icons by
                <Link underline="none" href={"https://www.flaticon.com/authors/freepik"}> Freepik </Link>
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                Spotify brand logos have been provided by Spotify.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", paddingBottom: "20px", color: "white" }}>
                To contact, send a email <Link underline="none" href={"mailto:"+ process.env.REACT_APP_CONTACT_EMAIL_ADDRESS}>here</Link>.
            </Typography>
            <Footer></Footer>
        </Box>
    );
}

export default AboutPage;
