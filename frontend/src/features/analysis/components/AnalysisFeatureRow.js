import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * AnalysisFeatureRow - A single "what you'll see" row for the Library Analyzer
 * intro, made up of a circular green icon badge, a title and a subtitle.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon rendered inside the circular badge
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {boolean} [props.divider] - Whether to show a divider underneath (default true)
 */
const AnalysisFeatureRow = ({ icon, title, description, divider = true }) => {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
            paddingY: 2,
            boxSizing: "border-box",
            borderBottom: divider ? "1px solid rgba(255, 255, 255, 0.08)" : "none"
        }}>
            <Box sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "rgba(29, 185, 84, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
            }}>
                {icon}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, textAlign: "left" }}>
                <Typography variant="subtitle1" component="div" sx={{ color: "white", fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1rem" } }}>
                    {title}
                </Typography>
                <Typography variant="body2" component="div" sx={{ color: "lightgrey", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                    {description}
                </Typography>
            </Box>
        </Box>
    );
};

export default AnalysisFeatureRow;
