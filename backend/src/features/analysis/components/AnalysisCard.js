import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * Base card component for analysis page visualizations.
 * Provides consistent styling and layout for all analysis cards.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} [props.description] - Optional card description
 * @param {React.ReactNode} props.children - Card content (visualizations, tables, etc.)
 * @param {Function} [props.onHelpClick] - Optional callback for help button click
 * @param {React.ReactNode} [props.icon] - Optional icon to display before the title
 */
const AnalysisCard = ({ title, description, children, onHelpClick, icon }) => {
    return (
        <Card
            sx={{
                backgroundColor: "#181818",
                borderRadius: "5px",
                marginBottom: 0,
                width: "100%",
                minHeight: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ 
                py: { xs: 1, sm: 2 }, 
                px: { xs: 1.5, sm: 2, md: 2 },
                display: "flex", 
                flexDirection: "column", 
                flex: 1,
                height: "100%",
                justifyContent: "flex-start"
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: 1.5,
                    paddingTop: { xs: "10px", sm: "20px" },
                    paddingBottom: { xs: "8px", sm: "16px" },
                    marginBottom: description ? 1 : 0,
                    flexShrink: 0
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        flex: 1
                    }}>
                        {icon && (
                            <Box sx={{ 
                                color: "#1DB954", 
                                fontSize: { xs: "28px", sm: "32px" },
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center"
                            }}>
                                {icon}
                            </Box>
                        )}
                        <Typography
                            variant='h4'
                            component="div"
                            sx={{
                                color: "white",
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                fontWeight: 600,
                                fontFamily: "'Questrial', sans-serif",
                                letterSpacing: "-0.02em",
                                margin: 0,
                                flex: 1
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    {onHelpClick && (
                        <IconButton
                            onClick={onHelpClick}
                            sx={{
                                color: "#1DB954",
                                '&:hover': {
                                    color: "#1ed760",
                                    bgcolor: 'rgba(29, 185, 84, 0.1)'
                                },
                                padding: { xs: "8px", sm: "10px" }
                            }}
                            aria-label="How to use"
                        >
                            <HelpOutlineIcon sx={{ fontSize: { xs: "24px", sm: "28px" } }} />
                        </IconButton>
                    )}
                </Box>
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

