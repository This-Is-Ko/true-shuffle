import axios from "axios";
import React from "react";
import Button from "@mui/material/Button";
import VpnKeyIcon from '@mui/icons-material/VpnKey';

class SpotifyLogin extends React.Component {

  getLoginUriApi = () => {
    this.setState({ isLoading: true });

    axios.get(`http://localhost:8080/auth/spotify/auth-login`)
      .then(result => {
        console.log(result.data.loginUri);
        this.setState({
          loginUri: result.data.loginUri,
          isLoading: false
        });
      })
      .catch(error => {
          console.log(error)
          this.setState({
            error,
            isLoading: false
          })
        }
      );
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
      <Button variant="contained" href={loginUri} startIcon={<VpnKeyIcon/>}>Spotify Login</Button>
    )
  }

}
export default SpotifyLogin;
