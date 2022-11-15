import React, { useEffect } from "react";
import {Route, Routes} from "react-router-dom";
import Button from "@mui/material/Button";
import PlaylistContainer from "../components/PlaylistContainer";
import axios from "axios";

const SPOTIFY_AUTH_URI = process.env.REACT_APP_SPOTIFY_AUTH_URI;

const NewShufflePage = ({ isAuth, setIsAuth }) => {
    const [auth, setAuth] = React.useState(
        localStorage.getItem("accessToken") != null
    );
    const [newPlaylistUri, setNewPlaylistUri] = React.useState("");

    function useQuery() {
        return new URLSearchParams(window.location.search);
    }

    const selectPlaylist = (playlistId, playlistName) => {
        console.log("clicked playlist " + playlistId + " " + playlistName);
        setNewPlaylistUri(playlistId)
    };

    useEffect(() => {
        setAuth(localStorage.getItem("accessToken") != null);
    }, [isAuth, newPlaylistUri]);

    return (
        <>
            <main>
                {auth==true ? (
                    <div>
                        <h1 className={"normalTitle"}>Select a playlist</h1>
                        <PlaylistContainer selectPlaylist={selectPlaylist} />
                    </div>
                ) : newPlaylistUri !== "" ? (<h1 className={"normalTitle"}> a playlist</h1>) : (
                    <div>
                        <h1 className={"normalTitle"}>
                            Login to your spotify account to continue
                        </h1>
                        <div className={"centerSpacingContainer"}>
                            <Button
                                className={"normalButton"}
                                variant="contained"
                                disableElevation
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                    bgcolor: "#1DB954",
                                    "&:hover": { backgroundColor: "#1DB954" },
                                }}
                                href={SPOTIFY_AUTH_URI}
                            >
                                Get started
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default NewShufflePage;
