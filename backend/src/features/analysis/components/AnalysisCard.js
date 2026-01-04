import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

/**
 * Base card component for analysis page visualizations.
 * Provides consistent styling and layout for all analysis cards.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} [props.description] - Optional card description
 * @param {React.ReactNode} props.children - Card content (visualizations, tables, etc.)
 */
const AnalysisCard = ({ title, description, children }) => {
    return (
        <Card
            sx={{
                backgroundColor: "#333",
                borderRadius: "8px",
                marginBottom: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ padding: 3, display: "flex", flexDirection: "column", flex: 1 }}>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        color: "white",
                        marginBottom: description ? 1 : 2,
                        fontFamily: "'Questrial', sans-serif",
                    }}
                >
                    {title}
                </Typography>
                {description && (
                    <Typography
                        variant="subtitle2"
                        component="div"
                        sx={{
                            color: "lightgrey",
                            marginBottom: 2,
                        }}
                    >
                        {description}
                    </Typography>
                )}
                <Box sx={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
};

export default AnalysisCard;

