import React, {useEffect} from "react";
import PlaylistContainer from "./PlaylistContainer";
import Button from "@mui/material/Button";

const AllPlaylists = ({loginUri}) => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
  const [localLoginUri, setLocalLoginUri] = React.useState("/#");

  useEffect(() => {
    setLocalLoginUri(loginUri);
  }, [loginUri]);

  return (
    auth ?
      <div>
        <h1 className={"normalTitle"}>Select a playlist</h1>
        <PlaylistContainer/>
      </div>
      :
      <div>
        <h1 className={"normalTitle"}>Login to your spotify account to continue</h1>
        <div className={"centerSpacingContainer"}>
          <Button
            className={"normalButton"}
            variant="contained"
            disableElevation
            sx={{my: 2, color: 'white', display: 'block', bgcolor: "#1DB954",
              '&:hover': {backgroundColor: '#1DB954'}
            }}
            href={localLoginUri}
          >Get started</Button>
        </div>
      </div>
  )
}

export default AllPlaylists