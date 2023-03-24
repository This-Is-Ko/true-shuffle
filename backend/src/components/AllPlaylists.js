import React, { useEffect } from "react";
import PlaylistContainer from "./PlaylistContainer";
import Button from "@mui/material/Button";

const AllPlaylists = ({ loginUri }) => {
  const [auth, setAuth] = React.useState(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-spotifyAccessToken')));
  const [localLoginUri, setLocalLoginUri] = React.useState("/#");

  useEffect(() => {
    setLocalLoginUri(loginUri);
  }, [loginUri]);

  return (
    auth ?
      <div>
        <h1 className={"normalTitle"}>Select a playlist</h1>
        <PlaylistContainer />
      </div>
      :
      <RestrictedAccessPage />
  )
}

export default AllPlaylists