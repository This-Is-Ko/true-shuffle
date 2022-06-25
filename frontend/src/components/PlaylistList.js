import React from "react"
import Grid from '@mui/material/Grid';

import PlaylistItem from "./PlaylistItem";

class PlaylistList extends React.Component {
  render() {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="flex-start">
            {this.props.playlists.map(playlist => (
                <PlaylistItem class="playlistItem" key={playlist.id} playlist={playlist} />
            ))}
        </Grid>
    )
  }
}

export default PlaylistList