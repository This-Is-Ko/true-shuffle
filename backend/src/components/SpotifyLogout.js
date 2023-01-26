import React from "react";
import {Button} from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';

class SpotifyLogout extends React.Component {

  logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("scope");
    localStorage.removeItem("tokenType");
  };

  state = {
    isLoading: false
  };

  render() {
    return (
      <Button variant="contained"
              href={"/"}
              startIcon={<VpnKeyIcon/>}
              onClick={() => this.logout()}
              disableElevation
              sx={{
                bgcolor: "#1DB954"
              }}
      >Logout</Button>
    )
  }

}

export default SpotifyLogout;
