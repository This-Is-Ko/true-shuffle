import React, { useEffect } from "react";
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, Card } from "@mui/material";
import MuiLink from "@mui/material/Link";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
    {
        "question": "What is True Shuffle for Spotify?",
        "answer": "I created this website with the goal to have a way of properly shuffling Spotify playlists. There are also features to easily share your Liked Songs and Analyse your library.",
        "id": "q1"
    },
    {
        "question": "How do I use True Shuffle for Spotify?",
        "answer": "Simply log in to the website with your Spotify account and select the playlist you want to shuffle.\nThe website will then shuffle your playlist in a truly random order. (Make sure Spotify's shuffle is turned off)\nEach time a new playlist is created so your original playlist is not affected.\nTo prevent duplicate shuffled playlists, previous shuffled playlists are replaced with the latest.",
        "id": "q2"
    },
    {
        "question": "How do I delete shuffled playlists?",
        "answer": "The delete playlist button is located on the shuffle page. It will only delete playlists which start with \"[Shuffled] \". This ensures that only playlists created by True Shuffle are removed, and your original playlists remain untouched.",
        "id": "q3"
    },
    {
        "question": "Can I shuffle any Spotify playlist?",
        "answer": "Yes, you can use True Shuffle with any Spotify playlist that you have access to. However, ensure you have Spotify Premium otherwise Spotify's shuffle cannot be disabled.",
        "id": "q4"
    },
    {
        "question": "Can I shuffle my Liked Songs?",
        "answer": "Yes, you can shuffle your Liked Songs on the website. Simply select 'Liked Songs' on the shuffle page.",
        "id": "q5"
    },
    {
        "question": "Can I shuffle local files?",
        "answer": "No, Spotify does not allow local files to be accessed or added to playlists through the API. If your playlist contains local files, they will be skipped during the shuffle process.",
        "id": "q6"
    },
    {
        "question": "What is the maximum playlist length?",
        "answer": "Spotify officially limits playlists to 10,000 tracks, but in some cases, playlists can hold up to 11,000 tracks. True Shuffle will fully shuffle your entire playlist, but only the first 10,000 tracks will be saved in the new shuffled playlist.",
        "id": "q7"
    },
    {
        "question": "Why is my shuffle taking so long?",
        "answer": "As each call to Spotify is limited to 100 tracks, the larger your playlist is, the longer it takes to retrieve all tracks then add them to the shuffled playlist.",
        "id": "q8"
    },
    {
        "question": "Is True Shuffle an official Spotify product?",
        "answer": "No, True Shuffle is an independent website and is not affiliated with Spotify.",
        "id": "q9"
    },
    {
        "question": "What user data is stored?",
        "answer": "The only user data that is stored is the Spotify user ID, access token to retrieve Liked Songs, and counters for shuffles. Cookies are used to maintain logged-in sessions. No passwords are stored and all authentication is handled by Spotify.",
        "id": "q10"
    },
    {
        "question": "Why are new playlists created each time I shuffle?",
        "answer": "I like to see the original date that a track was added to my Liked Songs or a playlist and don't want to lose this information when shuffling. By creating a new playlist, I make sure the original playlist is unaffected.",
        "id": "q11"
    },
    {
        "question": "How can I give feedback?",
        "answer": "I'd love to hear from you if you have any feedback or suggestions. You can contact me with the email listed on the About page or click on the Contact link in the footer.",
        "id": "q12"
    }
];


const renderAnswer = (answer) => {
  return answer.split('\n').map((line, index) => <p key={index}>{line}</p>);
};


const FAQPage = () => {
    useEffect(() => {
    }, []);

    return (
        <Box>
            <Helmet>
                <title>FAQ | True Shuffle for Spotify</title>
                <meta name="description" content="Frequently asked questions about True Shuffle and the Spotify shuffler." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.trueshuffle.top/faq" />
                <meta property="og:title" content="FAQ | True Shuffle for Spotify" />
                <meta property="og:description" content="Frequently asked questions about True Shuffle and the Spotify shuffler." />
                <meta property="og:url" content="https://www.trueshuffle.top/faq" />
                <meta property="og:type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>
    
            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white", textAlign: "center" }}>
                FAQ
            </Typography>

            <Box sx={{ 
                paddingBottom: "20px",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Typography variant='body1' component="div" sx={{ color: "lightgrey", marginBottom: "20px", textAlign: "center", width: { xs: "90%", sm: '90%', md: "70%", lg: "60%", xl: "50%" } }}>
                    Have a suggestion or idea? Share your feedback on our <MuiLink href="https://trueshuffle.featurebase.app/" target="_blank" rel="noopener noreferrer" sx={{ color: "#1DB954", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>feedback board</MuiLink>.
                </Typography>
                <Card
                    sx={{
                        width: { xs: "90%", sm: '90%', md: "70%", lg: "60%", xl: "50%" },
                        backgroundColor: '#181818',
                        borderRadius: '5px',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box',
                        gap: 1
                    }}
                >
                    {faqs.map((faqItem) => (
                        <Accordion 
                            key={faqItem.id}
                            disableGutters 
                            sx={{
                                backgroundColor: "#181818",
                                margin: 0,
                                '&:before': {
                                    display: 'none',
                                },
                                '&.Mui-expanded': {
                                    margin: 0,
                                }
                            }} 
                            elevation={0}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                aria-controls="panel1a-content"
                                id={faqItem.id}
                                sx={{ textAlign: "left" }}
                            >
                                <Typography variant='h6' component="div" sx={{ color: "white", fontWeight: 'bold' }}>{faqItem.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ textAlign: "left", backgroundColor: "#181818" }}>
                                <Typography sx={{ color: "white" }}>
                                    {renderAnswer(faqItem.answer)}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Card>
            </Box>
            <Footer></Footer>
        </Box>
    );
}

export default FAQPage;
