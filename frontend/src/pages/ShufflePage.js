import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { checkPageAccessAndRedirect } from "../utils/SpotifyAuthService";
import { isAuthenticated } from "../utils/AuthUtils";
import AllPlaylistsContainer from "../features/shuffle/components/PlaylistContainer";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToShuffleEntry } from '../components/howToComponents/HowToEntries';
import Footer from "../components/Footer";

/**
 * ShufflePage component - Main page for playlist shuffling functionality.
 * Handles authentication check, playlist selection, and displays the shuffle interface.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isAuth - Authentication state from parent
 * @param {string} props.loginUri - Spotify login URI for authentication
 */
const ShufflePage = ({ isAuth, loginUri }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated());
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    /**
     * Handles opening the "How To" modal
     */
    const handleHowToModalOpen = () => setIsHowToModalOpen(true);

    /**
     * Handles closing the "How To" modal
     */
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    /**
     * Handles playlist selection - callback function passed to child components
     * Note: This function is required by the PlaylistContainer component interface
     * but the actual selection is handled via setSelectedPlaylist
     * 
     * @param {string} playlistId - The ID of the selected playlist
     * @param {string} playlistName - The name of the selected playlist (unused but required by interface)
     */
    const handlePlaylistSelection = (playlistId, playlistName) => {
        // This callback is kept for interface compatibility
        // The actual selection logic is handled via setSelectedPlaylist
    };

    // Update authentication state when isAuth prop changes
    useEffect(() => {
        setIsUserAuthenticated(isAuthenticated());
    }, [isAuth]);

    // Validate page access and redirect to Spotify login if required
    if (isUserAuthenticated === false) {
        return checkPageAccessAndRedirect(isUserAuthenticated, loginUri, "/shuffle");
    }

    return (
        <main>
            <Box>
                <HowToModal 
                    isModalOpen={isHowToModalOpen} 
                    handleClose={handleHowToModalClose} 
                    steps={HowToShuffleEntry}
                />
                <Box>
                    <AllPlaylistsContainer 
                        selectPlaylist={handlePlaylistSelection} 
                        setSelectedPlaylist={setSelectedPlaylist}
                        selectedPlaylist={selectedPlaylist}
                        onHowToClick={handleHowToModalOpen}
                    />
                </Box>
            </Box>
            <Footer />
        </main>
    );
};

export default ShufflePage;
