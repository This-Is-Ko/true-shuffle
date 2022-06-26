import React from "react";
import PlaylistItem from "./PlaylistItem";

class ShufflePlaylistResponse extends React.Component {
  render() {
    return (
      <div>
        <h2>
          Find your shuffled playlist here
        </h2>
        <a href={this.props.playlistUrl}>Go to Spotify</a>
      </div>
    )
  }
}
export default ShufflePlaylistResponse