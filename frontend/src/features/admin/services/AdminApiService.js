import apiClient from "../../../utils/apiClient";
import { OPERATION_TYPES } from "../../../contexts/CorrelationIdContext";

/**
 * API service for admin dashboard operations.
 */

const API_BASE_PATH = process.env.REACT_APP_BACKEND_PATH;

/**
 * Fetches the admin overview metrics.
 * @returns {Promise} Promise that resolves with overview data
 */
export const fetchAdminOverview = () => {
    return apiClient.get(
        `${API_BASE_PATH}/api/admin/overview`,
        { operationType: OPERATION_TYPES.GENERAL }
    );
};

/**
 * Fetches monthly active users (users with any shuffle attempt per month).
 * @returns {Promise} Promise that resolves with monthly active users data
 */
export const fetchMonthlyActiveUsers = () => {
    return apiClient.get(
        `${API_BASE_PATH}/api/admin/users/monthly`,
        { operationType: OPERATION_TYPES.GENERAL }
    );
};

/**
 * Fetches the number of users created per month for the last `months` months.
 * @param {number} months - Number of months to include (default 6)
 * @returns {Promise} Promise that resolves with created users per month
 */
export const fetchCreatedUsers = (months = 6) => {
    return apiClient.get(
        `${API_BASE_PATH}/api/admin/users/created?months=${months}`,
        { operationType: OPERATION_TYPES.GENERAL }
    );
};

/**
 * Fetches the most recent shuffle events across all users.
 * @param {number} limit - Max number of events to fetch
 * @returns {Promise} Promise that resolves with recent shuffle events
 */
export const fetchRecentShuffles = (limit = 20) => {
    return apiClient.get(
        `${API_BASE_PATH}/api/admin/shuffles/recent?limit=${limit}`,
        { operationType: OPERATION_TYPES.GENERAL }
    );
};

/**
 * Fetches the most recent failed shuffle events.
 * @param {number} limit - Max number of events to fetch
 * @returns {Promise} Promise that resolves with recent failure events
 */
export const fetchRecentFailures = (limit = 20) => {
    return apiClient.get(
        `${API_BASE_PATH}/api/admin/shuffles/failures?limit=${limit}`,
        { operationType: OPERATION_TYPES.GENERAL }
    );
};

/**
 * Fetches the shuffle failure rate over time.
 * @param {string} groupBy - Aggregation bucket: "day", "week" or "month"
 * @returns {Promise} Promise that resolves with failure rate data
 */
export const fetchFailureRate = (groupBy = "day") => {
    return apiClient.get(
        `${API_BASE_PATH}/api/admin/shuffles/failure-rate?group_by=${groupBy}`,
        { operationType: OPERATION_TYPES.GENERAL }
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
    return { message: "Unable to connect to the backend, please try again later" };
};
