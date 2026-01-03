import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";

import PlaylistList from "./PlaylistList";
import ErrorMessage from "../../../components/ErrorMessage";
import ShufflePageSidebar from "./ShufflePageSidebar";
import PLAYLIST_SHUFFLE_STATE from "../state/PlaylistShuffleState";

const AllPlaylistsContainer = ({ selectPlaylist, setSelectedPlaylist, selectedPlaylist, onHowToClick, onDeleteSuccess }) => {
    const [playlists, setPlaylists] = useState([]);
    const [userShuffleCounter, setUserShuffleCounter] = useState(false);
    const [recentShuffles, setRecentShuffles] = useState([]);
    const [error, setError] = useState(false);
    
    // Shuffle state
    const [playlistUri, setPlaylistUri] = useState(null);
    const [shuffleTaskId, setShuffleTaskId] = useState("");
    const [shuffleState, setShuffleState] = useState("");
    const [shuffleStateMessage, setShuffleStateMessage] = useState("");
    const [shuffleError, setShuffleError] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [shuffleStatePollingWaitTime, setShuffleStatePollingWaitTime] = useState(1000);
    
    const MAX_RETRIES_PROGRESS_STATE = 30;
    const MAX_RETRIES_PENDING_STATE = 20;
    const MAX_RETRIES_ERROR_STATE = 5;

    const getPlaylistsCall = () => {
        axios
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/me?include-stats=true`, { withCredentials: true })
            .then((result) => {
                setPlaylists(result.data.all_playlists);
                if ("user_shuffle_counter" in result.data) {
                    setUserShuffleCounter(result.data.user_shuffle_counter);
                }
                setError(false);
            })
            .catch((responseError) => {
                if (responseError && responseError.response && responseError.response.status === 401) {
                    setError({ message: "Unable to authenticate your account, please logout and try again" });
                } else {
                    setError({ message: "Unable to connect to Spotify, please try again later" });
                }
            });
    };

    const getRecentShuffles = () => {
        axios
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/user/shuffle/recent`, { withCredentials: true })
            .then((result) => {
                if (result.data != null && result.data.recent_shuffles != null) {
                    setRecentShuffles(result.data.recent_shuffles);
                }
            })
            .catch(() => {
                console.error("Failed to fetch recent shuffles");
            });
    };

    const handleDeleteSuccess = () => {
        getPlaylistsCall();
        getRecentShuffles();
        if (onDeleteSuccess) {
            onDeleteSuccess();
        }
    };

    const refreshData = () => {
        getPlaylistsCall();
        getRecentShuffles();
    };

    /**
     * Initiates a request to shuffle the selected playlist.
     * If successful, stores the shuffle task ID for tracking progress.
     * Handles authentication and connectivity errors.
     */
    const postQueueShufflePlaylistCall = () => {
        if (selectedPlaylist !== null && selectedPlaylist.id !== null && selectedPlaylist.id !== "" && selectedPlaylist.name !== null ) {
            // Reset shuffle state
            setShuffleTaskId("");
            setShuffleState("");
            setShuffleStateMessage("");
            setPlaylistUri(null);
            setShuffleError(false);
            setAttemptCount(0);
            setShuffleStatePollingWaitTime(1000);
            
            // Call shuffle
            axios
                .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/shuffle`,
                    {
                        is_use_liked_tracks: "false",
                        playlist_id: selectedPlaylist.id,
                        playlist_name: selectedPlaylist.name,
                        is_make_new_playlist: "false"
                    },
                    { headers: { "Content-Type": "application/json" }, withCredentials: true })
                .then(result => {
                    setShuffleTaskId(result.data.shuffle_task_id);
                    setShuffleError(false);
                })
                .catch((responseError) => {
                    if (responseError && responseError.response && responseError.response.status === 401) {
                        setShuffleError({ message: "Unable to authenticate your account, please logout and try again" });
                    } else {
                        setShuffleError({ message: "Unable to connect to Spotify, please try again later" });
                    }
                });
        }
    };

    /**
     * Polls the backend for the current shuffle state using the stored shuffleTaskId.
     * Updates the UI based on the received state and implements retry logic.
     */
    const getShuffleState = () => {
        if (shuffleTaskId) {
            axios
                .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/shuffle/state/` + shuffleTaskId, {withCredentials: true})
                .then(result => {
                    if (result?.data?.state) {
                        setShuffleState(result.data.state);
                        // Clear any previous errors on successful state update
                        setShuffleError(false);
                        
                        switch (result.data.state) {
                            case PLAYLIST_SHUFFLE_STATE.SUCCESS:
                                setShuffleStateMessage("");
                                setPlaylistUri(result.data.result.playlist_uri);
                                // Reset counters on success
                                setAttemptCount(0);
                                setShuffleStatePollingWaitTime(1000);
                                break;

                            case PLAYLIST_SHUFFLE_STATE.PROGRESS:
                                setShuffleStateMessage(result.data.progress.state);
                                // Use to display playlist link early in shuffle process
                                if (result?.data?.progress?.playlist_uri) {
                                    setPlaylistUri(result.data.progress.playlist_uri);
                                }
                                setAttemptCount(prev => prev + 1);
                                if (attemptCount >= MAX_RETRIES_PROGRESS_STATE) {
                                    setShuffleError({ message: "Unable to get shuffle state. Please try again later" });
                                } else {
                                    setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
                                }
                                break;

                            case PLAYLIST_SHUFFLE_STATE.FAILURE:
                                setAttemptCount(prev => prev + 1);
                                if (attemptCount >= MAX_RETRIES_ERROR_STATE) {
                                    setShuffleError({ message: "Error while checking shuffle state. Please try again later" });
                                } else {
                                    setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
                                }
                                break;

                            case PLAYLIST_SHUFFLE_STATE.PENDING:
                                setAttemptCount(prev => prev + 1);
                                if (attemptCount >= MAX_RETRIES_PENDING_STATE) {
                                    setShuffleError({ message: "Unable to get shuffle state. Please try again later" });
                                } else {
                                    setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }).catch(responseError => {
                    setAttemptCount(prev => prev + 1);
                    if (attemptCount >= MAX_RETRIES_ERROR_STATE) {
                        setShuffleError({ message: "Error while checking shuffle state. Please try again later" });
                    } else {
                        setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
                    }
                });
        } else {
            setAttemptCount(prev => prev + 1);
            if (attemptCount >= 20) {
                setShuffleError({ message: "Unable to get shuffle state. Please try again later" });
            } else {
                setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
            }
        }
    }

    /**
     * Implements a backoff strategy for polling frequency.
     * Ensures the polling interval does not exceed 10 seconds.
     * @param {number} currentWaitTime - Current polling interval.
     * @returns {number} - New polling interval.
     */
    const calcNewWaitTime = (currentWaitTime) => {
        if (currentWaitTime != null){
            return Math.min(currentWaitTime + 500, 10000);
        }
    }

    useEffect(() => {
        getPlaylistsCall();
        getRecentShuffles();
    }, []);

    // Initiate shuffle when playlist is selected
    useEffect(() => {
        if (selectedPlaylist !== null) {
            postQueueShufflePlaylistCall();
        } else {
            // Reset shuffle state when no playlist is selected
            setShuffleTaskId("");
            setShuffleState("");
            setShuffleStateMessage("");
            setPlaylistUri(null);
            setShuffleError(false);
            setAttemptCount(0);
            setShuffleStatePollingWaitTime(1000);
        }
    }, [selectedPlaylist]);

    // Periodically poll for the shuffle state
    useEffect(() => {
        if (!shuffleTaskId || shuffleState === PLAYLIST_SHUFFLE_STATE.SUCCESS) {
            return;
        }
        
        const timer = setTimeout(() => {
            getShuffleState();
        }, shuffleStatePollingWaitTime);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shuffleTaskId, shuffleStatePollingWaitTime, shuffleState]);

    const isSpotifyConnectionError = error !== false && 
        error.message === "Unable to connect to Spotify, please try again later";

    return (
        <Box sx={{ 
            width: "90%", 
            maxWidth: "1400px",
            margin: "auto", 
            paddingBottom: "10px", 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 2, md: 3 },
            boxSizing: 'border-box',
            alignItems: { md: 'stretch' }
        }}>
            {/* Sidebar - only show if not Spotify connection error */}
            {!isSpotifyConnectionError && (
                <ShufflePageSidebar
                    userShuffleCounter={userShuffleCounter}
                    recentShuffles={recentShuffles}
                    onHowToClick={onHowToClick}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}

            {/* Main Content */}
            <Box sx={{ 
                flex: { md: '1 1 0%' },
                minWidth: { md: '400px' },
                paddingTop: { xs: 2, md: 0 },
                boxSizing: 'border-box',
                width: { xs: '100%', md: 'auto' },
                display: 'flex',
                alignItems: { md: 'stretch' }
            }}>
                {error !== false ? (
                    <ErrorMessage error={error} isGeneric={false} />
                ) : playlists.length > 0 ? (
                    <PlaylistList 
                        playlists={playlists} 
                        selectPlaylist={selectPlaylist} 
                        setSelectedPlaylist={setSelectedPlaylist}
                        selectedPlaylist={selectedPlaylist}
                        shuffleState={shuffleState}
                        shuffleStateMessage={shuffleStateMessage}
                        shuffleError={shuffleError}
                        playlistUri={playlistUri}
                        onHowToClick={onHowToClick}
                        onRefreshData={refreshData}
                    />
                ) : (
                    <PlaylistList 
                        loading={true}
                        onHowToClick={onHowToClick}
                    />
                )}
            </Box>
        </Box>
    );
};

export default AllPlaylistsContainer;
