import axios from "axios";
import React from "react";
import Button from "@mui/material/Button";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CircularProgress from "@mui/material/CircularProgress";

class SpotifyLogin extends React.Component {

  getLoginUriApi = () => {
    this.setState({ isLoading: true });

    axios.get(`http://localhost:8080/auth/spotify/auth-login`)
      .then(result => {
        // console.log(result.data.loginUri);
        this.setState({
          loginUri: result.data.loginUri,
          isLoading: false
        });
      })
      .catch(error => {
        if (error.code === "ERR_NETWORK"){
          this.setState({
            error,
            isLoading: false,
            isError: true
          })
        } else {
          this.setState({
            error,
            isLoading: false,
            isError: true
          })
        }
      });
  };

  state = {
    loginUri: "/#",
    isLoading: false
  };

  componentDidMount() {
    this.getLoginUriApi();
  }

  render() {
    const { loginUri, isLoading } = this.state;

    return (
      !isLoading ?
        <Button variant="contained" href={loginUri} startIcon={<VpnKeyIcon/>} disableElevation>Spotify Login</Button>
      :
        <CircularProgress />
    )
  }

}
export default SpotifyLogin;
