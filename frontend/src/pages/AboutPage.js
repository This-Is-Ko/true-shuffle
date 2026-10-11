import React, { useEffect } from "react";
import { Typography, Link, Box, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import { getStatisticsApi } from "../utils/StatisticsService";
import { formatNumberWithSpaces } from "../utils/NumberFormatter";

const GREEN = "#1DB954";

const sectionHeadingSx = {
    paddingTop: "40px",
    color: "white",
    textAlign: "left",
    fontSize: { xs: "1.2rem", sm: "1.4rem" },
    fontWeight: 600
};
const bodyTextSx = {
    paddingTop: "10px",
    color: "white",
    textAlign: "left",
    fontSize: { xs: "0.9rem", sm: "0.95rem" },
    lineHeight: 1.6
};
const linkSx = { color: GREEN, "&:hover": { textDecoration: "underline" } };

/**
 * A single statistic: a large green value paired with a muted label.
 * Rendered as two grid cells so all labels line up in a column.
 */
const StatRow = ({ value, label }) => (
    <React.Fragment>
        <Typography
            component="div"
            sx={{
                color: GREEN,
                fontWeight: 700,
                fontSize: { xs: "1.6rem", sm: "2rem" },
                textAlign: "left"
            }}
        >
            {formatNumberWithSpaces(value)}
        </Typography>
        <Typography
            component="div"
            sx={{ color: "lightgrey", textAlign: "left", fontSize: { xs: "0.9rem", sm: "0.95rem" } }}
        >
            {label}
        </Typography>
    </React.Fragment>
);

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

            <Typography
                variant='h2'
                component="h1"
                sx={{
                    paddingTop: "20px",
                    color: "white",
                    textAlign: "center",
                    fontFamily: "'Questrial', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "2.75rem" }
                }}
            >
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
                        boxSizing: 'border-box'
                    }}
                >
                    <Typography variant='body1' component="div" sx={{ ...bodyTextSx, paddingTop: "10px" }}>
                        True Shuffle is a Spotify playlist shuffler that delivers real randomness. Rediscover your music with a truly random shuffle experience.
                    </Typography>

                    <Typography variant='h4' component="div" sx={sectionHeadingSx}>
                        About the Project
                    </Typography>
                    <Typography variant='body1' component="div" sx={bodyTextSx}>
                        True Shuffle is a personal project that began in 2022. It was built out of frustration with Spotify’s shuffle behaviour, especially when listening to large Liked Songs libraries where certain artists and tracks would play far more often than others.
                    </Typography>
                    <Typography variant='body1' component="div" sx={bodyTextSx}>
                        What started as a simple shuffle tool has gradually evolved. Over time, features such as sharing Liked Songs and basic library analysis were added to make it easier to explore and enjoy your own music collection.
                    </Typography>

                    <Typography variant='h4' component="div" sx={sectionHeadingSx}>
                        Free to use
                    </Typography>
                    <Typography variant='body1' component="div" sx={bodyTextSx}>
                        True Shuffle is completely free. Currently I personally cover the hosting costs for running True Shuffle.
                    </Typography>
                    <Typography variant='body1' component="div" sx={bodyTextSx}>
                        If you find True Shuffle useful and would like to support the website, any contributions will be greatly appreciated.
                    </Typography>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Button
                            variant="contained"
                            disableElevation
                            href="https://ko-fi.com/trueshuffle"
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<img src="/assets/icons/kofi-symbol.svg" alt="Ko-fi" style={{ width: '24px', height: '24px' }} />}
                            sx={{
                                my: 2,
                                color: "white",
                                bgcolor: "#FF5E78",
                                "&:hover": {
                                    backgroundColor: "#E85166"
                                }
                            }}
                        >
                            Support Me on Ko-fi
                        </Button>
                    </Box>

                    {trackCounter !== null && playlistCounter !== null &&
                        <React.Fragment>
                            <Typography variant='h4' component="div" sx={sectionHeadingSx}>
                                Statistics
                            </Typography>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: "auto auto",
                                justifyContent: "start",
                                alignItems: "center",
                                columnGap: { xs: 2, sm: 3 },
                                rowGap: 2,
                                paddingTop: "10px"
                            }}>
                                <StatRow value={trackCounter} label="Shuffled tracks" />
                                <StatRow value={playlistCounter} label="Shuffled playlists" />
                                <StatRow value={analysisCounter} label="Libraries analysed" />
                            </Box>
                        </React.Fragment>
                    }

                    <Typography variant='h4' component="div" sx={sectionHeadingSx}>
                        Privacy, data, and credits
                    </Typography>
                    <Typography variant='body1' component="div" sx={bodyTextSx}>
                        This application stores the Spotify user ID and access token to interact with Spotify API. The count of shuffled tracks and playlists are also stored for each user so users can track how many times they used True Shuffle. Cookies are used to keep you logged in and able to interact with the site. No passwords are stored and all authentication is handled by Spotify.
                    </Typography>
                    <Typography variant='body1' component="div" sx={bodyTextSx}>
                        Spotify brand assets are used in accordance with Spotify’s branding guidelines.
                    </Typography>
                    <Typography variant='body1' component="div" sx={bodyTextSx}>
                        Header logo created by Freepik.
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ ...bodyTextSx, paddingBottom: "20px" }}>
                        For any help or feedback, feel free to send me an email <Link underline="none" href={"mailto:" + process.env.REACT_APP_CONTACT_EMAIL_ADDRESS} sx={linkSx}>here</Link> or share your ideas and suggestions on our <Link underline="none" href="https://trueshuffle.featurebase.app/" target="_blank" rel="noopener noreferrer" sx={linkSx}>feedback board</Link>.
                    </Typography>
                </Box>
            </Box>
            <Footer></Footer>
        </Box>
    );
}

export default AboutPage;
