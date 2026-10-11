import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

/**
 * MobileBottomNav - Fixed bottom navigation bar shared by mobile pages.
 *
 * Renders the supplied items as BottomNavigationActions. The selected item's
 * value is emitted through `onChange`; callers decide how to handle a tab
 * switch versus an action (e.g. a "How To" item that opens a modal rather than
 * becoming the active tab).
 *
 * @param {Object} props
 * @param {Array<{label: string, value: string, icon: React.ReactNode}>} props.items - Actions to render
 * @param {string|null} [props.value] - Currently active item value (null for none)
 * @param {Function} [props.onChange] - Called with the selected item value
 */
const MobileBottomNav = ({ items = [], value = null, onChange }) => {
    const handleChange = (event, newValue) => {
        if (onChange) {
            onChange(newValue);
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
                bgcolor: '#181818',
                pb: 'env(safe-area-inset-bottom)'
            }}
        >
            <BottomNavigation
                value={value}
                onChange={handleChange}
                showLabels
                sx={{
                    bgcolor: '#181818',
                    '& .MuiBottomNavigationAction-root': { color: '#b3b3b3' },
                    '& .Mui-selected': { color: '#1DB954' }
                }}
            >
                {items.map((item) => (
                    <BottomNavigationAction
                        key={item.value}
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
};

export default MobileBottomNav;
