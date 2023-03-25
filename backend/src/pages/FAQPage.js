import React, { useEffect } from "react";
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
    {
        "question": "How do I use True Shuffle for Spotify?",
        "answer": "To use True Shuffle, simply log in to the website with your Spotify account, select the playlist you want to shuffle, and press the \"Shuffle\" button. The website will then shuffle your playlist in a truly random order.",
        "id": "q1"
    },
    {
        "question": "Can I use True Shuffle with any Spotify playlist?",
        "answer": "Yes, you can use True Shuffle with any Spotify playlist that you have access to.",
        "id": "q2"
    },
    {
        "question": "Is True Shuffle an official Spotify product?",
        "answer": "No, True Shuffle is an independent website and is not affiliated with Spotify.",
        "id": "q3"
    },
    {
        "question": "What user data is stored by True Shuffle?",
        "answer": "Only user data that is stored is the user ID, access token to retrieved Liked Songs and Liked Songs count to generate historical data. All authentication is handled by Spotify.",
        "id": "q4"
    },
    {
        "question": "Can I opt-out of storing Liked Songs history?",
        "answer": "This feature is currently planned. Meanwhile please contact if you would like to remove your data.",
        "id": "q5"
    },
    {
        "question": "How can I give feedback about True Shuffle?",
        "answer": "Feel free to reach out using the email listed on the About page or click on the Contact link in the footer.",
        "id": "q6"
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
