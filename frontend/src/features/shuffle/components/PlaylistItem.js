import React from "react"

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { CircularProgress, Typography, Box, Button, Skeleton } from "@mui/material";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PLAYLIST_ITEM_DISPLAY_STATES from "../state/PlaylistItemDisplayStates";

const PlaylistItem = (props) => {
    const displayState = props.displayState;
    const playlistUri = props.playlistUri;

    const updateSelectedPlaylist = () => {
        props.setSelectedPlaylist(props.playlist);
    }

    const preparePlaylistItemContents = () => {
        if (displayState === PLAYLIST_ITEM_DISPLAY_STATES.LOADING) {
            return skeletonContents();
        } else {
            return playlistContents();
        }
    }

    const skeletonContents = () => {
        return (
            <Box>
                <Skeleton variant="rectangular" sx={{ bgcolor: 'grey.900' }} width={"auto"} height={250} />
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Skeleton variant="text" sx={{ bgcolor: 'grey.900', fontSize: '1rem', "maxWidth": "230px" }} />
                    <Skeleton variant="text" sx={{ bgcolor: 'grey.900', fontSize: '0.85rem', "maxWidth": "230px" }} />
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'grey.900' }} width="50%" />
                </CardContent>
            </Box>
        );
    }

    const playlistContents = () => {
        return (
            <Box>
                <CardMedia
                    component="img"
                    sx={{ "width": "auto", "maxWidth": "250px" }}
                    image={props.playlist.images.url}
                    alt={props.playlist.name}
                />
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5" color="common.white" sx={{
                        "fontSize": "1rem", "overflow": "hidden", "textOverflow": "ellipsis", display: "inline-block", "maxWidth": "230px", "whiteSpace": "nowrap", fontFamily: "'Questrial', sans-serif;"
                    }}>
                        {props.playlist.name}
                    </Typography>
                    <Typography variant="subtitle1" color="common.white" component="div"
                        sx={{ "fontSize": "0.85rem", "overflow": "hidden", "textOverflow": "ellipsis", "maxWidth": "230px", "whiteSpace": "nowrap", "paddingBottom": "5px" }}>
                        {props.playlist.owner.display_name}
                    </Typography>
                    {shuffleButton()}
                </CardContent>
            </Box>
        );
    }

    const shuffleButton = () => {
        if (displayState === PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING) {
            return (
                <CircularProgress />
            )
        } else if (displayState === PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED && playlistUri != null) {
            return (
                <Button variant="contained"
                    href={playlistUri} target="_blank"
                    sx={{ color: 'white', bgcolor: "#1DB954" }}
                    startIcon={<AudiotrackIcon />}>
                        Open
                </Button>
            )
        } else {
            return (
                <Button variant="contained"
                    onClick={() => { updateSelectedPlaylist(); }}
                    sx={{ color: 'white', bgcolor: "#1DB954" }}
                    startIcon={<ShuffleIcon />}>
                        Shuffle
                </Button>
            )
        }
    }

    return (
        <Grid item>
            <Card sx={{
                padding: "16px",
                background: "#181818",
                "borderRadius": "5px",
                "height": "auto",
                "maxHeight": "360px",
                "width": "250px",
                "maxWidth": "250px"
            }}>
                {preparePlaylistItemContents()}
            </Card>
        </Grid>
    );
}
export default PlaylistItem;