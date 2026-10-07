/**
 * Utility functions for authentication checks
 */

/**
 * Checks if the user is authenticated by verifying the presence of the authentication cookie.
 * @returns {boolean} True if the authentication cookie exists, false otherwise.
 */
export const isAuthenticated = () => {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'));
};

