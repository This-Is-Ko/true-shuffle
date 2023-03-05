import React from "react";
import { Typography, Button } from "@mui/material";

const SPOTIFY_AUTH_URI = process.env.REACT_APP_SPOTIFY_AUTH_URI;

const RestrictedAccessPage = () => {
    return (
        <div className="loading-container">
            <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                Login to your Spotify account to continue
            </Typography>
            <div className={"centerSpacingContainer"}>
                <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        my: 2,
                        color: "white",
                        display: "block",
                        bgcolor: "#1DB954",
                        "&:hover": { backgroundColor: "#ac2ca5" },
                    }}
                    href={SPOTIFY_AUTH_URI}
                >
                    Get started
                </Button>
            </div>
        </div>
    )
}

export default RestrictedAccessPage;