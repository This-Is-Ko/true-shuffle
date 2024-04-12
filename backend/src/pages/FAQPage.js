import React, { useEffect } from "react";
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
    {
        "question": "What is True Shuffle?",
        "answer": "I created this website with the goal to have a way of properly shuffling Spotify playlists. There are also features to share your Liked Songs and Anaylse your library.",
        "id": "q1"
    },
    {
        "question": "How do I use True Shuffle for Spotify?",
        "answer": "Simply log in to the website with your Spotify account, select the playlist you want to shuffle, and press the \"Shuffle\" button. The website will then shuffle your playlist in a truly random order. (Make sure Spotify's shuffle is turned off)",
        "id": "q2"
    },
    {
        "question": "Can I use True Shuffle with any Spotify playlist?",
        "answer": "Yes, you can use True Shuffle with any Spotify playlist that you have access to. However ensure you have Spotify Premium otherwise Spotify's shuffle cannot be disabled.",
        "id": "q3"
    },
    {
        "question": "Is True Shuffle an official Spotify product?",
        "answer": "No, True Shuffle is an independent website and is not affiliated with Spotify.",
        "id": "q4"
    },
    {
        "question": "What user data is stored by True Shuffle?",
        "answer": "The only user data that is stored is the user ID, access token to retrieved Liked Songs, counters for shuffles and Liked Songs to generate historical data. All authentication is handled by Spotify.",
        "id": "q5"
    },
    {
        "question": "Can I opt-out of storing Liked Songs history?",
        "answer": "This feature is currently planned. Meanwhile please contact if you would like to opt-out or remove your data.",
        "id": "q6"
    },
    {
        "question": "How can I give feedback?",
        "answer": "I'd love to hear from you if you have any feedback or suggestions. You contact me with the email listed on the About page or click on the Contact link in the footer.",
        "id": "q7"
    },
];

const FAQPage = () => {
    useEffect(() => {
    }, []);

    return (
        <Box>
            <Helmet>
                <title>FAQ | True Shuffle for Spotify</title>
            </Helmet>
            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                FAQ
            </Typography>

            <Box sx={{ paddingBottom: "20px" }} >
                {faqs.map((faqItem) => (
                    <Accordion disableGutters sx={{
                        width: { xs: "90%", sm: '90%', md: "70%", lg: "60%", xl: "50%" },
                        backgroundColor: "#292e2f", textAlign: "center", margin: "auto"
                    }} elevation={0}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className="accordionIcon" />}
                            aria-controls="panel1a-content"
                            id={faqItem.id}
                        >
                            <Typography variant='h6' component="div" sx={{ color: "white", fontWeight: 'bold' }}>{faqItem.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ textAlign: "left" }}>
                            <Typography>
                                {faqItem.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
            <Footer></Footer>
        </Box>
    );
}

export default FAQPage;
