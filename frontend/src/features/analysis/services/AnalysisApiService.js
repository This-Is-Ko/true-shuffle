import axios from "axios";

/**
 * API service for analysis operations
 */

const API_BASE_PATH = process.env.REACT_APP_BACKEND_PATH;

/**
 * Initiates the aggregate analysis for the current user's music library.
 * @returns {Promise} Promise that resolves with aggregate task ID
 */
export const startAnalysis = () => {
    return axios.get(
        `${API_BASE_PATH}/api/user/aggregate`,
        { withCredentials: true }
    );
};

/**
 * Fetches the current state of an aggregate analysis operation.
 * @param {string} taskId - The task ID of the aggregate operation
 * @returns {Promise} Promise that resolves with aggregate state data
 */
export const getAggregateState = (taskId) => {
    return axios.get(
        `${API_BASE_PATH}/api/user/aggregate/state/${taskId}`,
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

/**
 * Calculates new wait time for polling with exponential backoff.
 * @param {number} currentWaitTime - Current wait time in milliseconds
 * @returns {number} New wait time (capped at 10000ms)
 */
export const calcNewWaitTime = (currentWaitTime) => {
    if (currentWaitTime != null) {
        return Math.min(currentWaitTime + 500, 10000);
    }
    return 1000;
};

