import React from "react";
import Grid from '@mui/material/Grid2';
import { Button, Typography, Box } from "@mui/material";
import PlaylistItem from "./PlaylistItem";
import PLAYLIST_ITEM_DISPLAY_STATES from "../state/PlaylistItemDisplayStates";

const ShuffleResponse = ({ playlist, playlistUri }) => {
    return (
        <Box
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant='h4' component="div" sx={{ paddingBottom: "10px", color: "white" }}>
                Playlist shuffled!
            </Typography>
            <Box sx={{
                "paddingTop": "10px"
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
                        playlistUri={playlistUri}
                        displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                    />
                </Grid>
            </Box>
            <Grid
                sx={{ paddingTop: "10px", width: "100%", margin: "auto" }}
                container
                justifyContent="center">
                <Grid item>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            my: 2, color: 'white', bgcolor: "#1DB954",
                            width: "30rem", maxWidth: "300px"
                        }}
                        href="/shuffle">
                        Shuffle another playlist
                    </Button>
                </Grid>
            </Grid>
            <Typography variant='subtitle1' component="div" sx={{ paddingBottom: "5px", color: "white" }}>
                When you want a new order, just come back and shuffle again.
            </Typography>
        </Box>
    )
}

export default ShuffleResponse
