import React, { useEffect, useState } from "react";
import { Typography, Button, Box, TextField, Stack, Card, CardContent, IconButton } from "@mui/material";
import axios from "axios";
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

import { checkPageAccessAndRedirect } from "../utils/SpotifyAuthService";

const ShareLikedTracksPage = ({ isAuth, loginUri }) => {
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

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth]);

    const postCreateLikedTracksPlaylistsCall = () => {
        // Call create liked tracks playlist
        setIsLoading(true);
        axios
            .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/share/liked-tracks`,
                { playlist_name: playlistName },
                { headers: { "Content-Type": "application/json" }, withCredentials: true })
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
              axios
                  .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/share/liked-tracks/` + createLikedPlaylistTaskId, { withCredentials: true })
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

    const renderCard = (title, children, showHelpButton = false) => {
        return (
            <Card sx={{
                backgroundColor: "#181818",
                borderRadius: "5px",
                width: "100%",
                minHeight: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}>
                <CardContent sx={{ 
                    py: { xs: 1, sm: 2 }, 
                    px: { xs: 1.5, sm: 2, md: 2 },
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    height: "100%",
                    justifyContent: "flex-start"
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: 1.5,
                        paddingTop: { xs: "10px", sm: "20px" },
                        paddingBottom: { xs: "8px", sm: "16px" },
                        marginBottom: 0,
                        flexShrink: 0
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            flex: 1
                        }}>
                            <QueueMusicIcon 
                                sx={{ 
                                    color: "#1DB954", 
                                    fontSize: { xs: "28px", sm: "32px" },
                                    flexShrink: 0
                                }} 
                            />
                            <Typography 
                                variant='h4' 
                                component="div" 
                                sx={{ 
                                    color: "white",
                                    fontSize: { xs: "1.5rem", sm: "2rem" },
                                    fontWeight: 600,
                                    fontFamily: "'Questrial', sans-serif",
                                    letterSpacing: "-0.02em",
                                    margin: 0
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                        {showHelpButton && (
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
                    <Box sx={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
                        {children}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    const renderSwitch = (step) => {
        switch (step) {
            case 1:
                return (
                    <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                        {renderCard("Get Started", (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                <Typography variant='body1' component="div" sx={{ color: "lightgrey", textAlign: "center" }}>
                                    Click the button below to begin creating a playlist from your liked songs. You'll be able to customize the playlist name in the next step.
                                </Typography>
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
                            </Box>
                        ), true)}
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                        {renderCard("Creating Playlist", (
                            <>
                                {isLoading ? (
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                        <CircularProgress />
                                        <LoadingMessage message={createLikedPlaylistState === 'PROGRESS' ? createLikedPlaylistStateMessage : "Creating playlist from your liked tracks..."}/>
                                    </Box>
                                ) : (
                                    <Box sx={{ width: '100%', display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Stack spacing={2} sx={{ width: "100%", maxWidth: "500px" }}>
                                            <Typography variant='body1' component="div" sx={{ color: "lightgrey", textAlign: "center" }}>
                                                Enter a playlist name or leave as default
                                            </Typography>
                                            <TextField
                                                id="filled-basic"
                                                label="Playlist Name"
                                                variant="filled"
                                                defaultValue="My Liked Songs"
                                                onChange={handlePlaylistNameChange}
                                                inputProps={{ style: { color: "white" } }}
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: 'white'
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: 'white'
                                                    },
                                                    "& .MuiInputBase-root.Mui-disabled": {
                                                        color: "white"
                                                    }
                                                }}
                                            />
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                                            </Box>
                                        </Stack>
                                    </Box>
                                )}
                            </>
                        ), true)}
                    </Box>
                );
            case 3:
                // Create a minimal playlist object for PlaylistItem
                const createdPlaylist = {
                    id: playlistUri.split('/').pop() || 'playlist',
                    name: playlistName || "My Liked Songs",
                    images: {
                        url: "https://misc.scdn.co/liked-songs/liked-songs-300.png" // Default Spotify Liked Songs image
                    },
                    owner: {
                        display_name: "You"
                    }
                };

                return (
                    <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                        {renderCard("Playlist Created", (
                            <Box sx={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center",
                                paddingTop: { xs: "10px", sm: "20px" },
                                gap: 1,
                                width: "100%"
                            }}>
                                <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                    <PlaylistItem
                                        playlist={createdPlaylist}
                                        playlistUri={playlistUri}
                                        displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                                    />
                                </Box>
                                <Box sx={{ 
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    paddingTop: { xs: "10px", sm: "20px" },
                                    gap: 1
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
                                        variant="contained"
                                        disableElevation
                                        onClick={() => copyToClipboard()}
                                        sx={{
                                            color: 'white', 
                                            bgcolor: "#1DB954",
                                            width: "100%",
                                            maxWidth: "300px",
                                            '&:hover': {
                                                bgcolor: "#1ed760"
                                            }
                                        }}
                                        startIcon={<ContentCopyIcon />}
                                    >
                                        Copy Link
                                    </Button>
                                </Box>
                            </Box>
                        ), true)}
                    </Box>
                );
            default:
                return null;
        }
    }

    // Validate page access and redirect to Spotify login if required
    if (auth === false) {
        return checkPageAccessAndRedirect(auth, loginUri, "/share")
    } else {
        return (
            <Box sx={{ width: "90%", margin: "auto" }}>
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

                <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                    Share
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                </Box>
                
                {error && <ErrorMessage error={error} isGeneric={false} />}
                
                <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {!error && renderSwitch(step)}
                    {error && (
                        <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                            {renderCard("Error", (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                    <Typography variant='body1' component="div" sx={{ color: "lightgrey", textAlign: "center" }}>
                                        {error?.message || "Something went wrong. Please try again later."}
                                    </Typography>
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
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
                
                <HowToModal isModalOpen={isHowToModalOpen} handleClose={handleHowToModalClose} steps={HowToShareLikedTracksEntry} />
                <Footer />
            </Box>
        )
    }
};

export default ShareLikedTracksPage;
