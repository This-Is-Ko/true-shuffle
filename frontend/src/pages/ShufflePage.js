import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { checkPageAccessAndRedirect } from "../utils/SpotifyAuthService";
import AllPlaylistsContainer from "../features/shuffle/components/PlaylistContainer";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToShuffleEntry } from '../components/howToComponents/HowToEntries';

const ShufflePage = ({ isAuth, loginUri }) => {
    const [auth, setAuth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [newPlaylistUri, setNewPlaylistUri] = useState("");
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const handleHowToModalOpen = () => setIsHowToModalOpen(true);
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    const selectPlaylist = (playlistId, playlistName) => {
        setNewPlaylistUri(playlistId)
    };

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth, newPlaylistUri]);

    const renderPageContent = () => {
        return <AllPlaylistsContainer 
            selectPlaylist={selectPlaylist} 
            setSelectedPlaylist={setSelectedPlaylist}
            selectedPlaylist={selectedPlaylist}
            onHowToClick={handleHowToModalOpen}
        />
    };

    // Validate page access and redirect to Spotify login if required
    if (auth === false) {
        return checkPageAccessAndRedirect(auth, loginUri, "/shuffle")
    } else {
        return (
            <main>
                <Box>
                    <HowToModal isModalOpen={isHowToModalOpen} handleClose={handleHowToModalClose} steps={HowToShuffleEntry}></HowToModal>
                    <Box>
                        {renderPageContent()}
                    </Box>
                </Box>
            </main >
        )
    }
};

export default ShufflePage;
