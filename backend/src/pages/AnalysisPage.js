import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Box, Button, Card, CardContent } from "@mui/material";
import { Helmet } from "react-helmet";
import CircularProgress from "@mui/material/CircularProgress";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { checkPageAccessAndRedirect } from "../utils/SpotifyAuthService";
import { startAnalysis, getAggregateState, createErrorFromResponse, calcNewWaitTime } from "../features/analysis/services/AnalysisApiService";
import OverviewCardsCard from "../features/analysis/components/OverviewCardsCard";
import TopArtistsCard from "../features/analysis/components/TopArtistsCard";
import TopAlbumsCard from "../features/analysis/components/TopAlbumsCard";
import AudioFeaturesCard from "../features/analysis/components/AudioFeaturesCard";
import TrackLengthsCard from "../features/analysis/components/TrackLengthsCard";
import AnalysisCard from "../features/analysis/components/AnalysisCard";

const AnalysisPage = ({ isAuth, loginUri }) => {
    const [auth, setAuth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );

    const [isLoading, setIsLoading] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [aggregateTaskId, setAggregateTaskId] = useState("");
    const [aggregateState, setAggregateState] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);
    const [aggregateStateMessage, setAggregateStateMessage] = useState("");
    const [error, setError] = useState(null);
    const [aggregateStatePollingWaitTime, setAggregateStatePollingWaitTime] = useState(1000);

    const handleStartAnalysis = () => {
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

    const getAggregateDataStateCall = () => {
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
    };
    
    useEffect(() => {
        if (!isLoading || !aggregateTaskId) {
            return;
        }
        const timer = setTimeout(() => {
            getAggregateDataStateCall();
        }, aggregateStatePollingWaitTime);

        return () => clearTimeout(timer);
    }, [aggregateTaskId, aggregateStatePollingWaitTime, isLoading]);

    // Validate page access and redirect to Spotify login if required
    if (auth === false) {
        return checkPageAccessAndRedirect(auth, loginUri, "/analysis");
    } else {
        return (
            <Box sx={{ width: "90%", margin: "auto" }}>
                <Helmet>
                    <title>Analyse My Music | True Shuffle for Spotify</title>
                    <meta name="description" content="Analyze your Spotify music library with True Shuffle's and see statistics about your Liked Songs." />
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href="https://www.trueshuffle.top/analyse-my-music" />
                    <meta property="og:title" content="Analyse My Music | True Shuffle for Spotify" />
                    <meta property="og:description" content="Analyze your Spotify music library with True Shuffle's and see statistics about your Liked Songs." />
                    <meta property="og:url" content="https://www.trueshuffle.top/analyse-my-music" />
                    <meta property="og:type" content="website" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Helmet>

                <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                    Analyse My Music
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography align="center" variant='body1' component="div"
                        sx={{
                            width: { sm: '100%', md: "50%" },
                            minWidth: "200px", maxWidth: "600px", paddingTop: "10px", color: "lightgrey"
                        }}>
                        Welcome to your personal Spotify library statistics page! Here you can find a breakdown of the music you've saved, including your top artists, top albums, and more. We've analyzed your library to provide you with interesting insights about the music you enjoy.
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
                                Start Analysis
                            </Button>
                        </Box>
                        <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white", marginBottom: 1 }}>
                                What You'll See
                            </Typography>
                            <Typography align="center" variant='body1' component="div"
                                sx={{
                                    width: { sm: '100%', md: "70%" },
                                    minWidth: "200px", maxWidth: "800px", paddingBottom: "10px", color: "lightgrey"
                                }}>
                            </Typography>
                            <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                                <AnalysisCard
                                    title="Library Overview"
                                    description="Key statistics about your music library"
                                >
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-around", alignItems: "center" }}>
                                        <Card sx={{ backgroundColor: "#1DB954", borderRadius: 5, width: "100%", maxWidth: "180px", minWidth: "150px" }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <strong>Tracks</strong>
                                                </Typography>
                                                <Typography sx={{ color: "white", textAlign: "center" }} variant="h6">
                                                    <strong>—</strong>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ backgroundColor: "#1DB954", borderRadius: 5, width: "100%", maxWidth: "180px", minWidth: "150px" }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <strong>Artists</strong>
                                                </Typography>
                                                <Typography sx={{ color: "white", textAlign: "center" }} variant="h6">
                                                    <strong>—</strong>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ backgroundColor: "#1DB954", borderRadius: 5, width: "100%", maxWidth: "180px", minWidth: "150px" }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <strong>Albums</strong>
                                                </Typography>
                                                <Typography sx={{ color: "white", textAlign: "center" }} variant="h6">
                                                    <strong>—</strong>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ backgroundColor: "#1DB954", borderRadius: 5, width: "100%", maxWidth: "180px", minWidth: "150px" }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <strong>Average Length</strong>
                                                </Typography>
                                                <Typography sx={{ color: "white", textAlign: "center" }} variant="h6">
                                                    <strong>—</strong>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ backgroundColor: "#1DB954", borderRadius: 5, width: "100%", maxWidth: "180px", minWidth: "150px" }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <strong>Total Length</strong>
                                                </Typography>
                                                <Typography sx={{ color: "white", textAlign: "center" }} variant="h6">
                                                    <strong>—</strong>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </AnalysisCard>
                            </Box>
                            <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                                <AnalysisCard
                                    title="Top Artists"
                                    description="Your most listened to artists"
                                >
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
                                        <Typography variant="body1" sx={{ color: "lightgrey", fontStyle: "italic" }}>
                                            Pie chart and table showing your most common artists with play counts
                                        </Typography>
                                    </Box>
                                </AnalysisCard>
                            </Box>
                            <Box sx={{ width: "100%", maxWidth: "1200px", marginBottom: 1.5 }}>
                                <AnalysisCard
                                    title="Top Albums"
                                    description="Your most listened to albums"
                                >
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
                                        <Typography variant="body1" sx={{ color: "lightgrey", fontStyle: "italic" }}>
                                            Pie chart and table showing your most common albums with play counts
                                        </Typography>
                                    </Box>
                                </AnalysisCard>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3, marginBottom: 2 }}>
                                <Typography align="center" variant='body1' component="div"
                                    sx={{
                                        width: { sm: '100%', md: "70%" },
                                        minWidth: "200px", maxWidth: "600px", 
                                        color: "lightgrey",
                                        fontStyle: "italic"
                                    }}>
                                    And more! Track length statistics, audio features analysis, and additional insights await after you start the analysis.
                                </Typography>
                            </Box>
                        </Box>
                        <Footer />
                    </Box>
                }
                {isLoading && 
                    <Box>
                        <br/>
                        <CircularProgress />
                        <LoadingMessage message={aggregateState === 'PROGRESS' ? aggregateStateMessage : "Analysing your library. If you have many Liked Songs, this process may take longer..."}/>
                        <Footer />
                    </Box>
                }
                {!isLoading && analysisData !== null && analysisData.num_tracks === 0 && 
                    <Box>
                        <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white", textAlign: "center" }}>
                            Your library is empty. Add some music to your Liked Songs to analyse.
                        </Typography>
                        <Footer />
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
                        <Footer />
                    </Box>
                }
            </Box>
        );
    }
}

export default AnalysisPage;
