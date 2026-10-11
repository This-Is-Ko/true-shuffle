import React, { useEffect, useState, useCallback } from "react";
import { Typography, Box, Button, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import { Helmet } from "react-helmet";
import CircularProgress from "@mui/material/CircularProgress";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToAnalyseEntry } from '../components/howToComponents/HowToEntries';
import { startAnalysis, getAggregateState, createErrorFromResponse, calcNewWaitTime } from "../features/analysis/services/AnalysisApiService";
import { CorrelationIdProvider, useCorrelationId, OPERATION_TYPES } from "../contexts/CorrelationIdContext";
import { setCorrelationIdGetter } from "../utils/apiClient";
import OverviewCardsCard from "../features/analysis/components/OverviewCardsCard";
import TopArtistsCard from "../features/analysis/components/TopArtistsCard";
import TopAlbumsCard from "../features/analysis/components/TopAlbumsCard";
import AudioFeaturesCard from "../features/analysis/components/AudioFeaturesCard";
import TrackLengthsCard from "../features/analysis/components/TrackLengthsCard";
import WhatYoullSee from "../features/analysis/components/WhatYoullSee";
import MobileBottomNav from "../features/common/MobileBottomNav";

const AnalysisPage = ({ isAuth: _isAuth, loginUri }) => {
    // Correlation ID management
    const { getCorrelationId, resetCorrelationId, resetAll } = useCorrelationId();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [auth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );

    const [isLoading, setIsLoading] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [aggregateTaskId, setAggregateTaskId] = useState("");
    const [aggregateState, setAggregateState] = useState("");
    const [, setAttemptCount] = useState(0);
    const [aggregateStateMessage, setAggregateStateMessage] = useState("");
    const [error, setError] = useState(null);
    const [aggregateStatePollingWaitTime, setAggregateStatePollingWaitTime] = useState(1000);
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);

    const handleHowToModalOpen = () => setIsHowToModalOpen(true);
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    const handleStartAnalysis = () => {
        // Prompt Spotify login (user-triggered) instead of auto-redirecting on page load
        if (auth === false && loginUri) {
            localStorage.setItem("postSpotifyAuthRedirect", "/analysis");
            window.location.href = loginUri;
            return;
        }

        // Reset correlation ID for analysis operation when starting new analysis
        resetCorrelationId(OPERATION_TYPES.ANALYSIS);

        setIsLoading(true);
        setError(null);
        setAttemptCount(0);
        setAggregateStatePollingWaitTime(1000);
        startAnalysis()
            .then(result => {
                setAggregateTaskId(result.data.aggregate_task_id);
                setError(false);
            })
            .catch((responseError) => {
                setIsLoading(false);
                setError(createErrorFromResponse(responseError));
            });
    };

    const getAggregateDataStateCall = useCallback(() => {
        if (isLoading === true && aggregateTaskId !== null && aggregateTaskId !== "") {
            getAggregateState(aggregateTaskId)
                .then(result => {
                    setAggregateState(result.data.state);
                    if (result.data.state === "SUCCESS") {
                        setIsLoading(false);
                        if (result.data.result.status === "success") {
                            setAnalysisData(result.data.result.analysis);
                            setError(false);
                        } else {
                            setError({ message: "Error while analysing your music. Please try again later" });
                        }
                    } else if (result.data.state === "PROGRESS") {
                        setAggregateStateMessage(result.data.progress.state);
                        setAttemptCount(prev => {
                            const newCount = prev + 1;
                            if (newCount >= 30) {
                                setError({ message: "Error while analysing your music. Please try again later" });
                            } else {
                                setAggregateStatePollingWaitTime(calcNewWaitTime(aggregateStatePollingWaitTime));
                            }
                            return newCount;
                        });
                    } else if (result.data.state === "FAILURE") {
                        setIsLoading(false);
                        setError({ message: "Error while analysing your music. Please try again later" });
                    } else if (result.data.state === "PENDING") {
                        setAttemptCount(prev => {
                            const newCount = prev + 1;
                            if (newCount >= 20) {
                                setError({ message: "Error while analysing your music. Please try again later" });
                            } else {
                                setAggregateStatePollingWaitTime(calcNewWaitTime(aggregateStatePollingWaitTime));
                            }
                            return newCount;
                        });
                    }
                })
                .catch((responseError) => {
                    setIsLoading(false);
                    setError(createErrorFromResponse(responseError));
                });
        } else {
            setAttemptCount(prev => {
                const newCount = prev + 1;
                if (newCount >= 20) {
                    setIsLoading(false);
                    setError({ message: "Error while analysing your music. Please try again later" });
                } else {
                    setAggregateStatePollingWaitTime(calcNewWaitTime(aggregateStatePollingWaitTime));
                }
                return newCount;
            });
        }
    }, [aggregateTaskId, aggregateStatePollingWaitTime, isLoading]);

    useEffect(() => {
        if (!isLoading || !aggregateTaskId) {
            return;
        }
        const timer = setTimeout(() => {
            getAggregateDataStateCall();
        }, aggregateStatePollingWaitTime);

        return () => clearTimeout(timer);
    }, [aggregateTaskId, aggregateStatePollingWaitTime, isLoading, getAggregateDataStateCall]);

    // Set up correlation ID getter for apiClient and reset all correlation IDs on mount
    useEffect(() => {
        // Set the correlation ID getter function for apiClient
        setCorrelationIdGetter(getCorrelationId);

        // Reset all correlation IDs on page load
        resetAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Hide the footer on mobile when the user is logged in
    const showFooter = !isMobile || !auth;
    // "How To" affordances are only shown to logged in users
    const showHowTo = Boolean(auth);
    // The fixed bottom "How To" bar only exists on mobile for logged in users
    const showMobileBar = isMobile && showHowTo;

    return (
            <Box sx={{
                width: "90%",
                margin: "auto",
                paddingBottom: showMobileBar ? "56px" : 0,
                display: "flex",
                flexDirection: "column",
                // On desktop, stretch to fill the viewport so the footer sits at the bottom
                minHeight: { xs: "auto", md: "calc(100vh - 64px)" }
            }}>
                <Helmet>
                    <title>Library Analyzer | True Shuffle for Spotify</title>
                    <meta name="description" content="Analyze your Spotify music library with True Shuffle's and see statistics about your Liked Songs." />
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href="https://www.trueshuffle.top/analyse-my-music" />
                    <meta property="og:title" content="Library Analyzer | True Shuffle for Spotify" />
                    <meta property="og:description" content="Analyze your Spotify music library with True Shuffle's and see statistics about your Liked Songs." />
                    <meta property="og:url" content="https://www.trueshuffle.top/analyse-my-music" />
                    <meta property="og:type" content="website" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Helmet>

                {/* Desktop only: inline How To button (mirrors the shuffle/share pages). */}
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

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white", fontFamily: "'Questrial', sans-serif", fontWeight: 600, letterSpacing: "-0.02em", fontSize: { xs: "2rem", sm: "2.5rem", md: "2.75rem" } }}>
                    Library Analyzer
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography align="center" variant='body1' component="div"
                        sx={{
                            width: { sm: '100%', md: "50%" },
                            minWidth: "200px", maxWidth: "600px", paddingTop: "10px", color: "lightgrey",
                            fontSize: { xs: "0.9rem", sm: "1rem" }
                        }}>
                        The Library Analyzer shows you what’s in your saved music. See your top artists, top albums, and key stats about your library, all in one place.
                    </Typography>
                </Box>
                {error !== null && error.message !== null && <ErrorMessage error={error} isGeneric={false} />}
                {isLoading === null && analysisData === null &&
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                disableElevation
                                startIcon={<AnalyticsIcon />}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    bgcolor: "#1DB954",
                                }}
                                onClick={handleStartAnalysis}
                            >
                                Start analysis
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
                            <WhatYoullSee />
                        </Box>
                    </Box>
                }
                {isLoading &&
                    <Box>
                        <br/>
                        <CircularProgress />
                        <LoadingMessage message={aggregateState === 'PROGRESS' ? aggregateStateMessage : "Analysing your library. If you have many Liked Songs, this process may take longer..."}/>
                    </Box>
                }
                {!isLoading && analysisData !== null && analysisData.num_tracks === 0 &&
                    <Box>
                        <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white", textAlign: "center" }}>
                            Your library is empty. Add some music to your Liked Songs to analyse.
                        </Typography>
                    </Box>
                }
                {!isLoading && analysisData !== null && analysisData.num_tracks > 0 &&
                    <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                            <OverviewCardsCard analysisData={analysisData} />
                        </Box>
                        <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                            <TopArtistsCard mostCommonArtists={analysisData.most_common_artists} />
                        </Box>
                        <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                            <TopAlbumsCard mostCommonAlbums={analysisData.most_common_albums} />
                        </Box>
                        <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                            <TrackLengthsCard
                                shortestTracks={analysisData.shortest_tracks}
                                longestTracks={analysisData.longest_tracks}
                            />
                        </Box>
                        <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                            <AudioFeaturesCard audioFeatures={analysisData.audio_features} />
                        </Box>
                    </Box>
                }
                </Box>

                <HowToModal isModalOpen={isHowToModalOpen} handleClose={handleHowToModalClose} steps={HowToAnalyseEntry} />
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
}

// Wrap component with CorrelationIdProvider
const AnalysisPageWithProvider = (props) => {
    return (
        <CorrelationIdProvider>
            <AnalysisPage {...props} />
        </CorrelationIdProvider>
    );
};

export default AnalysisPageWithProvider;
