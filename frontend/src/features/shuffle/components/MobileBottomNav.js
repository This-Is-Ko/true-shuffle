import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Sentinel value for the "How To" action, which opens a modal rather than a tab.
const HOW_TO_ACTION = "howto";

/**
 * MobileBottomNav component - Fixed bottom navigation for the mobile shuffle
 * page with "Shuffle", "History" and "How To" actions.
 *
 * "Shuffle" and "History" switch the active tab. "How To" does not become the
 * active tab; it invokes `onHowToClick` to open the How To modal.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ("shuffle" | "history")
 * @param {Function} props.onTabChange - Called with the new tab when a tab is selected
 * @param {Function} props.onHowToClick - Called when "How To" is selected
 */
const MobileBottomNav = ({ activeTab, onTabChange, onHowToClick }) => {
    const handleChange = (event, value) => {
        if (value === HOW_TO_ACTION) {
            if (onHowToClick) {
                onHowToClick();
            }
            return;
        }
        if (onTabChange) {
            onTabChange(value);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
                bgcolor: '#161817',
                pb: 'env(safe-area-inset-bottom)'
            }}
        >
            <BottomNavigation
                value={activeTab}
                onChange={handleChange}
                showLabels
                sx={{
                    bgcolor: '#161817',
                    '& .MuiBottomNavigationAction-root': { color: '#b3b3b3' },
                    '& .Mui-selected': { color: '#1DB954' }
                }}
            >
                <BottomNavigationAction label="Shuffle" value="shuffle" icon={<ShuffleIcon />} />
                <BottomNavigationAction label="History" value="history" icon={<HistoryIcon />} />
                <BottomNavigationAction label="How To" value={HOW_TO_ACTION} icon={<HelpOutlineIcon />} />
            </BottomNavigation>
        </Paper>
    );
};

export default MobileBottomNav;
