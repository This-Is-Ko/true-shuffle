import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

import PlaylistList from "./PlaylistList";
import ErrorMessage from "../../../components/ErrorMessage";
import UserShuffleCounterContainer from "./UserShuffleCounterContainer";
import RecentShufflesTable from "./RecentShufflesTable";

const AllPlaylistsContainer = ({ selectPlaylist, setSelectedPlaylist }) => {
    const [playlists, setPlaylists] = useState([]);
    const [userShuffleCounter, setUserShuffleCounter] = useState(false);
    const [recentShuffles, setRecentShuffles] = useState([]);
    const [error, setError] = useState(false);

    const getPlaylistsCall = () => {
        axios
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/me?include-stats=true`, { withCredentials: true })
            .then((result) => {
                setPlaylists(result.data.all_playlists);
                if ("user_shuffle_counter" in result.data) {
                    setUserShuffleCounter(result.data.user_shuffle_counter);
                }
                setError(false);
            })
            .catch((responseError) => {
                if (responseError && responseError.response && responseError.response.status === 401) {
                    setError({ message: "Unable to authenticate your account, please logout and try again" });
                } else {
                    setError({ message: "Unable to connect to Spotify, please try again later" });
                }
            });
    };

    const getRecentShuffles = () => {
      axios
          .get(process.env.REACT_APP_BACKEND_PATH + `/api/user/shuffle/recent`, { withCredentials: true })
          .then((result) => {
              if (result.data != null && result.data.recent_shuffles != null) {
                  setRecentShuffles(result.data.recent_shuffles);
              }
          })
          .catch(() => {
              console.error("Failed to fetch recent shuffles");
          });
  };

    useEffect(() => {
        getPlaylistsCall();
        getRecentShuffles();
    }, []);

    return (
        <Box sx={{ paddingBottom: "10px" }}>
            {error !== false ? (
                <ErrorMessage error={error} isGeneric={false} />
            ) : playlists.length > 0 ? (
                <Box>
                    {userShuffleCounter !== false && 
                        <UserShuffleCounterContainer userShuffleCounter={userShuffleCounter} />
                    }
                    {recentShuffles.length > 0 &&
                         <RecentShufflesTable recentShuffles={recentShuffles} />
                    }
                    <Typography variant='h4' component="div" sx={{ paddingTop: "30px", color: "white" }}>Select a playlist</Typography>
                    <PlaylistList playlists={playlists} selectPlaylist={selectPlaylist} setSelectedPlaylist={setSelectedPlaylist} />
                </Box>
            ) : (
                <Box>
                    <Typography variant='h4' component="div" sx={{ paddingTop: "30px", color: "white" }}>Select a playlist</Typography>
                    <PlaylistList loading={true} />
                </Box>
            )}
        </Box>
    );
};

export default AllPlaylistsContainer;
