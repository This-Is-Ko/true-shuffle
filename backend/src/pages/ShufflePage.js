import React, { useEffect } from "react";
import { Typography, Button, Box, Modal } from "@mui/material";

import RestrictedAccessPage from './RestrictedAccessPage'
import PlaylistContainer from "../components/PlaylistContainer";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToShuffleEntry } from '../components/howToComponents/HowToEntries';

const ShufflePage = ({ isAuth }) => {
    const [auth, setAuth] = React.useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [newPlaylistUri, setNewPlaylistUri] = React.useState("");
    const [isHowToModalOpen, setIsHowToModalOpen] = React.useState(false);

    const handleHowToModalOpen = () => setIsHowToModalOpen(true);
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    const selectPlaylist = (playlistId, playlistName) => {
        setNewPlaylistUri(playlistId)
    };

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth, newPlaylistUri]);

    return (
        <main>
            {auth === true ? (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <Typography align="center" variant='body1' component="div"
                            sx={{
                                width: { sm: '90%', md: "50%" },
                                minWidth: "200px", maxWidth: "600px", paddingTop: "10px", color: "lightgrey"
                            }}>
                            Welcome to True Shuffle! Here you can select a playlist and a new playlist will be created in a truly random order. Unlike Spotifiy's algorithm there is no preference towards certain tracks so the order will be unique each time.
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
                    <PlaylistContainer selectPlaylist={selectPlaylist} />
                </Box>
            ) : newPlaylistUri !== "" ? (<h1 className={"normalTitle"}> a playlist</h1>) : <RestrictedAccessPage />
            }
        </main >
    );
};

export default ShufflePage;
