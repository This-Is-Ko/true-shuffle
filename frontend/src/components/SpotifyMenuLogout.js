import React from "react";
import { Typography, MenuItem } from '@mui/material';

const SpotifyMenuLogout = ({ handleCloseNavMenu }) => {

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("scope");
        localStorage.removeItem("tokenType");
    };

    const handleMenuLogout = () => {
        logout();
        handleCloseNavMenu();
    }

    return (
        <MenuItem
            component="a"
            href="/"
            key={"logout"}
            onClick={handleMenuLogout}
            sx={{
                color: 'white', display: 'block', bgcolor: "#161817",
                '&:hover': { backgroundColor: '#1DB954' }
            }}>
            <Typography textAlign="center">Logout</Typography>

        </MenuItem>
    )

}

export default SpotifyMenuLogout;
