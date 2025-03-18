import React from "react";
import LoadingMessage from "../../../components/LoadingMessage";
import Grid from '@mui/material/Grid2';
import { CircularProgress, Box } from "@mui/material";
import PlaylistItem from "./PlaylistItem";
import PLAYLIST_ITEM_DISPLAY_STATES from "../state/PlaylistItemDisplayStates";

const ShuffleLoading = ({ playlist, message }) => {
    return (
        <Box sx={{
            "paddingTop": "20px"
        }}>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
            >
                <PlaylistItem
                    class="playlistItem"
                    key={playlist.id}
                    playlist={playlist}
                    displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING}
                />
            </Grid>
            <br/>
            <CircularProgress />
            <LoadingMessage message={message}/>
        </Box>
    )
}

export default ShuffleLoading