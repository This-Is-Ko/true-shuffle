import React, { useState, useEffect } from "react";
import { Backdrop, Typography, Button, CircularProgress } from '@mui/material';

// Provides buffer for user to see what redirect is occuring before directing to Spotify login
const RedirectBackdrop = ({ loginUri }) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        // Open the Backdrop on mount
        setOpen(true)

        // Redirect after 1 second
        const timer = setTimeout(() => {
          window.location.href = loginUri
        }, 1000);

        // Clean up the timer
        return () => clearTimeout(timer)
    }, [loginUri])

    return (
        <div>
            <Backdrop
              open={open}
              sx={{ flexDirection: 'column', textAlign: 'center' }}
            >
                <CircularProgress />
                <Typography variant='h6' component="div" sx={{ color: "white", marginTop: 2 }}>
                    Redirecting to Spotify login
                </Typography>
                <Button 
                    href={loginUri} 
                    variant="contained" 
                    size="small" 
                    sx={{
                        marginTop: 2,
                        bgcolor: "#1DB954"
                    }}
                >
                    Click here if not automatically redirected
                </Button>
            </Backdrop>
        </div>
    );
}

export default RedirectBackdrop
