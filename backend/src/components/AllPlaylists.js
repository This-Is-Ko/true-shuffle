import React from "react";
import PlaylistContainer from "./PlaylistContainer";
import SpotifyLogin from "./SpotifyLogin";

const AllPlaylists = () => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);

  return (
    auth ?
      <div>
        <h1>Select a playlist</h1>
        <PlaylistContainer/>
      </div>
      :
      <div>
        <h1>Login to your spotify account to continue</h1>
        <SpotifyLogin/>
      </div>
  )
}
export default AllPlaylists