import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * Renders a multi-line FAQ answer, splitting on newlines so each line becomes
 * its own paragraph with consistent spacing.
 *
 * @param {string} answer - The raw answer text
 * @returns {React.ReactNode} A list of paragraph elements
 */
const renderAnswer = (answer) => {
    const lines = answer.split("\n");
    return lines.map((line, index) => (
        <Box
            key={index}
            sx={{
                color: "inherit",
                marginBottom: index < lines.length - 1 ? 1 : 0
            }}
        >
            {line}
        </Box>
    ));
};

/**
 * FAQAccordion - A single divider-separated FAQ row styled to match the
 * shuffle, share and analysis pages: a bold white question with a chevron
 * that turns green when expanded, and a light grey answer.
 *
 * @param {Object} props
 * @param {string} props.question - The question text
 * @param {string} props.answer - The answer text (supports newline separated paragraphs)
 * @param {boolean} [props.divider] - Whether to show a divider underneath (default true)
 */
const FAQAccordion = ({ question, answer, divider = true }) => {
    return (
        <Accordion
            disableGutters
            elevation={0}
            sx={{
                backgroundColor: "transparent",
                backgroundImage: "none",
                margin: 0,
                borderBottom: divider ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                "&:before": {
                    display: "none"
                },
                "&.Mui-expanded": {
                    margin: 0
                }
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    px: 0,
                    minHeight: "auto",
                    "&.Mui-expanded": {
                        minHeight: "auto"
                    },
                    "& .MuiAccordionSummary-content": {
                        margin: "18px 0"
                    },
                    "& .MuiAccordionSummary-expandIconWrapper": {
                        color: "#b3b3b3"
                    },
                    "&.Mui-expanded .MuiAccordionSummary-expandIconWrapper": {
                        color: "#1DB954"
                    },
                    "&:hover .MuiAccordionSummary-expandIconWrapper": {
                        color: "#1DB954"
                    }
                }}
            >
                <Typography
                    component="div"
                    sx={{
                        color: "white",
                        fontWeight: 600,
                        textAlign: "left",
                        fontSize: { xs: "0.95rem", sm: "1.05rem" }
                    }}
                >
                    {question}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0, pb: 2, textAlign: "left" }}>
                <Typography
                    component="div"
                    sx={{
                        color: "lightgrey",
                        lineHeight: 1.6,
                        fontSize: { xs: "0.85rem", sm: "0.9rem" }
                    }}
                >
                    {renderAnswer(answer)}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default FAQAccordion;
