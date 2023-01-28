import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const loadingMessages = ["Looking for your playlist", "Grabbing your music", "Randomising your tracks", "Creating a shuffled playlist", "You've got a lot of tracks!"];

function LoadingMessage() {
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

    useEffect(() => {
        let timeout;
        if (loadingMessageIndex < loadingMessages.length - 1) {
            timeout = setTimeout(() => setLoadingMessageIndex(loadingMessageIndex + 1), 5000);
        }
        return () => {
            clearTimeout(timeout);
          };
        }, [loadingMessageIndex]);

    return (
        <Typography variant="subtitle1" sx={{paddingTop:"10px", color:"white"}}>{loadingMessages[loadingMessageIndex]}</Typography>
    )
}

export default LoadingMessage;