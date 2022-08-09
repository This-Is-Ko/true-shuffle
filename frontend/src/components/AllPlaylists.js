import React, {useEffect} from "react";
import PlaylistContainer from "./PlaylistContainer";
import SpotifyLogin from "./SpotifyLogin";
import Button from "@mui/material/Button";
import axios from "axios";

const AllPlaylists = () => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
  const [loginUri, setLoginUri] = React.useState("/#");

  function getLoginUriApi() {
    axios.get(process.env.REACT_APP_BACKEND_PATH + `/auth/spotify/auth-login`)
      .then(result => {
        // console.log(result.data.loginUri);
        setLoginUri(result.data.loginUri)
      })
      .catch(error => {
        if (error.code === "ERR_NETWORK") {
          setLoginUri("/error")
        } else {
          setLoginUri("/error")
        }
      });
  };

  useEffect(() => {
    getLoginUriApi();
  });

  return (
    auth ?
      <div>
        <h1>Select a playlist</h1>
        <PlaylistContainer/>
      </div>
      :
      <div>
        <h1>Login to your spotify account to continue</h1>
        <div className={"centerSpacingContainer"}>
          <Button
            className={"largeButton"}
            onClick={""}
            variant="contained"
            disableElevation
            sx={{my: 2, color: 'white', display: 'block', bgcolor: "#161817"}}
            href={loginUri}
          >Get started</Button>
        </div>
      </div>
  )
}

export default AllPlaylists