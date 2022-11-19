import React, { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import ShufflePlaylistResponse from "./ShufflePlaylistResponse";
import LoadingMessage from "./LoadingMessage";

// class ShufflePlaylistContainer extends React.Component {
const ShufflePlaylistContainer = ({ isAuth, setIsAuth }) => {
    const [playlistUri, setPlaylistUri] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);

    const useQuery = () => {
        return new URLSearchParams(window.location.search);
    }

    const getShuffleCall = () => {
        if (!(useQuery().get('playlistId') == null || useQuery().get('playlistId') === "")) {
            // Call shuffle
            axios
                .post(process.env.REACT_APP_BACKEND_PATH + `/api/playist/shuffle`,
                    {
                        isUseLikedTracks: "false",
                        playlistId: useQuery().get('playlistId'),
                        playlistName: useQuery().get('playlistName'),
                        isMakeNewPlaylist: "false",
                        spotifyAccessInfo: {
                            access_token: localStorage.getItem("accessToken"),
                            refresh_token: localStorage.getItem("refreshToken"),
                            expires_at: localStorage.getItem("expiresAt"),
                            scope: localStorage.getItem("scope"),
                            token_type: localStorage.getItem("tokenType"),
                        }
                    },
                    { headers: { "Content-Type": "application/json" } })
                .then(result => {
                    // console.log(result.data);
                    setPlaylistUri(result.data.playlistUri);
                    setIsLoading(false);
                    setIsError(false);
                })
                .catch(error => {
                    // console.log(error)
                    setIsLoading(false);
                    setIsError(error);
                });
        } else {
            setIsLoading(false);
            setIsError({ message: "No playlist selected" });
        }
    };

    useEffect(() => {
        getShuffleCall();
    }, []);

    return (
        <div className="shuffle-container">
            {isError ? (
                <ErrorMessage error={isError} />
            ) : (
                playlistUri !== "" ? (
                    <ShufflePlaylistResponse playlistUri={playlistUri} />
                ) : (
                    <div className="loading-container">
                        <CircularProgress />
                        <LoadingMessage/>
                    </div>
                )
            )}
        </div>
    )
}

export default ShufflePlaylistContainer