import React from "react";
import { Typography, Button, Link, Box } from "@mui/material";


const SPOTIFY_AUTH_URI = process.env.REACT_APP_SPOTIFY_AUTH_URI;

const AboutPage = () => {
    return (
        // <main className="loading-container">
            <Box sx={{ width:"90%", margin:"auto"}}>
            <Typography variant='h2' component="div" sx={{paddingTop:"20px", color:"white"}}>
                About
            </Typography>
            <img className="about-image"
                src={process.env.PUBLIC_URL + '/assets/images/listening.png'} alt={"listening to music"} />
            <Typography variant='body1' component="div" sx={{paddingTop:"20px", color:"white"}}>
                Welcome to True Shuffle, a way to shuffle your Spotify music without the same music being recommended repeatedly.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop:"10px", color:"white"}}>
                This application doesn't store any user data and all authentication is handled by Spotify.
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop:"10px", color:"white"}}>
                Images were created by 
                <Link  underline="none" href={"https://www.flaticon.com/authors/paulalee"}> paulalee </Link>
                and icons by 
                <Link  underline="none" href={"https://www.flaticon.com/authors/freepik"}> Freepik </Link>
            </Typography>
            </Box>
        // </main>
    );
}

export default AboutPage;
