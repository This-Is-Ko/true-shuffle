import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CircularProgress from "@mui/material/CircularProgress";

function SpotifyLogin({ loginUri }) {
  const [localLoginUri, setLocalLoginUri] = useState("/#");

  useEffect(() => {
    setLocalLoginUri(loginUri)
  }, [loginUri]);

  return (
    localLoginUri !== "/#" ?
      <Button variant="contained"
        href={localLoginUri}
        startIcon={<VpnKeyIcon />}
        disableElevation
        sx={{
          bgcolor: "#1DB954"
        }}
      >Spotify Login</Button>
      :
      <CircularProgress />
  );
}

export default SpotifyLogin;
