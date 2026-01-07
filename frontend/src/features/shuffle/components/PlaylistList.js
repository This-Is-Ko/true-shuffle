import React from "react";
import { Card, CardContent, Box, Typography, IconButton, CircularProgress, Button, TextField, InputAdornment } from "@mui/material";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import PlaylistItem from "./PlaylistItem";
import PLAYLIST_ITEM_DISPLAY_STATES from "../state/PlaylistItemDisplayStates";
import PLAYLIST_SHUFFLE_STATE from "../state/PlaylistShuffleState";
import LoadingMessage from "../../../components/LoadingMessage";

/**
 * PlaylistList component - Displays the list of playlists or the selected playlist with shuffle status.
 * Handles three main states: all playlists view, shuffling in progress, and shuffle complete.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.playlists - Array of playlist objects to display (filtered)
 * @param {number} props.allPlaylistsCount - Total number of playlists (before filtering)
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.setSearchTerm - Function to update search term
 * @param {Function} props.selectPlaylist - Callback for playlist selection (legacy interface)
 * @param {Function} props.setSelectedPlaylist - Function to set the selected playlist
 * @param {Object|null} props.selectedPlaylist - Currently selected playlist
 * @param {string} props.shuffleState - Current state of the shuffle operation
 * @param {string} props.shuffleStateMessage - Message to display during shuffle progress
 * @param {Object|boolean} props.shuffleError - Error object if shuffle failed, false otherwise
 * @param {string|null} props.playlistUri - URI of the shuffled playlist
 * @param {boolean} props.loading - Whether playlists are still loading
 * @param {Function} props.onHowToClick - Callback to open "How To" modal
 * @param {Function} props.onRefreshData - Callback to refresh playlist data
 */
