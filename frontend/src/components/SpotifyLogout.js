import React from "react";
import Button from "@mui/material/Button";
import VpnKeyIcon from '@mui/icons-material/VpnKey';

class SpotifyLogout extends React.Component {

  logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
              sx={{bgcolor: "#1DB954",
                '&:hover': {backgroundColor: '#1DB954'}
              }}
      >Logout</Button>
    )
  }

}

export default SpotifyLogout;
