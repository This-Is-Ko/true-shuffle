import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";

import { checkPageAccessAndRedirect } from "../utils/SpotifyAuthService";
import AllPlaylistsContainer from "../features/shuffle/components/PlaylistContainer";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToShuffleEntry } from '../components/howToComponents/HowToEntries';
import PAGE_STATES from "../features/shuffle/state/PageStates";
import ShufflePlaylistContainer from "../features/shuffle/components/ShufflePlaylistContainer";

const ShufflePage = ({ isAuth, loginUri }) => {
    const [auth, setAuth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [newPlaylistUri, setNewPlaylistUri] = useState("");
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [pageState, setPageState] = useState(PAGE_STATES.DISPLAY_ALL_PLAYLISTS);

    const handleHowToModalOpen = () => setIsHowToModalOpen(true);
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    const selectPlaylist = (playlistId, playlistName) => {
        setNewPlaylistUri(playlistId)
    };

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth, newPlaylistUri]);

    useEffect(() => {
        if (selectedPlaylist !== null) {
            setPageState(PAGE_STATES.SHUFFLE_PLAYLIST);
        }
    }, [selectedPlaylist]);

    const renderPageContent = () => {
        switch (pageState) {
            case PAGE_STATES.DISPLAY_ALL_PLAYLISTS:
                return <AllPlaylistsContainer selectPlaylist={selectPlaylist} setSelectedPlaylist={setSelectedPlaylist} />
            case PAGE_STATES.SHUFFLE_PLAYLIST:
                return <ShufflePlaylistContainer selectedPlaylist={selectedPlaylist} />;
            default:
                return null;
        }
    };

    // Validate page access and redirect to Spotify login if required
    if (auth === false) {
        return checkPageAccessAndRedirect(auth, loginUri, "/shuffle")
    } else {
        return (
            <main>
                <Box>
                    <Box sx={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2,
                                color: "white",
                                display: "block",
                                bgcolor: "#1DB954",
                            }}
                            onClick={handleHowToModalOpen}
                        >
                            How to
                        </Button>
                    </Box>
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
