import React from "react";
import PlaylistItem from "./PlaylistItem";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import Button from "@mui/material/Button";

class ShufflePlaylistResponse extends React.Component {
  render() {
    return (
      <div>
        <h2>
          Find your shuffled playlist here
        </h2>
        <Button variant="contained" href={this.props.playlistUrl} target="_blank">Open shuffled playlist</Button>
        <Button variant="contained" href="/playlists">Shuffle another playlist</Button>
      </div>
    )
  }
}
export default ShufflePlaylistResponse
