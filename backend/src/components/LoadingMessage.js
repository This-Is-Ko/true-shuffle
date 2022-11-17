import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const loadingMessages = ["Grabbing your playlist", "Mixing up the tracks"];

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