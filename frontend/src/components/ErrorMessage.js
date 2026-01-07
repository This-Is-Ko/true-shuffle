import React from "react";
import { Typography, Box, Button } from "@mui/material";

const ErrorMessage = ({ error, isGeneric }) => {
    if (!error) {
        return null;
    }

    const errorMessage = isGeneric === true 
        ? "Something went wrong. Please try again later."
        : (error?.message || "An error occurred");

    // Check if this is a critical Spotify connection error
    const isSpotifyConnectionError = errorMessage === "Unable to connect to Spotify, please try again later";

    // Render full-screen backdrop for critical connection errors
    if (isSpotifyConnectionError) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 64, // Start below header (AppBar height)
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1300, // Lower than header (1400) to allow header interactions
                    bgcolor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
                <Box sx={{ maxWidth: 500, px: 3 }}>
                    <Typography variant='h5' component="div" sx={{ color: "white", mb: 2, fontWeight: 'bold' }}>
                        Service Unavailable
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ color: "white", mb: 3 }}>
                        {errorMessage}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                        sx={{
                            bgcolor: "#1DB954",
                            color: "white",
                            '&:hover': {
                                bgcolor: "#1ed760"
                            }
                        }}
                    >
                        Retry
                    </Button>
                </Box>
            </Box>
        );
    }
    
    // Default behavior for non-critical errors
    return (
        <div className="loading-container">
            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                {errorMessage}
            </Typography>
        </div>
    );
}

export default ErrorMessage