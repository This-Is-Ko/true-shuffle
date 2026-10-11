import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * ShareHero - Centered, card-less layout shared by every step of the Share
 * Liked Songs page. Renders an optional circular icon badge, a title, a
 * description and the step specific content as children.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - Icon rendered inside the circular badge
 * @param {string} [props.title] - Heading text
 * @param {string} [props.description] - Supporting body text
 * @param {React.ReactNode} props.children - Step specific content
 */
const ShareHero = ({ icon, title, description, children }) => {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            boxSizing: "border-box",
            px: { xs: 2, sm: 0 }
        }}>
            {icon && (
                <Box sx={{
                    width: 86,
                    height: 86,
                    borderRadius: "50%",
                    bgcolor: "rgba(29, 185, 84, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 3
                }}>
                    {icon}
                </Box>
            )}
            {title && (
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        color: "white",
                        fontSize: { xs: "1.35rem", sm: "1.6rem" },
                        fontWeight: 600,
                        fontFamily: "'Questrial', sans-serif",
                        letterSpacing: "-0.02em",
                        marginBottom: 1.5
                    }}
                >
                    {title}
                </Typography>
            )}
            {description && (
                <Typography variant="body1" sx={{ color: "lightgrey", fontSize: { xs: "0.9rem", sm: "0.98rem" }, lineHeight: 1.5, marginBottom: 3 }}>
                    {description}
                </Typography>
            )}
            {children}
        </Box>
    );
};

export default ShareHero;
