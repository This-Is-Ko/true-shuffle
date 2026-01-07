import React, { useState } from "react";
import { Box, Drawer, useMediaQuery, Divider, Card } from "@mui/material";
import { useTheme } from "@mui/system";
import SidebarStatistics from "./SidebarStatistics";
import RecentShufflesTable from "./RecentShufflesTable";
import DeleteShuffledPlaylistsButton from "./DeleteShuffledPlaylists";
import FilteredLikedSongsShuffle from "./FilteredLikedSongsShuffle";

const ShufflePageSidebar = ({ 
    userShuffleCounter, 
    recentShuffles, 
    onHowToClick,
    onDeleteSuccess,
    existingShuffledPlaylistCount 
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const sidebarContent = (
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
                <Box sx={{ mb: 2, flex: '0 0 auto', mt: 1 }}>
                    <RecentShufflesTable recentShuffles={recentShuffles} />
                </Box>
            )}

            {/* Filter Shuffle */}
            {process.env.REACT_APP_ENABLE_FILTER_SHUFFLE === 'true' && (
                <>

                <Divider sx={{ bgcolor: '#333', mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                        <FilteredLikedSongsShuffle />
                    </Box>
                    <Divider sx={{ bgcolor: '#333', mb: 2 }} />
                </>
            )}

            {/* Delete Button - only show if existing_shuffled_playlist_count exists and is not 0 */}
            {existingShuffledPlaylistCount != null && existingShuffledPlaylistCount > 0 && (
                <>
                    <Divider sx={{ bgcolor: '#333', mb: 1 }} />
                    <DeleteShuffledPlaylistsButton 
                        onDeleteSuccess={onDeleteSuccess} 
                        playlistCount={existingShuffledPlaylistCount}
                    />
                </>
            )}
        </Card>
    );

    return (
        <>
            {isMobile && !mobileOpen && (
                <Box
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'fixed',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1300,
                        width: '20px',
                        height: '64px',
                        bgcolor: 'rgba(29, 185, 84, 0.6)',
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)',
                        '&:hover': {
                            bgcolor: 'rgba(29, 185, 84, 0.8)',
                            width: '24px',
                        },
                        '&:active': {
                            bgcolor: 'rgba(29, 185, 84, 1)',
                            transform: 'translateY(-50%) translateX(2px)',
                        }
                    }}
                    aria-label="open drawer"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {[0, 1, 2].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: '2px',
                                    height: '12px',
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '1px',
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: { xs: 280, sm: 320 },
                            bgcolor: '#181818',
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            ) : (
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
                    {sidebarContent}
                </Box>
            )}
        </>
    );
};

export default ShufflePageSidebar;

