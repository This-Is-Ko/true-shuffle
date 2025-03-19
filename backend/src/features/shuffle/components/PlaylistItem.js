import React from "react"

import Grid from '@mui/material/Grid2';
import { Card, CardContent, CardMedia, Typography, Box, Button, Skeleton } from "@mui/material";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PLAYLIST_ITEM_DISPLAY_STATES from "../state/PlaylistItemDisplayStates";


const PlaylistItem = (props) => {
    const { playlist } = props;
    const displayState = props.displayState;
    const playlistUri = props.playlistUri;

    const updateSelectedPlaylist = () => {
        props.setSelectedPlaylist(playlist);
    }

    const preparePlaylistItemContents = () => {
        if (displayState === PLAYLIST_ITEM_DISPLAY_STATES.LOADING) {
            return skeletonContents();
        } else {
            // Validate input
            if (!playlist || !playlist.name || !playlist.images || !playlist.images.url) {
                return (<></>);
            }
            return playlistContents();
        }
    }

    const skeletonContents = () => {
        return (
            <Box>
                <Skeleton data-testid="playlist-skeleton" variant="rectangular" sx={{ bgcolor: 'grey.900', maxWidth: "250px" }} height={100} />
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Skeleton data-testid="playlist-skeleton" variant="text" sx={{ bgcolor: 'grey.900', fontSize: '1rem', maxWidth: "230px" }} />
                    <Skeleton data-testid="playlist-skeleton" variant="text" sx={{ bgcolor: 'grey.900', fontSize: '0.85rem', maxWidth: "230px" }} />
                    <Skeleton data-testid="playlist-skeleton" variant="rectangular" sx={{ bgcolor: 'grey.900' }} width="50%" />
                </CardContent>
            </Box>
        );
    }

    const playlistContents = () => {
        return (
            <Box>
                <CardMedia
                    component="img"
                    sx={{ maxWidth: "250px", width: "100%" }}
                    image={playlist.images.url}
                    alt={playlist.name}
                />
                <CardContent
                    sx={{
                        flex: "1 0 auto",
                        paddingBottom: shuffleButton() ? "16px !important" : "8px !important",
                        paddingLeft: { xs: 0, sm: "16px" },
                        paddingRight: { xs: 0, sm: "16px" },
                    }}
                >
                    <Typography
                        component="div"
                        variant="h5"
                        color="common.white"
                        sx={{
                            fontSize: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                            fontFamily: "'Questrial', sans-serif",
                        }}
                    >
                        {playlist.name}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="common.white"
                        component="div"
                        sx={{
                            fontSize: "0.85rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {playlist.owner.display_name}
                    </Typography>
                    {shuffleButton()}
                </CardContent>
            </Box>
        );
    };


    const shuffleButton = () => {
      if (playlistUri != null) {
            return (
                <Box sx={{paddingTop: "5px" }}>
                    <Button variant="contained"
                        href={playlistUri} target="_blank"
                        sx={{ color: 'white', bgcolor: "#1DB954" }}
                        startIcon={<AudiotrackIcon />}>
                            Open
                    </Button>
                </Box>
            )
        }
    }

    return (
        <Grid>
            <Card
                sx={{
                    padding: "16px",
                    background: "#181818",
                    "borderRadius": "5px",
                    "height": "auto",
                    width: { xs: "150px", sm: "200px", md: "250px" },
                    maxWidth: { xs: "150px", sm: "200px", md: "250px" },
                    maxHeight: { xs: "280px", sm: "280px", md: "360px" },
                    // Lighter grey and scale effect
                    ...(displayState === PLAYLIST_ITEM_DISPLAY_STATES.SELECTION && {
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                            background: "#232323",
                            transform: "scale(1.05)",
                        },
                        "&:active": {
                            background: "#232323",
                            transform: "scale(1.05)",
                        },
                  })
              }}
              onTouchStart={(e) => {
                  if (displayState === PLAYLIST_ITEM_DISPLAY_STATES.SELECTION) {
                      e.currentTarget.style.background = "#232323";
                      e.currentTarget.style.transform = "scale(1.05)";
                  }
              }}
              onTouchEnd={(e) => {
                  if (displayState === PLAYLIST_ITEM_DISPLAY_STATES.SELECTION) {
                      e.currentTarget.style.background = "#181818";
                      e.currentTarget.style.transform = "scale(1)";
                  }
              }}
                onClick={() => {
                  if (displayState === PLAYLIST_ITEM_DISPLAY_STATES.SELECTION) {
                      updateSelectedPlaylist();
                  }
              }}
            >
                {preparePlaylistItemContents()}
            </Card>
        </Grid>
    );
}

export default PlaylistItem;