const PlaylistList = ({ 
    playlists, 
    allPlaylistsCount,
    searchTerm,
    setSearchTerm,
    selectPlaylist, 
    setSelectedPlaylist, 
    selectedPlaylist, 
    shuffleState, 
    shuffleStateMessage, 
    shuffleError, 
    playlistUri, 
    loading, 
    onHowToClick, 
    onRefreshData 
}) => {
    // Determine if shuffle operation is currently in progress
    const isShuffling = selectedPlaylist !== null && 
                       shuffleState !== "" && 
                       shuffleState !== PLAYLIST_SHUFFLE_STATE.SUCCESS &&
                       (shuffleState === PLAYLIST_SHUFFLE_STATE.PROGRESS || 
                        shuffleState === PLAYLIST_SHUFFLE_STATE.PENDING);
    
    // Determine if shuffle operation has completed successfully
    const isShuffled = selectedPlaylist !== null && shuffleState === PLAYLIST_SHUFFLE_STATE.SUCCESS;
    
    // Show loading animation when playlist is selected but shuffle hasn't started yet
    const isInitializing = selectedPlaylist !== null && shuffleState === "";
    
    // Show all playlists when no playlist is selected and not loading
    const showAllPlaylists = selectedPlaylist === null && !loading;
    
    // Center content when a playlist is selected (for better UX during shuffle)
    const shouldCenterContent = selectedPlaylist !== null;

    /**
     * Gets the appropriate title based on the current shuffle state.
     * 
     * @returns {string} Title text to display
     */
    const getTitle = () => {
        if (isShuffled) {
            return "Playlist shuffled!";
        } else if (isShuffling) {
            return "Shuffling playlist";
        } else {
            return "Select a playlist";
        }
    };

    /**
     * Handles the "Shuffle another playlist" button click.
     * Resets the selection and refreshes the playlist data.
     */
    const handleShuffleAnother = () => {
        if (setSelectedPlaylist) {
            setSelectedPlaylist(null);
        }
        if (onRefreshData) {
            onRefreshData();
        }
    };

    /**
     * Handles search input changes.
     * Updates the search term state.
     */
    const handleSearchChange = (event) => {
        if (setSearchTerm) {
            setSearchTerm(event.target.value);
        }
    };

    /**
     * Handles clearing the search input.
     */
    const handleClearSearch = () => {
        if (setSearchTerm) {
            setSearchTerm("");
        }
    };

    /**
     * Gets the playlist count display text.
     * Shows filtered count vs total if search is active.
     */
    const getPlaylistCountText = () => {
        if (!playlists || playlists.length === 0) {
            return "No playlists found";
        }
        
        const filteredCount = playlists.length;
        const totalCount = allPlaylistsCount || filteredCount;
        
        if (searchTerm && searchTerm.trim() !== "" && filteredCount !== totalCount) {
            return `Showing ${filteredCount} of ${totalCount}`;
        }
        
        return `${totalCount} playlist${totalCount !== 1 ? 's' : ''}`;
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
                    flexDirection: 'column',
                    gap: 2,
                    paddingTop: { xs: "10px", sm: "20px" },
                    paddingBottom: { xs: "8px", sm: "16px" },
                    marginBottom: 0,
                    flexShrink: 0
                }}>
                    {/* Title and How To Button Row */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: 1.5
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

                    {/* Search Bar and Count Row - Only show when viewing all playlists */}
                    {showAllPlaylists && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%'
                        }}>
                            <TextField
                                placeholder="Search playlists..."
                                value={searchTerm || ""}
                                onChange={handleSearchChange}
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        backgroundColor: '#282828',
                                        '& fieldset': {
                                            borderColor: '#404040',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1DB954',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1DB954',
                                        },
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: '#b3b3b3',
                                        opacity: 1
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#b3b3b3' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && searchTerm.trim() !== "" && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="clear search"
                                                onClick={handleClearSearch}
                                                edge="end"
                                                size="small"
                                                sx={{
                                                    color: '#b3b3b3',
                                                    '&:hover': {
                                                        color: '#1DB954'
                                                    }
                                                }}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#b3b3b3',
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                    textAlign: 'center'
                                }}
                            >
                                {getPlaylistCountText()}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* 
                    Main content area - dynamically switches between grid (all playlists) 
                    and flex (selected playlist) layouts based on state
                */}
                <Box
                    sx={{
                        width: "100%",
                        paddingTop: { xs: "5px", sm: "10px" },
                        paddingBottom: { xs: "10px", sm: "20px" },
                        // Grid layout for all playlists, flex for selected playlist
                        display: (showAllPlaylists || loading) ? "grid" : "flex",
                        flexDirection: (showAllPlaylists || loading) ? "row" : "column",
                        alignItems: (showAllPlaylists || loading) ? "stretch" : "center",
                        justifyContent: shouldCenterContent ? "center" : (showAllPlaylists || loading) ? "center" : "flex-start",
                        flex: shouldCenterContent ? 1 : "none",
                        minHeight: shouldCenterContent ? 0 : "auto",
                        // Responsive grid columns for playlist grid view
                        gridTemplateColumns: (showAllPlaylists || loading) ? {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(auto-fit, minmax(150px, 200px))",
                            md: "repeat(auto-fit, minmax(150px, 200px))"
                        } : "none",
                        gap: { xs: 1.5, sm: 2, md: 2 },
                        rowGap: { xs: 1.5, sm: 2, md: 2 }
                    }}
                    className="contentHolder"
                >
                    {/* Loading state - show skeleton placeholders */}
                    {loading === true ? (
                        Array.from(Array(3)).map((_, index) => (
                            <PlaylistItem
                                key={index}
                                displayState={PLAYLIST_ITEM_DISPLAY_STATES.LOADING}
                            />
                        ))
                    ) : showAllPlaylists ? (
                        /* All playlists grid view */
                        playlists.map((playlist) => (
                            <PlaylistItem
                                key={playlist.id}
                                playlist={playlist}
                                selectPlaylist={selectPlaylist}
                                setSelectedPlaylist={setSelectedPlaylist}
                                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                            />
                        ))
                    ) : selectedPlaylist ? (
                        <>
                            {/* Selected playlist card */}
                            <Box sx={{ 
                                width: "100%", 
                                maxWidth: { xs: "100%", sm: "200px" },
                                display: "flex",
                                justifyContent: "center"
                            }}>
                                <PlaylistItem
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
                            
                            {/* Error message or shuffle status - appears underneath the selected playlist item */}
                            {(isInitializing || isShuffling || (shuffleError && typeof shuffleError === 'object')) && (
                                <Box sx={{ 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    alignItems: "center",
                                    paddingTop: { xs: "10px", sm: "20px" },
                                    gap: 1,
                                    width: "100%"
                                }}>
                                    {/* Show error if present, otherwise show normal shuffle UI */}
                                    {shuffleError && typeof shuffleError === 'object' ? (
                                        <Typography variant="subtitle1" sx={{ paddingTop: "10px", color: "white" }}>
                                            {shuffleError.message || "Error while checking shuffle state. Please try again later."}
                                        </Typography>
                                    ) : (
                                        <>
                                            {/* Open button - available early in shuffle process */}
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
                                            {!isInitializing && <CircularProgress />}
                                            {isInitializing ? (
                                                <>
                                                    <CircularProgress />
                                                    <LoadingMessage message="Starting shuffle..." />
                                                </>
                                            ) : (
                                                <>
                                                    <LoadingMessage message={shuffleStateMessage || "Shuffling..."} />
                                                    {/* Inform user they can start listening early */}
                                                    {playlistUri != null && (
                                                        <LoadingMessage message="You can start listening while the rest of the tracks are being added" />
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </Box>
                            )}
                            
                            {/* Shuffle complete UI */}
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
