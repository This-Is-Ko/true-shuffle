import React from "react";
import { Card, CardContent, Box, Typography, IconButton, CircularProgress, Button } from "@mui/material";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

import PlaylistItem from "./PlaylistItem";
import PLAYLIST_ITEM_DISPLAY_STATES from "../state/PlaylistItemDisplayStates";
import PLAYLIST_SHUFFLE_STATE from "../state/PlaylistShuffleState";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";

const PlaylistList = ({ playlists, selectPlaylist, setSelectedPlaylist, selectedPlaylist, shuffleState, shuffleStateMessage, shuffleError, playlistUri, loading, onHowToClick, onRefreshData }) => {
    const isShuffling = selectedPlaylist !== null && 
                       shuffleState !== "" && 
                       shuffleState !== PLAYLIST_SHUFFLE_STATE.SUCCESS &&
                       (shuffleState === PLAYLIST_SHUFFLE_STATE.PROGRESS || 
                        shuffleState === PLAYLIST_SHUFFLE_STATE.PENDING);
    const isShuffled = selectedPlaylist !== null && shuffleState === PLAYLIST_SHUFFLE_STATE.SUCCESS;
    const showAllPlaylists = selectedPlaylist === null && !loading;
    const shouldCenterContent = selectedPlaylist !== null; // Center when playlist is selected, regardless of shuffle state

    const getTitle = () => {
        if (isShuffled) {
            return "Playlist shuffled!";
        } else if (isShuffling) {
            return "Shuffling playlist";
        } else {
            return "Select a playlist";
        }
    };

    const handleShuffleAnother = () => {
        if (setSelectedPlaylist) {
            setSelectedPlaylist(null);
        }
        if (onRefreshData) {
            onRefreshData();
        }
    };

    return (
        <Card sx={{
            backgroundColor: "#181818",
            borderRadius: "5px",
            width: "100%",
            minHeight: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            <CardContent sx={{ 
                py: { xs: 1, sm: 2 }, 
                px: { xs: 1.5, sm: 2, md: 2 },
                display: "flex",
                flexDirection: "column",
                flex: 1,
                height: "100%",
                justifyContent: shouldCenterContent ? "space-between" : "flex-start"
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: 1.5,
                    paddingTop: { xs: "10px", sm: "20px" },
                    paddingBottom: { xs: "8px", sm: "16px" },
                    marginBottom: 0,
                    flexShrink: 0
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        flex: 1
                    }}>
                        <QueueMusicIcon 
                            sx={{ 
                                color: "#1DB954", 
                                fontSize: { xs: "28px", sm: "32px" },
                                flexShrink: 0
                            }} 
                        />
                        <Typography 
                            variant='h4' 
                            component="div" 
                            sx={{ 
                                color: "white",
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                fontWeight: 600,
                                fontFamily: "'Questrial', sans-serif",
                                letterSpacing: "-0.02em",
                                margin: 0
                            }}
                        >
                            {getTitle()}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onHowToClick}
                        sx={{
                            color: "#1DB954",
                            '&:hover': {
                                color: "#1ed760",
                                bgcolor: 'rgba(29, 185, 84, 0.1)'
                            },
                            padding: { xs: "8px", sm: "10px" }
                        }}
                        aria-label="How to use"
                    >
                        <HelpOutlineIcon sx={{ fontSize: { xs: "24px", sm: "28px" } }} />
                    </IconButton>
                </Box>
                
                {shuffleError && typeof shuffleError === 'object' && (
                    <Box sx={{ paddingBottom: { xs: "10px", sm: "16px" } }}>
                        <ErrorMessage error={shuffleError} isGeneric={false} />
                    </Box>
                )}

                <Box
                    sx={{
                        width: "100%",
                        paddingTop: { xs: "5px", sm: "10px" },
                        paddingBottom: { xs: "10px", sm: "20px" },
                        display: (showAllPlaylists || loading) ? "grid" : "flex",
                        flexDirection: (showAllPlaylists || loading) ? "row" : "column",
                        alignItems: (showAllPlaylists || loading) ? "stretch" : "center",
                        justifyContent: shouldCenterContent ? "center" : "flex-start",
                        flex: shouldCenterContent ? 1 : "none",
                        minHeight: shouldCenterContent ? 0 : "auto",
                        gridTemplateColumns: (showAllPlaylists || loading) ? {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(auto-fit, minmax(200px, 1fr))",
                            md: "repeat(auto-fit, minmax(200px, 1fr))"
                        } : "none",
                        gap: { xs: 1.5, sm: 2, md: 2 },
                        rowGap: { xs: 1.5, sm: 2, md: 2 }
                    }}
                    className="contentHolder"
                >
                    {loading === true ? (
                        Array.from(Array(3)).map((_, index) => (
                            <PlaylistItem
                                class="playlistItem"
                                key={index}
                                displayState={PLAYLIST_ITEM_DISPLAY_STATES.LOADING}
                            />
                        ))
                    ) : showAllPlaylists ? (
                        playlists.map((playlist) => (
                            <PlaylistItem
                                class="playlistItem"
                                key={playlist.id}
                                playlist={playlist}
                                selectPlaylist={selectPlaylist}
                                setSelectedPlaylist={setSelectedPlaylist}
                                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                            />
                        ))
                    ) : selectedPlaylist ? (
                        <>
                            <Box sx={{ 
                                width: "100%", 
                                maxWidth: "300px",
                                display: "flex",
                                justifyContent: "center"
                            }}>
                                <PlaylistItem
                                    class="playlistItem"
                                    key={selectedPlaylist.id}
                                    playlist={selectedPlaylist}
                                    playlistUri={playlistUri}
                                    displayState={
                                        isShuffled 
                                            ? PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED 
                                            : PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING
                                    }
                                />
                            </Box>
                            {isShuffling && (
                                <Box sx={{ 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    alignItems: "center",
                                    paddingTop: { xs: "10px", sm: "20px" },
                                    gap: 1,
                                    width: "100%"
                                }}>
                                    {playlistUri != null && (
                                        <Button
                                            variant="contained"
                                            href={playlistUri}
                                            target="_blank"
                                            sx={{
                                                color: 'white', 
                                                bgcolor: "#1DB954",
                                                width: "100%",
                                                maxWidth: "300px",
                                                '&:hover': {
                                                    bgcolor: "#1ed760"
                                                }
                                            }}
                                            startIcon={<AudiotrackIcon />}
                                        >
                                            Open
                                        </Button>
                                    )}
                                    <CircularProgress />
                                    <LoadingMessage message={shuffleStateMessage || "Shuffling..."} />
                                    {playlistUri != null && (
                                        <LoadingMessage message="You can start listening while the rest of the tracks are being added" />
                                    )}
                                </Box>
                            )}
                            {isShuffled && (
                                <Box sx={{ 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    alignItems: "center",
                                    paddingTop: { xs: "10px", sm: "20px" },
                                    gap: 1,
                                    width: "100%"
                                }}>
                                    {playlistUri != null && (
                                        <Button
                                            variant="contained"
                                            href={playlistUri}
                                            target="_blank"
                                            sx={{
                                                color: 'white', 
                                                bgcolor: "#1DB954",
                                                width: "100%",
                                                maxWidth: "300px",
                                                '&:hover': {
                                                    bgcolor: "#1ed760"
                                                }
                                            }}
                                            startIcon={<AudiotrackIcon />}
                                        >
                                            Open
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        onClick={handleShuffleAnother}
                                        sx={{
                                            color: 'white', 
                                            bgcolor: "#1DB954",
                                            width: "100%",
                                            maxWidth: "300px",
                                            '&:hover': {
                                                bgcolor: "#1ed760"
                                            }
                                        }}
                                    >
                                        Shuffle another playlist
                                    </Button>
                                    <Typography 
                                        variant='subtitle1' 
                                        component="div" 
                                        sx={{ 
                                            paddingTop: "10px", 
                                            color: "white",
                                            textAlign: "center"
                                        }}
                                    >
                                        When you want a new order, just come back and shuffle again.
                                    </Typography>
                                </Box>
                            )}
                        </>
                    ) : null}
                </Box>
            </CardContent>
        </Card>
    );
};

export default PlaylistList;
