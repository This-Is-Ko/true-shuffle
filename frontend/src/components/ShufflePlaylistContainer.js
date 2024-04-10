import React, { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import ShufflePlaylistResponse from "./ShufflePlaylistResponse";
import LoadingMessage from "./LoadingMessage";

const ShufflePlaylistContainer = ({ isAuth, setIsAuth }) => {
    const [playlistUri, setPlaylistUri] = useState("");
    const [shuffleTaskId, setShuffleTaskId] = useState("");
    const [shuffleState, setShuffleState] = useState("");
    const [shuffleStateMessage, setShuffleStateMessage] = useState("");
    const [error, setError] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [shuffleStatePollingWaitTime, setShuffleStatePollingWaitTime] = useState(1000);

    const getQueryParams = () => {
        return new URLSearchParams(window.location.search);
    }

    const postQueueShufflePlaylistCall = () => {
        if (!(getQueryParams().get('playlistId') == null || getQueryParams().get('playlistId') === "")) {
            // Call shuffle
            axios
                .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/shuffle`,
                    {
                        is_use_liked_tracks: "false",
                        playlist_id: getQueryParams().get('playlistId'),
                        playlist_name: getQueryParams().get('playlistName'),
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

    const getShuffleState = () => {
        if (shuffleTaskId !== null && shuffleTaskId !== "") {
            axios
                .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/shuffle/state/` + shuffleTaskId, {withCredentials: true})
                .then(result => {
                    setShuffleState(result.data.state);
                    if (result.data.state === "SUCCESS") {
                        setPlaylistUri(result.data.result.playlist_uri)
                    } else if (result.data.state === "PROGRESS") {
                        setShuffleStateMessage(result.data.progress.state);
                        setAttemptCount(attemptCount + 1);
                        if (attemptCount >= 30) {
                            setError({ message: "Unable to get shuffle state. Please try again later" });
                        } else {
                            setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
                        }
                    } else if (result.data.state === "FAILURE") {
                        setError({ message: "Error while checking shuffle state" });
                    } else if (result.data.state === "PENDING") {
                        setAttemptCount(attemptCount + 1);
                        if (attemptCount >= 20) {
                            setError({ message: "Unable to get shuffle state. Please try again later" });
                        } else {
                            setShuffleStatePollingWaitTime(calcNewWaitTime(shuffleStatePollingWaitTime));
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
    
    // Apply backoff strategy for polling rate
    const calcNewWaitTime = (currentWaitTime) => {
        if (currentWaitTime != null){
            return Math.min(currentWaitTime + 500, 10000);
        }
    }

    useEffect(() => {
        postQueueShufflePlaylistCall();
    }, []);

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
                playlistUri !== "" ? (
                    <ShufflePlaylistResponse playlistUri={playlistUri} />
                ) : (
                    <div className="loading-container">
                        <CircularProgress />
                        <LoadingMessage message={shuffleState === 'PROGRESS' ? shuffleStateMessage : "Shuffling..."}/>
                    </div>
                )
            )}
        </div>
    )
}

export default ShufflePlaylistContainer