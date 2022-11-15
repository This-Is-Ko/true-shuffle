import React from "react";
import Grid from "@mui/material/Grid";

import PlaylistItem from "./PlaylistItem";

const PlaylistList = ({ playlists, selectPlaylist }) => {
    return (
        <Grid
            sx={{ width: "70%", margin: "0 auto" }}
            className="contentHolder"
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
        >
            {playlists.map((playlist) => (
                <PlaylistItem
                    class="playlistItem"
                    key={playlist.id}
                    playlist={playlist}
                    selectPlaylist={selectPlaylist}
                />
            ))}
        </Grid>
    );
};

export default PlaylistList;
