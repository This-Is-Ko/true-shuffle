import React from "react";
import { Box, Typography } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import MicIcon from "@mui/icons-material/Mic";
import AlbumIcon from "@mui/icons-material/Album";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AnalysisFeatureRow from "./AnalysisFeatureRow";

const ICON_SX = { color: "#1DB954", fontSize: "22px" };

const FEATURES = [
    {
        title: "Library overview",
        description: "Key statistics about your music library",
        icon: <GridViewIcon sx={ICON_SX} />
    },
    {
        title: "Top artists",
        description: "The artists you save the most",
        icon: <MicIcon sx={ICON_SX} />
    },
    {
        title: "Top albums",
        description: "The albums that appear most in your library",
        icon: <AlbumIcon sx={ICON_SX} />
    },
    {
        title: "And more",
        description: "More insights about the music you enjoy",
        icon: <AutoAwesomeIcon sx={ICON_SX} />
    }
];

/**
 * WhatYoullSee - Intro section for the Spotify Library Analyzer listing the
 * insights available once the analysis has run.
 */
const WhatYoullSee = () => {
    return (
        <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            <Typography
                variant="h5"
                component="h2"
                sx={{ color: "white", fontWeight: 600, textAlign: "left", marginBottom: 1, fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
            >
                What you'll see
            </Typography>
            {FEATURES.map((feature, index) => (
                <AnalysisFeatureRow
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    divider={index < FEATURES.length - 1}
                />
            ))}
        </Box>
    );
};

export default WhatYoullSee;
