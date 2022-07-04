import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const ShuffleLoading = (props) => {
  return (
    <div>
      <h2>{props.playlist.tracks.total} tracks being shuffled!</h2>
      <CircularProgress/>
    </div>
  )
}
export default ShuffleLoading