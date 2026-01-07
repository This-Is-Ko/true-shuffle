import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";

import PlaylistList from "./PlaylistList";
import ErrorMessage from "../../../components/ErrorMessage";
import ShufflePageSidebar from "./ShufflePageSidebar";
import PLAYLIST_SHUFFLE_STATE from "../state/PlaylistShuffleState";
import {
    fetchUserPlaylists,
    fetchRecentShuffles,
    queueShufflePlaylist,
    fetchShuffleState,
    createErrorFromResponse
} from "../services/PlaylistApiService";
import {
    MAX_RETRY_ATTEMPTS,
    POLLING_CONFIG,
    ERROR_MESSAGES
} from "../constants/ShuffleConstants";
import { CorrelationIdProvider, useCorrelationId, OPERATION_TYPES } from "../../../contexts/CorrelationIdContext";
import { setCorrelationIdGetter } from "../../../utils/apiClient";
import { filterPlaylists } from "../../../utils/playlistSearchUtils";

/**
 * AllPlaylistsContainer component - Main container for the shuffle page.
 * Manages playlist data, shuffle operations, and state polling.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.selectPlaylist - Callback for playlist selection (legacy interface)
 * @param {Function} props.setSelectedPlaylist - Function to set the selected playlist
 * @param {Object|null} props.selectedPlaylist - Currently selected playlist
 * @param {Function} props.onHowToClick - Callback to open "How To" modal
 * @param {Function} props.onDeleteSuccess - Callback when shuffle deletion succeeds
 */
