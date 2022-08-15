import React, {useEffect} from "react";
import PlaylistContainer from "./PlaylistContainer";
import SpotifyLogin from "./SpotifyLogin";
import Button from "@mui/material/Button";
import axios from "axios";

const AllPlaylists = ({loginUri}) => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
  const [localLoginUri, setLocalLoginUri] = React.useState("/#");

  useEffect(() => {
    setLocalLoginUri(loginUri);
  }, [loginUri]);

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
            variant="contained"
            disableElevation
            sx={{my: 2, color: 'white', display: 'block', bgcolor: "#161817"}}
            href={localLoginUri}
          >Get started</Button>
        </div>
      </div>
  )
}

export default AllPlaylists