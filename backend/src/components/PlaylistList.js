import React from "react";
import Grid from "@mui/material/Grid";

import PlaylistItem from "./PlaylistItem";

const PlaylistList = ({ playlists, selectPlaylist, loading }) => {
    return (
        loading === true ?
            <Grid
                sx={{ width: "70%", margin: "0 auto" }}
                className="contentHolder"
                container
                spacing={2}
                justifyContent="center"
                alignItems="flex-start"
            >
                {Array.from(Array(3)).map((_, index) => {
                    return <PlaylistItem
                        class="playlistItem"
                        key={index}
                        loading={loading}
                    />
                })}
            </Grid>
            :
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
