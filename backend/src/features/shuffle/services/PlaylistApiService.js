import axios from "axios";

/**
 * API service for playlist and shuffle operations
 */

const API_BASE_PATH = process.env.REACT_APP_BACKEND_PATH;

/**
 * Fetches all playlists for the current user, including statistics.
 * @returns {Promise} Promise that resolves with playlists data
 */
export const fetchUserPlaylists = () => {
    return axios.get(
        `${API_BASE_PATH}/api/playlist/me?include-stats=true`,
        { withCredentials: true }
    );
};

/**
 * Fetches recent shuffle operations for the current user.
 * @returns {Promise} Promise that resolves with recent shuffles data
 */
export const fetchRecentShuffles = () => {
    return axios.get(
        `${API_BASE_PATH}/api/user/shuffle/recent`,
        { withCredentials: true }
    );
};

/**
 * Initiates a shuffle operation for the specified playlist.
 * @param {Object} playlistData - The playlist data to shuffle
 * @param {string} playlistData.playlist_id - The ID of the playlist to shuffle
 * @param {string} playlistData.playlist_name - The name of the playlist
 * @returns {Promise} Promise that resolves with shuffle task ID
 */
export const queueShufflePlaylist = (playlistData) => {
    return axios.post(
        `${API_BASE_PATH}/api/playlist/shuffle`,
        {
            is_use_liked_tracks: "false",
            playlist_id: playlistData.playlist_id,
            playlist_name: playlistData.playlist_name,
            is_make_new_playlist: "false"
        },
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        }
    );
};

/**
 * Fetches the current state of a shuffle operation.
 * @param {string} shuffleTaskId - The task ID of the shuffle operation
 * @returns {Promise} Promise that resolves with shuffle state data
 */
export const fetchShuffleState = (shuffleTaskId) => {
    return axios.get(
        `${API_BASE_PATH}/api/playlist/shuffle/state/${shuffleTaskId}`,
        { withCredentials: true }
    );
};

/**
 * Creates an error object from an API error response.
 * @param {Object} error - The error response from axios
 * @returns {Object} Error object with appropriate message
 */
export const createErrorFromResponse = (error) => {
    if (error && error.response && error.response.status === 401) {
        return { message: "Unable to authenticate your account, please logout and try again" };
    }
    return { message: "Unable to connect to Spotify, please try again later" };
};

