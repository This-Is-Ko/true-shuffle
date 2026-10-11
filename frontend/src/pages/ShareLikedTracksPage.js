import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Stack, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import apiClient from "../utils/apiClient";
import { OPERATION_TYPES } from "../contexts/CorrelationIdContext";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToShareLikedTracksEntry } from '../components/howToComponents/HowToEntries';
import ShareIcon from '@mui/icons-material/Share';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import PlaylistItem from "../features/shuffle/components/PlaylistItem";
import PLAYLIST_ITEM_DISPLAY_STATES from "../features/shuffle/state/PlaylistItemDisplayStates";
import { ERROR_MESSAGES } from "../features/shuffle/constants/ShuffleConstants";
import ShareHero from "../features/share/components/ShareHero";
import MobileBottomNav from "../features/common/MobileBottomNav";

import { CorrelationIdProvider, useCorrelationId } from "../contexts/CorrelationIdContext";
import { setCorrelationIdGetter } from "../utils/apiClient";

const ShareLikedTracksPage = ({ isAuth, loginUri }) => {
    // Correlation ID management
    const { getCorrelationId, resetCorrelationId, resetAll } = useCorrelationId();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [auth, setAuth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [step, setStep] = useState(1);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistUri, setPlaylistUri] = useState("");
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
    
    const [createLikedPlaylistTaskId, setCreateLikedPlaylistTaskId] = useState("");
    const [createLikedPlaylistState, setCreateLikedPlaylistState] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);
    const [createLikedPlaylistStateMessage, setCreateLikedPlaylistStateMessage] = useState("");
    const [polling, setPolling] = useState(true);

    const handleHowToModalOpen = () => setIsHowToModalOpen(true);
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    const POLLING_INTERVAL = 2500;
    // Height of the fixed mobile "How To" bar (MUI BottomNavigation height).
    const BOTTOM_BAR_HEIGHT = 56;

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth]);

    // Set up correlation ID getter for apiClient and reset all correlation IDs on mount
    useEffect(() => {
        // Set the correlation ID getter function for apiClient
        setCorrelationIdGetter(getCorrelationId);
        
        // Reset all correlation IDs on page load
        resetAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const postCreateLikedTracksPlaylistsCall = () => {
        // Reset correlation ID for share operation when starting new share
        resetCorrelationId(OPERATION_TYPES.SHARE);
        
        // Call create liked tracks playlist
        setIsLoading(true);
        apiClient
            .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/share/liked-tracks`,
                { playlist_name: playlistName },
                { 
                    headers: { "Content-Type": "application/json" },
                    operationType: OPERATION_TYPES.SHARE
                })
            .then(result => {
                setCreateLikedPlaylistTaskId(result.data.create_liked_playlist_id);
                setError(false);
            })
            .catch((responseError) => {
                setIsLoading(false);
                if (responseError && responseError.response && responseError.response.status === 401) {
                    setError({ message: "Unable to authenticate your account, please logout and try again" });
                } else {
                    setError({ message: "Unable to connect to Spotify, please try again later" });
                }
            });
    }
    

    useEffect(() => {
      // Only start polling if it's active (polling state is true)
      if (!polling || !createLikedPlaylistTaskId) return;

      const getCreateLikedTracksPlaylistsStateCall = () => {
          if (isLoading === true && createLikedPlaylistTaskId !== null && createLikedPlaylistTaskId !== "") {
              apiClient
                  .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/share/liked-tracks/` + createLikedPlaylistTaskId, { operationType: OPERATION_TYPES.SHARE })
                  .then(result => {
                      setCreateLikedPlaylistState(result.data.state);
                      if (result.data.state === "SUCCESS") {
                          setIsLoading(false);
                          if (result.data.result.status === "success") {
                              setPlaylistUri(result.data.result.playlist_uri);
                              setError(false);
                              setPolling(false);
                              setStep(3);
                          } else {
                              setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                          }
                      } else if (result.data.state === "PROGRESS") {
                          setCreateLikedPlaylistStateMessage(result.data.progress.state);
                          if (attemptCount >= 40) {
                              setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                              setPolling(false);
                          }
                      } else if (result.data.state === "FAILURE") {
                          setIsLoading(false);
                          setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                          setPolling(false);
                      } else if (result.data.state === "PENDING") {
                          setAttemptCount(attemptCount + 1);
                          if (attemptCount >= 20) {
                              setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                              setPolling(false);
                          }
                      }
                  })
                  .catch((responseError) => {
                      setIsLoading(false);
                      if (responseError && responseError.response && responseError.response.status === 401) {
                          setError({ message: "Unable to authenticate your account, please logout and try again" });
                      } else {
                          setError({ message: "Unable to connect to Spotify, please try again later" });
                      }
                  });
          } else {
              setAttemptCount(attemptCount + 1);
              if (attemptCount >= 20) {
                  setIsLoading(false);
                  setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
              }
          }
      };

      const interval = setInterval(() => {
          getCreateLikedTracksPlaylistsStateCall();
        }, POLLING_INTERVAL);

      // Clean up interval on component unmount or when polling stops
      return () => clearInterval(interval);
  }, [createLikedPlaylistTaskId, polling, isLoading, attemptCount]);
  

    const copyToClipboard = () => {
        if (playlistUri !== "") {
            navigator.clipboard.writeText(playlistUri);
            alert("Link copied to clipboard");
        }
    }

    const handlePlaylistNameChange = (e) => {
        setPlaylistName(e.target.value);
    };

    const handleNext = () => {
        // Prompt Spotify login (user-triggered) instead of auto-redirecting on page load
        if (auth === false && loginUri) {
            localStorage.setItem("postSpotifyAuthRedirect", "/share");
            window.location.href = loginUri;
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setStep(2);
        setIsLoading(true);
        postCreateLikedTracksPlaylistsCall();
    };

    const handleRetry = async () => {
        setStep(1);
        setError(false);
        setIsLoading(false);
    };

    const renderError = () => {
        return (
            <ShareHero
                icon={<QueueMusicIcon sx={{ color: "#1DB954", fontSize: "36px" }} />}
                title="Something went wrong"
                description={error?.message || "Something went wrong. Please try again later."}
            >
                <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        my: 2,
                        color: "white",
                        bgcolor: "#1DB954",
                    }}
                    onClick={handleRetry}
                >
                    Retry
                </Button>
            </ShareHero>
        );
    };

    // Minimal playlist object used to render the created playlist item
    const getCreatedPlaylist = () => ({
        id: (playlistUri && playlistUri.split('/').pop()) || 'playlist',
        name: playlistName || "My Liked Songs",
        images: {
            url: "https://misc.scdn.co/liked-songs/liked-songs-300.png" // Default Spotify Liked Songs image
        },
        owner: {
            display_name: "You"
        }
    });

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <ShareHero
                        icon={<ShareIcon sx={{ color: "#1DB954", fontSize: "36px" }} />}
                        title="Share your liked songs"
                        description="Create a playlist from your liked songs. You'll be able to customize the playlist name in the next step."
                    >
                        <Button
                            variant="contained"
                            disableElevation
                            startIcon={<ShareIcon />}
                            sx={{
                                my: 2,
                                color: "white",
                                bgcolor: "#1DB954",
                            }}
                            onClick={handleNext}
                        >
                            Start
                        </Button>
                    </ShareHero>
                );
            case 2:
                // Once creation has started, drop the badge and show the playlist item
                if (isLoading) {
                    return (
                        <ShareHero>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: "100%" }}>
                                <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: "200px" }, display: "flex", justifyContent: "center" }}>
                                    <PlaylistItem
                                        playlist={getCreatedPlaylist()}
                                        displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING}
                                    />
                                </Box>
                                <CircularProgress />
                                <LoadingMessage message={createLikedPlaylistState === 'PROGRESS' ? createLikedPlaylistStateMessage : "Creating playlist from your liked tracks..."}/>
                            </Box>
                        </ShareHero>
                    );
                }
                return (
                    <ShareHero
                        icon={<QueueMusicIcon sx={{ color: "#1DB954", fontSize: "36px" }} />}
                        title="Create your playlist"
                        description="Enter a playlist name or leave as default."
                    >
                        <Stack spacing={1.5} sx={{ width: "100%", maxWidth: "320px" }}>
                            <Typography
                                variant="caption"
                                component="label"
                                htmlFor="playlist-name"
                                sx={{ color: "lightgrey", textAlign: "center", letterSpacing: "0.02em" }}
                            >
                                Playlist Name
                            </Typography>
                            <TextField
                                id="playlist-name"
                                variant="filled"
                                fullWidth
                                defaultValue="My Liked Songs"
                                onChange={handlePlaylistNameChange}
                                inputProps={{ style: { color: "white", textAlign: "center", padding: "8px 12px" } }}
                                sx={{
                                    "& .MuiFilledInput-root": {
                                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                                        borderRadius: "8px",
                                        "&:before, &:after": {
                                            borderBottom: "none"
                                        },
                                        "&:hover:not(.Mui-disabled, .Mui-error):before": {
                                            borderBottom: "none"
                                        }
                                    },
                                    "& .MuiInputBase-root.Mui-disabled": {
                                        color: "white"
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                    my: 1,
                                    color: "white",
                                    bgcolor: "#1DB954",
                                }}
                                onClick={handleSubmit}
                            >
                                Create
                            </Button>
                        </Stack>
                    </ShareHero>
                );
            case 3:
                return (
                    <ShareHero>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: { xs: 1, sm: 2 } }}>
                            <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: "200px" }, display: "flex", justifyContent: "center" }}>
                                <PlaylistItem
                                    playlist={getCreatedPlaylist()}
                                    playlistUri={playlistUri}
                                    displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                                />
                            </Box>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1,
                                width: "100%",
                                paddingTop: { xs: "10px", sm: "20px" }
                            }}>
                                {playlistUri && (
                                    <Button
                                        variant="contained"
                                        href={playlistUri}
                                        target="_blank"
                                        sx={{
                                            color: 'white', 
                                            bgcolor: "#1DB954",
                                            width: "100%",
                                            maxWidth: "300px",
                                            '&:hover': {
                                                bgcolor: "#1ed760"
                                            }
                                        }}
                                        startIcon={<AudiotrackIcon />}
                                    >
                                        Open
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    disableElevation
                                    onClick={() => copyToClipboard()}
                                    sx={{
                                        color: "#1DB954",
                                        borderColor: "#1DB954",
                                        width: "100%",
                                        maxWidth: "300px",
                                        '&:hover': {
                                            borderColor: "#1ed760",
                                            bgcolor: "rgba(29, 185, 84, 0.1)"
                                        }
                                    }}
                                    startIcon={<ContentCopyIcon />}
                                >
                                    Copy Link
                                </Button>
                                <Typography 
                                    variant='subtitle1'
                                    component="div"
                                    sx={{
                                        paddingTop: "10px",
                                        color: "white",
                                        textAlign: "center"
                                    }}
                                >
                                    Your new playlist is ready in Spotify.
                                </Typography>
                            </Box>
                        </Box>
                    </ShareHero>
                );
            default:
                return null;
        }
    }

    // Full-screen backdrop for critical Spotify connection errors
    const isConnectionError = Boolean(error) && error.message === ERROR_MESSAGES.CONNECTION_FAILED;

    // "How To" affordances are only shown to logged in users
    const showHowTo = Boolean(auth);
    // The fixed bottom "How To" bar only exists on mobile for logged in users
    const showMobileBar = isMobile && showHowTo;
    // On mobile, hide the footer when logged in to keep the share screen focused
    const showFooter = !isMobile || !auth;

    return (
        <Box sx={{
            width: "90%",
            margin: "auto",
            paddingBottom: showMobileBar ? `${BOTTOM_BAR_HEIGHT}px` : 0,
            display: "flex",
            flexDirection: "column",
            minHeight: showMobileBar
                ? {
                    xs: `calc(100vh - 56px - ${BOTTOM_BAR_HEIGHT}px)`,
                    sm: `calc(100vh - 64px - ${BOTTOM_BAR_HEIGHT}px)`,
                    md: "calc(100vh - 64px)"
                }
                : {
                    xs: "calc(100vh - 56px)",
                    sm: "calc(100vh - 64px)",
                    md: "calc(100vh - 64px)"
                }
        }}>
            <Helmet>
                <title>Share Liked Songs | True Shuffle for Spotify</title>
                <meta name="description" content="Share your liked songs from Spotify with True Shuffle." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.trueshuffle.top/share-liked-songs" />
                <meta property="og:title" content="Share Liked Songs | True Shuffle for Spotify" />
                <meta property="og:description" content="Share your liked songs from Spotify with True Shuffle." />
                <meta property="og:url" content="https://www.trueshuffle.top/share-liked-songs" />
                <meta property="og:type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            {/* Desktop only: inline How To button (mirrors the shuffle page). */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", paddingTop: "10px" }}>
                {!isMobile && showHowTo && (
                    <IconButton
                        onClick={handleHowToModalOpen}
                        sx={{
                            color: "#1DB954",
                            '&:hover': {
                                color: "#1ed760",
                                bgcolor: 'rgba(29, 185, 84, 0.1)'
                            },
                            padding: { xs: "8px", sm: "10px" }
                        }}
                        aria-label="How to use"
                    >
                        <HelpOutlineIcon sx={{ fontSize: { xs: "24px", sm: "28px" } }} />
                    </IconButton>
                )}
            </Box>

            {isConnectionError && <ErrorMessage error={error} isGeneric={false} />}

            <Box sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                paddingBottom: "20px"
            }}>
                {error ? renderError() : renderStep()}
            </Box>

            <HowToModal isModalOpen={isHowToModalOpen} handleClose={handleHowToModalClose} steps={HowToShareLikedTracksEntry} />
            {showMobileBar && (
                <MobileBottomNav
                    value={null}
                    onChange={handleHowToModalOpen}
                    items={[{ label: "How To", value: "howto", icon: <HelpOutlineIcon /> }]}
                />
            )}
            {showFooter && <Footer />}
        </Box>
    );
};

// Wrap component with CorrelationIdProvider
const ShareLikedTracksPageWithProvider = (props) => {
    return (
        <CorrelationIdProvider>
            <ShareLikedTracksPage {...props} />
        </CorrelationIdProvider>
    );
};

export default ShareLikedTracksPageWithProvider;
