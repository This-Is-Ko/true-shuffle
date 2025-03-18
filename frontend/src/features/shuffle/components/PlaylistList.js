import React from "react";
import Grid from '@mui/material/Grid2';

import PlaylistItem from "./PlaylistItem";
import PLAYLIST_ITEM_DISPLAY_STATES from "../state/PlaylistItemDisplayStates";

const PlaylistList = ({ playlists, selectPlaylist, setSelectedPlaylist, loading }) => {
    return (
        loading === true ?
            <Grid
                sx={{ 
                    width: { sm: "90%", md: "70%" },
                    margin: "0 auto", 
                    paddingTop: "10px", 
                    paddingBottom: "20px" 
                }}
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
                        displayState={PLAYLIST_ITEM_DISPLAY_STATES.LOADING}
                    />
                })}
            </Grid>
            :
            <Grid
                sx={{
                    width: { sm: "90%", md: "70%" },
                    margin: "0 auto",
                    paddingTop: "10px",
                    paddingBottom: "20px"
                }}
                className="contentHolder"
                container
                spacing={{ xs: 1, md: 2 }} rowSpacing={2}
                justifyContent="center"
                alignItems="flex-start"
            >
                {playlists.map((playlist) => (
                    <PlaylistItem
                        class="playlistItem"
                        key={playlist.id}
                        playlist={playlist}
                        selectPlaylist={selectPlaylist}
                        setSelectedPlaylist={setSelectedPlaylist}
                        displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                    />
                ))}
            </Grid>
    );
};

export default PlaylistList;