const AllPlaylistsContainer = ({ selectPlaylist, setSelectedPlaylist, selectedPlaylist, onHowToClick, onDeleteSuccess }) => {
    // Correlation ID management
    const { getCorrelationId, resetCorrelationId, resetAll } = useCorrelationId();
    
    // Playlist data state
    const [playlists, setPlaylists] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userShuffleCounter, setUserShuffleCounter] = useState(false);
    const [recentShuffles, setRecentShuffles] = useState([]);
    const [existingShuffledPlaylistCount, setExistingShuffledPlaylistCount] = useState(null);
    const [error, setError] = useState(false);
    
    // Shuffle operation state
    const [shuffledPlaylistUri, setShuffledPlaylistUri] = useState(null);
    const [shuffleTaskId, setShuffleTaskId] = useState("");
    const [shuffleState, setShuffleState] = useState("");
    const [shuffleStateMessage, setShuffleStateMessage] = useState("");
    const [shuffleError, setShuffleError] = useState(false);
    const [, setPollingAttemptCount] = useState(0);
    const [pollingWaitTimeMs, setPollingWaitTimeMs] = useState(POLLING_CONFIG.INITIAL_WAIT_TIME_MS);

    /**
     * Filters playlists based on search term.
     * Memoized to avoid unnecessary re-computations on unrelated state changes.
     */
    const filteredPlaylists = useMemo(() => {
        return filterPlaylists(playlists, searchTerm);
    }, [playlists, searchTerm]);

    /**
     * Fetches all playlists for the current user from the API.
     * Also retrieves user shuffle counter statistics if available.
     * Resets SHUFFLE and DELETE correlation IDs when fetching playlists (new playlist retrieval).
     */
    const loadUserPlaylists = () => {
        // Reset correlation IDs for shuffle and delete operations when fetching playlists
        resetCorrelationId(OPERATION_TYPES.SHUFFLE);
        resetCorrelationId(OPERATION_TYPES.DELETE);
        
        fetchUserPlaylists()
            .then((result) => {
                setPlaylists(result.data.all_playlists);
                if ("user_shuffle_counter" in result.data) {
                    setUserShuffleCounter(result.data.user_shuffle_counter);
                }
                if ("existing_shuffled_playlist_count" in result.data) {
                    setExistingShuffledPlaylistCount(result.data.existing_shuffled_playlist_count);
                } else {
                    setExistingShuffledPlaylistCount(null);
                }
                setError(false);
            })
            .catch((responseError) => {
                setError(createErrorFromResponse(responseError));
            });
    };

    /**
     * Fetches recent shuffle operations for the current user.
     * Silently fails if the request is unsuccessful (non-critical data).
     */
    const loadRecentShuffles = () => {
        fetchRecentShuffles()
            .then((result) => {
                if (result.data != null && result.data.recent_shuffles != null) {
                    setRecentShuffles(result.data.recent_shuffles);
                }
            })
            .catch(() => {
                console.error("Failed to fetch recent shuffles");
            });
    };

    /**
     * Handles successful deletion of shuffled playlists.
     * Refreshes playlist and recent shuffles data, and calls parent callback if provided.
     */
    const handleDeleteSuccess = () => {
        loadUserPlaylists();
        loadRecentShuffles();
        if (onDeleteSuccess) {
            onDeleteSuccess();
        }
    };

    /**
     * Refreshes all data by reloading playlists and recent shuffles.
     */
    const refreshData = () => {
        loadUserPlaylists();
        loadRecentShuffles();
    };

    /**
     * Resets all shuffle-related state to initial values.
     * Used when starting a new shuffle operation or clearing selection.
     */
    const resetShuffleState = () => {
        setShuffleTaskId("");
        setShuffleState("");
        setShuffleStateMessage("");
        setShuffledPlaylistUri(null);
        setShuffleError(false);
        setPollingAttemptCount(0);
        setPollingWaitTimeMs(POLLING_CONFIG.INITIAL_WAIT_TIME_MS);
    };

    /**
     * Initiates a shuffle request for the selected playlist.
     * Validates the playlist data, resets state, and queues the shuffle operation.
     * On success, stores the shuffle task ID for progress tracking.
     */
    const initiateShuffleOperation = () => {
        // Validate playlist selection
        if (selectedPlaylist === null || 
            !selectedPlaylist.id || 
            selectedPlaylist.id === "" || 
            !selectedPlaylist.name) {
            return;
        }

        // Reset correlation ID for shuffle operation when starting new shuffle
        resetCorrelationId(OPERATION_TYPES.SHUFFLE);
        
        // Reset state before starting new shuffle
        resetShuffleState();
        
        // Queue shuffle operation
        queueShufflePlaylist({
            playlist_id: selectedPlaylist.id,
            playlist_name: selectedPlaylist.name
        })
            .then(result => {
                setShuffleTaskId(result.data.shuffle_task_id);
                setShuffleError(false);
            })
            .catch((responseError) => {
                setShuffleError(createErrorFromResponse(responseError));
            });
    };

    /**
     * Calculates the next polling wait time using exponential backoff strategy.
     * Ensures the wait time does not exceed the maximum configured value.
     * 
     * @param {number} currentWaitTimeMs - Current polling interval in milliseconds
     * @returns {number} New polling interval in milliseconds
     */
    const calculateNextPollingWaitTime = (currentWaitTimeMs) => {
        if (currentWaitTimeMs != null) {
            return Math.min(
                currentWaitTimeMs + POLLING_CONFIG.BACKOFF_INCREMENT_MS,
                POLLING_CONFIG.MAX_WAIT_TIME_MS
            );
        }
        return POLLING_CONFIG.INITIAL_WAIT_TIME_MS;
    };

    /**
     * Handles the shuffle state based on the current state value.
     * Implements state-specific logic including retry limits and error handling.
     * 
     * @param {string} state - Current shuffle state
     * @param {Object} stateData - Additional data from the state response
     */
    const handleShuffleStateUpdate = (state, stateData) => {
        setShuffleState(state);
        setShuffleError(false); // Clear errors on successful state update

        switch (state) {
            case PLAYLIST_SHUFFLE_STATE.SUCCESS:
                setShuffleStateMessage("");
                setShuffledPlaylistUri(stateData.result.playlist_uri);
                // Reset polling state on successful completion
                setPollingAttemptCount(0);
                setPollingWaitTimeMs(POLLING_CONFIG.INITIAL_WAIT_TIME_MS);
                break;

            case PLAYLIST_SHUFFLE_STATE.PROGRESS:
                setShuffleStateMessage(stateData.progress.state);
                // Playlist URI may be available early in the shuffle process
                if (stateData?.progress?.playlist_uri) {
                    setShuffledPlaylistUri(stateData.progress.playlist_uri);
                }
                handlePollingRetry(MAX_RETRY_ATTEMPTS.PROGRESS_STATE, ERROR_MESSAGES.SHUFFLE_STATE_FAILED);
                break;

            case PLAYLIST_SHUFFLE_STATE.FAILURE:
                handlePollingRetry(MAX_RETRY_ATTEMPTS.ERROR_STATE, ERROR_MESSAGES.SHUFFLE_STATE_CHECK_FAILED);
                break;

            case PLAYLIST_SHUFFLE_STATE.PENDING:
                handlePollingRetry(MAX_RETRY_ATTEMPTS.PENDING_STATE, ERROR_MESSAGES.SHUFFLE_STATE_FAILED);
                break;

            default:
                break;
        }
    };

    /**
     * Handles retry logic for polling operations.
     * Increments attempt count and applies backoff, or sets error if max attempts reached.
     * 
     * @param {number} maxAttempts - Maximum number of retry attempts allowed
     * @param {string} errorMessage - Error message to display if max attempts exceeded
     */
    const handlePollingRetry = (maxAttempts, errorMessage) => {
        setPollingAttemptCount(prev => {
            const newAttemptCount = prev + 1;
            // Check if we've exceeded max attempts after incrementing
            if (newAttemptCount >= maxAttempts) {
                setShuffleError({ message: errorMessage });
            } else {
                setPollingWaitTimeMs(currentWaitTime => calculateNextPollingWaitTime(currentWaitTime));
            }
            return newAttemptCount;
        });
    };

    /**
     * Polls the backend for the current shuffle state using the stored shuffleTaskId.
     * Updates the UI based on the received state and implements retry logic with exponential backoff.
     */
    const pollShuffleState = () => {
        if (!shuffleTaskId) {
            // If no task ID, still attempt retry with fallback limit
            handlePollingRetry(MAX_RETRY_ATTEMPTS.FALLBACK_STATE, ERROR_MESSAGES.SHUFFLE_STATE_FAILED);
            return;
        }

        fetchShuffleState(shuffleTaskId)
            .then(result => {
                if (result?.data?.state) {
                    handleShuffleStateUpdate(result.data.state, result.data);
                }
            })
            .catch(() => {
                handlePollingRetry(MAX_RETRY_ATTEMPTS.ERROR_STATE, ERROR_MESSAGES.SHUFFLE_STATE_CHECK_FAILED);
            });
    };

    // Set up correlation ID getter for apiClient and reset all correlation IDs on mount
    useEffect(() => {
        // Set the correlation ID getter function for apiClient
        setCorrelationIdGetter(getCorrelationId);
        
        // Reset all correlation IDs on page load
        resetAll();
        
        // Load playlists and recent shuffles on component mount
        loadUserPlaylists();
        loadRecentShuffles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initiate shuffle operation when a playlist is selected
    useEffect(() => {
        if (selectedPlaylist !== null) {
            initiateShuffleOperation();
        } else {
            // Reset shuffle state when no playlist is selected
            resetShuffleState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlaylist]);

    // Periodically poll for shuffle state while operation is in progress
    useEffect(() => {
        // Stop polling if no task ID or shuffle is complete
        if (!shuffleTaskId || shuffleState === PLAYLIST_SHUFFLE_STATE.SUCCESS) {
            return;
        }
        
        const pollingTimer = setTimeout(() => {
            pollShuffleState();
        }, pollingWaitTimeMs);

        return () => clearTimeout(pollingTimer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shuffleTaskId, pollingWaitTimeMs, shuffleState]);

    // Determine if the error is a Spotify connection issue (hide sidebar in this case)
    const isSpotifyConnectionError = error !== false && 
        error.message === ERROR_MESSAGES.CONNECTION_FAILED;

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
                    existingShuffledPlaylistCount={existingShuffledPlaylistCount}
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
                        playlists={filteredPlaylists}
                        allPlaylistsCount={playlists.length}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectPlaylist={selectPlaylist} 
                        setSelectedPlaylist={setSelectedPlaylist}
                        selectedPlaylist={selectedPlaylist}
                        shuffleState={shuffleState}
                        shuffleStateMessage={shuffleStateMessage}
                        shuffleError={shuffleError}
                        playlistUri={shuffledPlaylistUri}
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

// Wrap component with CorrelationIdProvider
const AllPlaylistsContainerWithProvider = (props) => {
    return (
        <CorrelationIdProvider>
            <AllPlaylistsContainer {...props} />
        </CorrelationIdProvider>
    );
};

export default AllPlaylistsContainerWithProvider;
