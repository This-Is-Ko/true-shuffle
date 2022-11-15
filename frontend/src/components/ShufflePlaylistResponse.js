import React from "react";
import Button from "@mui/material/Button";

class ShufflePlaylistResponse extends React.Component {
  render() {
    return (
      <div>
        <h2>
          Find your shuffled playlist here
        </h2>
        <Button variant="contained" href={this.props.playlistUrl} target="_blank">Open shuffled playlist</Button>
        <Button variant="contained" href="/shuffle">Shuffle another playlist</Button>
      </div>
    )
  }
}

export default ShufflePlaylistResponse
