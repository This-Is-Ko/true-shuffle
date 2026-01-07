import React from "react";
import { Box, Divider, Card } from "@mui/material";
import SidebarStatistics from "./SidebarStatistics";
import RecentShufflesTable from "./RecentShufflesTable";
import FilteredLikedSongsShuffle from "./FilteredLikedSongsShuffle";

/**
 * SidebarStatsCard component - Displays statistics, recent shuffles, and filter shuffle options.
 * 
 * @param {Object} props - Component props
 * @param {Object|boolean} props.userShuffleCounter - User shuffle counter statistics
 * @param {Array} props.recentShuffles - Array of recent shuffle operations
 */
const SidebarStatsCard = ({ 
    userShuffleCounter, 
    recentShuffles 
}) => {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '100%',
                backgroundColor: '#181818',
                borderRadius: '5px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                height: 'auto'
            }}
        >
            {/* Statistics */}
            {userShuffleCounter && (
                <Box sx={{ mb: 2 }}>
                    <SidebarStatistics userShuffleCounter={userShuffleCounter} />
                </Box>
            )}

            <Divider sx={{ bgcolor: '#333', mb: 1 }} />

            {/* Recent Shuffles */}
            {recentShuffles && recentShuffles.length > 0 && (
                <Box sx={{ flex: '0 0 auto', mt: 1 }}>
                    <RecentShufflesTable recentShuffles={recentShuffles} />
                </Box>
            )}

            {/* Filter Shuffle */}
            {process.env.REACT_APP_ENABLE_FILTER_SHUFFLE === 'true' && (
                <>
                    <Divider sx={{ bgcolor: '#333', mb: 2 }} />
                    <Box>
                        <FilteredLikedSongsShuffle />
                    </Box>
                    <Divider sx={{ bgcolor: '#333' }} />
                </>
            )}
        </Card>
    );
};

export default SidebarStatsCard;

