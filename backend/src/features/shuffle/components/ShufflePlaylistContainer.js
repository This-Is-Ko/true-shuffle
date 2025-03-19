import React, { useEffect, useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import axios from "axios";
import ShuffleResponse from "./ShuffleResponse";
import ShuffleLoading from "./ShuffleLoading";
import PLAYLIST_SHUFFLE_STATE from "../state/PlaylistShuffleState";


const ShufflePlaylistContainer = ({ isAuth, setIsAuth, selectedPlaylist }) => {
    const [playlistUri, setPlaylistUri] = useState(null);
    const [shuffleTaskId, setShuffleTaskId] = useState("");
    const [shuffleState, setShuffleState] = useState("");
    const [shuffleStateMessage, setShuffleStateMessage] = useState("");
    const [error, setError] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [shuffleStatePollingWaitTime, setShuffleStatePollingWaitTime] = useState(1000);

    const MAX_RETRIES_PROGRESS_STATE = 30;
    const MAX_RETRIES_PENDING_STATE = 20;

    /**
     * Initiates a request to shuffle the selected playlist.
     * If successful, stores the shuffle task ID for tracking progress.
     * Handles authentication and connectivity errors.
     */
    const postQueueShufflePlaylistCall = () => {
        if (selectedPlaylist !== null && selectedPlaylist.id !== null && selectedPlaylist.id !== "" && selectedPlaylist.name !== null ) {
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
                    setError(false);
                })
                .catch((responseError) => {
                    if (responseError && responseError.response && responseError.response.status === 401) {
                        setError({ message: "Unable to authenticate your account, please logout and try again" });
                    } else {
                        setError({ message: "Unable to connect to Spotify, please try again later" });
                    }
                });
        } else {
            setError({ message: "No playlist selected" });
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
                        switch (result.data.state) {
                            case PLAYLIST_SHUFFLE_STATE.SUCCESS:
                                setShuffleStateMessage("");
                                setPlaylistUri(result.data.result.playlist_uri);
                                break;

                            case PLAYLIST_SHUFFLE_STATE.PROGRESS:
                                setShuffleStateMessage(result.data.progress.state);
                                // Use to display playlist link early in shuffle process
                                if (result?.data?.progress?.playlist_uri) {
                                    setPlaylistUri(result.data.progress.playlist_uri);
                                }
                                setAttemptCount(attemptCount + 1);
                                if (attemptCount >= MAX_RETRIES_PROGRESS_STATE) {
                                    setError({ message: "Unable to get shuffle state. Please try again later" });
                                } else {
                                    setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
                                }
                                break;

                            case PLAYLIST_SHUFFLE_STATE.FAILURE:
                                setError({ message: "Error while checking shuffle state" });
                                break;

                            case PLAYLIST_SHUFFLE_STATE.PENDING:
                                setAttemptCount(attemptCount + 1);
                                if (attemptCount >= MAX_RETRIES_PENDING_STATE) {
                                    setError({ message: "Unable to get shuffle state. Please try again later" });
                                } else {
                                    setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }).catch(responseError => {
                    setError({ message: "Error while checking shuffle state" });
                });
        } else {
            setAttemptCount(attemptCount + 1);
            if (attemptCount >= 20) {
                setError({ message: "Unable to get shuffle state. Please try again later" });
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

    /**
     * Initiates the playlist shuffle request when the component mounts.
     */
    useEffect(() => {
        postQueueShufflePlaylistCall();
    }, []);

    /**
     * Periodically polls for the shuffle state.
     * Uses a timeout to avoid excessive requests.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            getShuffleState();
        }, shuffleStatePollingWaitTime);

        return () => clearTimeout(timer);
    }, [shuffleTaskId, shuffleStatePollingWaitTime]);

    return (
        <div className="shuffle-container">
            {error !== false ? (
                <ErrorMessage error={error} isGeneric={false} />
            ) : (
                shuffleState === PLAYLIST_SHUFFLE_STATE.SUCCESS ? (
                    <ShuffleResponse playlist={selectedPlaylist} playlistUri={playlistUri} />
                ) : (
                    <ShuffleLoading playlist={selectedPlaylist} playlistUri={playlistUri} message={shuffleState === PLAYLIST_SHUFFLE_STATE.PROGRESS ? shuffleStateMessage : "Shuffling..."}/>
                )
            )}
        </div>
    )
}

export default ShufflePlaylistContainer;
