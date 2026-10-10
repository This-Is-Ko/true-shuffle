import React from "react";
import { Box, Typography } from "@mui/material";
import RecentShufflesTable from "./RecentShufflesTable";

/**
 * MobileHistoryView component - Full-width mobile view showing the user's
 * recent shuffles, reusing the RecentShufflesTable component.
 *
 * @param {Object} props
 * @param {Array} props.recentShuffles - Array of recent shuffle records
 */
const MobileHistoryView = ({ recentShuffles }) => {
    const hasShuffles = Array.isArray(recentShuffles) && recentShuffles.length > 0;

    return (
        <Box sx={{ width: '100%' }}>
            {hasShuffles ? (
                <RecentShufflesTable recentShuffles={recentShuffles} />
            ) : (
                <Typography
                    variant="body1"
                    sx={{ color: '#b3b3b3', textAlign: 'center', py: 4 }}
                >
                    No recent shuffles yet.
                </Typography>
            )}
        </Box>
    );
};

export default MobileHistoryView;
