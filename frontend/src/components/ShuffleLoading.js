import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CardMedia from "@mui/material/CardMedia";

const ShuffleLoading = (props) => {
    return (
      <div>
        <h2>{props.playlist.tracks.total} tracks being shuffled!</h2>
        <CircularProgress />
      </div>
    )
}
export default ShuffleLoading