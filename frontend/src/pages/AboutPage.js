import React, { useEffect } from "react";
import { Typography, Link, Box, List, ListItem, ListItemText } from "@mui/material";
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
                    True Shuffle is a Spotify playlist shuffler that delivers real randomness. Rediscover your music with a truly random shuffle experience.
                    </Typography>

                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                        How It Works
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        When you shuffle a playlist using True Shuffle:
                    </Typography>
                    <List component="ul" sx={{ paddingTop: "2px", color: "white", paddingLeft: "30px", listStyleType: "disc", listStylePosition: "outside" }}>
                        <ListItem component="li" sx={{ paddingTop: "2px", paddingBottom: "2px", display: "list-item", paddingLeft: "8px" }}>
                            <ListItemText primary="A new playlist is created with all tracks placed in a completely random order" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem component="li" sx={{ paddingTop: "2px", paddingBottom: "2px", display: "list-item", paddingLeft: "8px" }}>
                            <ListItemText primary="Your original playlist is left unchanged" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem component="li" sx={{ paddingTop: "2px", paddingBottom: "2px", display: "list-item", paddingLeft: "8px" }}>
                            <ListItemText primary='The original track order and "date added" metadata are preserved' sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem component="li" sx={{ paddingTop: "2px", paddingBottom: "2px", display: "list-item", paddingLeft: "8px" }}>
                            <ListItemText primary="The shuffled playlist can be deleted at any time" sx={{ color: "white" }} />
                        </ListItem>
                    </List>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        True Shuffle supports:
                    </Typography>
                    <List component="ul" sx={{ paddingTop: "2px", color: "white", paddingLeft: "30px", listStyleType: "disc", listStylePosition: "outside" }}>
                        <ListItem component="li" sx={{ paddingTop: "2px", paddingBottom: "2px", display: "list-item", paddingLeft: "8px" }}>
                            <ListItemText primary="Spotify playlists" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem component="li" sx={{ paddingTop: "2px", paddingBottom: "2px", display: "list-item", paddingLeft: "8px" }}>
                            <ListItemText primary="Liked Songs collections" sx={{ color: "white" }} />
                        </ListItem>
                    </List>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white", textAlign: 'left' }}>
                        When you add new tracks, simply shuffle again and the new songs are included automatically.
                    </Typography>

                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                        About the Project
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        True Shuffle is a personal project that began in 2022. It was built out of frustration with Spotify’s shuffle behaviour, especially when listening to large Liked Songs libraries where certain artists and tracks would play far more often than others.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        What started as a simple shuffle tool has gradually evolved. Over time, features such as sharing Liked Songs and basic library analysis were added to make it easier to explore and enjoy your own music collection.
                    </Typography>

                    <Typography variant='h4' component="div" sx={{ paddingTop: "40px", color: "white", textAlign: 'left' }}>
                        Free to Use
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        True Shuffle is completely free. Currently I personally cover the hosting costs for running True Shuffle.
                    </Typography>
                    
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                    If you find True Shuffle useful and would like to support the website, you can choose to buy me a coffee. <Link underline="none" href="https://ko-fi.com/trueshuffle">Buy me a coffee</Link>
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
                        Privacy, Data, and Credits
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        This application stores the Spotify user ID, access token to retrieve Liked Songs. The count of shuffled tracks and playlists are also stored for each user so users can track how many times they used True Shuffle. Cookies are used to keep you logged in and able to interact with the site. No passwords are stored and all authentication is handled by Spotify.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        Spotify brand assets are used in accordance with Spotify’s branding guidelines.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white", textAlign: 'left' }}>
                        Header logo created by Freepik.
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
