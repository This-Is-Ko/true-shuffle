import React, { useEffect } from "react";
import { Button } from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../utils/SpotifyAuthService";

const SpotifyLogout = ({ auth, setAuth }) => {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutUser(setAuth)
    navigate("/")
  };

  useEffect(() => {
  }, [auth]);

  return (
    <Button variant="contained"
      startIcon={<VpnKeyIcon />}
      onClick={() => logout()}
      disableElevation
      sx={{
        bgcolor: "#1DB954"
      }}
    >Logout</Button>
  )

}

export default SpotifyLogout;
