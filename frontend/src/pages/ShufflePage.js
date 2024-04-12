import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";

import RestrictedAccessPage from './RestrictedAccessPage'
import AllPlaylistsContainer from "../features/shuffle/components/PlaylistContainer";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToShuffleEntry } from '../components/howToComponents/HowToEntries';
import PAGE_STATES from "../features/shuffle/state/PageStates";
import ShufflePlaylistContainer from "../features/shuffle/components/ShufflePlaylistContainer";

const ShufflePage = ({ isAuth }) => {
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
    
    // Unauthenticated user should be directed to login
    if (auth === false) {
        return (
            <main>
                <RestrictedAccessPage />
            </main>
        )
    } else {
        return (
            <main>
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <Typography align="center" variant='body1' component="div"
                            sx={{
                                width: { sm: '90%', md: "50%" },
                                minWidth: "200px", 
                                maxWidth: "600px", 
                                paddingTop: "10px", 
                                paddingLeft: "20px", 
                                paddingRight: "20px", 
                                color: "lightgrey"
                            }}>
                            Welcome to True Shuffle! Here you can select a playlist and a new playlist will be created in a truly random order. Unlike Spotifiy's algorithm there is no preference towards certain tracks so the order will be unique each time.
                            <br />
                            <br />
                            The original playlist will remain unaltered and a new shuffled playlist will be created.
                            <br />
                            <br />
                            Note: Ensure you have disabled Spotify's built-in shuffle
                        </Typography>
                    </Box>
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
