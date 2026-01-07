import React, { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import SidebarStatsCard from "./SidebarStatsCard";
import SidebarActionButtonsCard from "./SidebarActionButtonsCard";

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

    const sidebarWrapper = (
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
                    {sidebarWrapper}
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
                    {sidebarWrapper}
                </Box>
            )}
        </>
    );
};

export default ShufflePageSidebar;

