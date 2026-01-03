import React from "react";
import { Paper } from "@mui/material";

const SidebarCard = ({ children, sx = {} }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 1,
                bgcolor: '#333',
                borderRadius: '8px',
                width: '100%',
                boxSizing: 'border-box',
                ...sx
            }}
        >
            {children}
        </Paper>
    );
};

export default SidebarCard;

