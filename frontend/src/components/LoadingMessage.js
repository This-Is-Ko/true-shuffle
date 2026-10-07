import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const DEFAULT_MESSAGE = "Loading...";

function LoadingMessage({ message }) {
    const [loadingMessage, setLoadingMessage] = useState(DEFAULT_MESSAGE);

    useEffect(() => {
        if (message && message.trim() !== '') {
            setLoadingMessage(message);
        }
        }, [message]);

    return (
        <Typography variant="subtitle1" sx={{paddingTop:"10px", color:"white"}}>{loadingMessage}</Typography>
    )
}

export default LoadingMessage;