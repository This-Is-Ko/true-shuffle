 /**
 * Constants for shuffle functionality
 */

// Maximum retry attempts for different shuffle states
export const MAX_RETRY_ATTEMPTS = {
    PROGRESS_STATE: 30,
    PENDING_STATE: 20,
    ERROR_STATE: 5,
    FALLBACK_STATE: 20
};

// Polling configuration
export const POLLING_CONFIG = {
    INITIAL_WAIT_TIME_MS: 1000,
    MAX_WAIT_TIME_MS: 10000,
    BACKOFF_INCREMENT_MS: 500
};

// Error messages
export const ERROR_MESSAGES = {
    AUTHENTICATION_FAILED: "Unable to authenticate your account, please logout and try again",
    CONNECTION_FAILED: "Unable to connect to Spotify, please try again later",
    SHUFFLE_STATE_FAILED: "Unable to get shuffle state. Please try again later",
    SHUFFLE_STATE_CHECK_FAILED: "Error while checking shuffle state. Please try again later"
};

