import React, { useEffect } from "react";
import { Typography, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../utils/SpotifyAuthService";

const SpotifyMenuLogout = ({ handleCloseNavMenu, auth, setAuth }) => {
    const navigate = useNavigate();

    const handleMenuLogout = async () => {
        await logoutUser(setAuth);
        handleCloseNavMenu();
        navigate("/")
    }

    useEffect(() => {
    }, [auth]);

    return (
        <MenuItem
            component="a"
            key={"logout"}
            onClick={() => handleMenuLogout()}
            sx={{
                color: 'white', display: 'block', bgcolor: "#161817"
            }}>
            <Typography textAlign="center">Logout</Typography>

        </MenuItem>
    )

}

export default SpotifyMenuLogout;
