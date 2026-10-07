/**
 * Utility functions for playlist search functionality.
 * Provides simple text-based search matching against playlist names.
 */

/**
 * Checks if a playlist matches the given search term.
 * Matches against playlist name (case-insensitive).
 * 
 * @param {Object} playlist - The playlist object to check
 * @param {string} playlist.name - The name of the playlist
 * @param {string} searchTerm - The search term to match against
 * @returns {boolean} True if the playlist matches the search term
 * 
 * @example
 * matchesSearch({ name: "German Hits" }, "german")
 * // Returns: true
 * 
 * @example
 * matchesSearch({ name: "Party Mix" }, "music")
 * // Returns: false
 */
export const matchesSearch = (playlist, searchTerm) => {
    if (!playlist || !playlist.name) {
        return false;
    }
    
    // Empty search term matches everything
    if (!searchTerm || searchTerm.trim() === '') {
        return true;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const playlistName = playlist.name.toLowerCase();
    
    // Check if search term is in playlist name
    return playlistName.includes(normalizedSearchTerm);
};

/**
 * Filters an array of playlists based on a search term.
 * 
 * @param {Array} playlists - Array of playlist objects to filter
 * @param {string} searchTerm - The search term to filter by
 * @returns {Array} Filtered array of playlists matching the search term
 * 
 * @example
 * filterPlaylists([
 *   { name: "German Hits" },
 *   { name: "Pop Party" },
 *   { name: "Jazz Classics" }
 * ], "german")
 * // Returns: [{ name: "German Hits" }]
 */
export const filterPlaylists = (playlists, searchTerm) => {
    if (!Array.isArray(playlists)) {
        return [];
    }
    
    return playlists.filter(playlist => matchesSearch(playlist, searchTerm));
};

