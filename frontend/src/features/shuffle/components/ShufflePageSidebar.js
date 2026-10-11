import React from "react";
import { Box } from "@mui/material";
import SidebarStatsCard from "./SidebarStatsCard";
import SidebarActionButtonsCard from "./SidebarActionButtonsCard";

/**
 * ShufflePageSidebar component - Desktop-only sidebar showing statistics,
 * recent shuffles and action buttons. Hidden below the `md` breakpoint, where
 * the mobile shuffle body (pills, bottom nav, search-bar delete) is used instead.
 *
 * @param {Object} props
 * @param {Object|boolean} props.userShuffleCounter - User shuffle counter statistics
 * @param {Array} props.recentShuffles - Array of recent shuffle operations
 * @param {Function} props.onDeleteSuccess - Callback when shuffle deletion succeeds
 * @param {number|null} props.existingShuffledPlaylistCount - Count of existing shuffled playlists
 */
const ShufflePageSidebar = ({
    userShuffleCounter,
    recentShuffles,
    onDeleteSuccess,
    existingShuffledPlaylistCount
}) => {
    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                width: { md: 320, lg: 350 },
                maxWidth: { md: '320px', lg: '350px' },
                minWidth: { md: '280px', lg: '320px' },
                flexShrink: 0,
                boxSizing: 'border-box',
                alignItems: 'flex-start',
                height: 'auto'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%'
                }}
            >
                <SidebarStatsCard
                    userShuffleCounter={userShuffleCounter}
                    recentShuffles={recentShuffles}
                />
                <SidebarActionButtonsCard
                    onDeleteSuccess={onDeleteSuccess}
                    existingShuffledPlaylistCount={existingShuffledPlaylistCount}
                />
            </Box>
        </Box>
    );
};

export default ShufflePageSidebar;
