import React, { useEffect, useState, useRef } from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Grid from '@mui/material/Grid';
import MediaQuery from 'react-responsive'

import RestrictedAccessPage from './RestrictedAccessPage'
import Footer from "../components/Footer";
import Pie from "../components/dataVisualisers/Pie"
import MostCommonTable from "../components/dataVisualisers/MostCommonTable"
import AudioFeaturesRadar from "../components/dataVisualisers/AudioFeaturesRadar"
import { transformMostCommonArtists, transformMostCommonAlbums, transformAudioFeatureData } from "../utils/StatisticsService";
import ErrorMessage from "../components/ErrorMessage";
import OverallStatsContainer from "../components/analysisPageComponents/OverallStatsContainer";
import FeatureScoreContainer from "../components/analysisPageComponents/FeatureScoreContainer";
import FeatureScoreDetailedContainer from "../components/analysisPageComponents/FeatureScoreDetailedContainer";
import TrackLengthContainer from "../components/analysisPageComponents/TrackLengthContainer";
import TrackLengthTable from "../components/dataVisualisers/TrackLengthTable";
import LikedTracksHistoryGraph from "../components/dataVisualisers/LikedTracksHistoryGraph";
import ReleaseYearGraph from "../components/dataVisualisers/ReleaseYearGraph";
import LoadingMessage from "../components/LoadingMessage";

const AnalysisPage = ({ isAuth }) => {
    const [auth, setAuth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );

    const [loading, setLoading] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [likedTracksTrackerData, setLikedTracksTrackerData] = useState([]);
    const [aggregateTaskId, setAggregateTaskId] = useState("");
    const [aggregateState, setAggregateState] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);
    const [aggregateStateMessage, setAggregateStateMessage] = useState("");
    const [error, setError] = useState(null);

    const [featureShowMoreDetails, setFeatureShowMoreDetails] = useState(false);

    const handleStartAnalysis = () => {
        setLoading(true);
        setError(null);
        axios
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/user/aggregate`, { withCredentials: true })
            .then(result => {
                setAggregateTaskId(result.data.aggregate_task_id);
                setError(false);
            })
            .catch((responseError) => {
                setLoading(false);
                setError(error.message);
                if (responseError && responseError.response && responseError.response.status === 401) {
                    setError({ message: "Unable to authenticate your account, please logout and try again" });
                } else {
                    setError({ message: "Unable to connect to Spotify, please try again later" });
                }
            });
    };

    const getAggregateDataStateCall = () => {
        if (aggregateTaskId !== null && aggregateTaskId !== "") {
            axios
                .get(process.env.REACT_APP_BACKEND_PATH + `/api/user/aggregate/state/` + aggregateTaskId, { withCredentials: true })
                .then(result => {
                    setAggregateState(result.data.state);
                    if (result.data.state === "SUCCESS") {
                        setLoading(false);
                        clearInterval(intervalRef.current);
                        if (result.data.result.status === "success") {
                            setAnalysisData(result.data.result.analysis)
                            setLikedTracksTrackerData(result.data.result.track_liked_tracks.data)
                            setError(false);
                        } else {
                            setError({ message: "Error while analysing your music. Please try again later" });
                        }
                    } else if (result.data.state === "PROGRESS") {
                        setAggregateStateMessage(result.data.progress.state);
                    } else if (result.data.state === "FAILURE") {
                        setLoading(false);
                        clearInterval(intervalRef.current);
                        setError({ message: "Error while analysing your music. Please try again later" });
                    } else if (result.data.state === "PENDING") {
                        setAttemptCount(attemptCount + 1);
                        if (attemptCount >= 20) {
                            clearInterval(intervalRef.current);
                            setError({ message: "Error while analysing your music. Please try again later" });
                        }
                    }
                    
                })
                .catch((responseError) => {
                    setLoading(false);
                    if (responseError && responseError.response && responseError.response.status === 401) {
                        setError({ message: "Unable to authenticate your account, please logout and try again" });
                    } else {
                        setError({ message: "Unable to connect to Spotify, please try again later" });
                    }
                });
        } else {
            setAttemptCount(attemptCount + 1);
            if (attemptCount >= 20) {
                setLoading(false);
                clearInterval(intervalRef.current);
                setError({ message: "Error while analysing your music. Please try again later" });
            }
        }
    };

    const intervalRef = useRef(null);
    const shuffleStatePollingRate = process.env.REACT_APP_SHUFFLE_STATE_POLLING_RATE_MILLISECONDS !== null ? process.env.REACT_APP_SHUFFLE_STATE_POLLING_RATE_MILLISECONDS : 2000;

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            getAggregateDataStateCall();
        }, shuffleStatePollingRate);

        return () => clearInterval(intervalRef.current);
    }, [aggregateTaskId, attemptCount]);

    if (auth === false) {
        return <RestrictedAccessPage />
    }

    return (
        <Box sx={{ width: "90%", margin: "auto" }}>
            <Helmet>
                <title>Analyse My Music | True Shuffle for Spotify</title>
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
                    Welcome to your personal Spotify library statistics page! Here, you can find a breakdown of the music you've saved, including your top artists, top albums, and more. We've analyzed your library to provide you with interesting insights about the music you enjoy.
                    <br />
                    The Spotify library count tracker is enabled when you first login. The tracker is updated weekly so check back frequently to see how your library grows.
                </Typography>
            </Box>
            {error !== null && error.message !== null && <ErrorMessage error={error} isGeneric={false} />}
            {loading === null && analysisData === null && 
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2,
                                color: "white",
                                display: "block",
                                bgcolor: "#1DB954",
                            }}
                            onClick={handleStartAnalysis}
                        >
                            Start Analysis
                        </Button>
                    </Box>
                    <img
                        className="imgBlurPreview"
                        src={process.env.PUBLIC_URL + '/assets/images/analysis-preview.png'}
                        alt={"preview analysis"}
                    />
                </Box>
            }
            {loading && 
                <div>
                    <br/>
                    <CircularProgress />
                    <LoadingMessage message={aggregateState === 'PROGRESS' ? aggregateStateMessage : "Analysing your library. If you have many Liked Songs, this process may take longer..."}/>
                </div>
            }
            {!loading && analysisData !== null && analysisData.num_tracks === 0 && 
                <Box>
                    <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white", textAlign: "center" }}>
                        Your library is empty. Add some music to your Liked Songs to analyse.
                    </Typography>
                </Box>
            }
            {!loading && analysisData !== null && 
                <Box>
                    <Box>
                        <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                            Overall Statistics
                        </Typography>
                        <OverallStatsContainer analysisData={analysisData} />
                        <Grid
                            sx={{ margin: "0 auto" }}
                            className="contentHolder"
                            container
                            justifyContent="center"
                            alignItems="flex-start"
                        >
                            <Grid item sx={{
                                width: "100%"
                            }}>
                                <Box >
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Top 10 Artists Breakdown
                                    </Typography>
                                    <Box sx={{
                                        height: { xs: "350px", sm: '300px', md: "500px" },
                                    }}>
                                        <MediaQuery maxWidth={600}>
                                            <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey" }}>
                                                Click each section to reveal artist
                                            </Typography>
                                            <Pie data={transformMostCommonArtists(analysisData.most_common_artists, 0, 10)} sideMargin={30} topMargin={10} labelDiagonalLength={16} labelStraightLength={0} enableArcLinkLabels={false} enableLegend={false} />
                                        </MediaQuery>
                                        <MediaQuery minWidth={600}>
                                            <Pie data={transformMostCommonArtists(analysisData.most_common_artists, 0, 10)} sideMargin={80} topMargin={40} labelDiagonalLength={24} labelStraightLength={16} />
                                        </MediaQuery>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sx={{
                                width: "100%"
                            }}>
                                <Box>
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Top 10 Albums Breakdown
                                    </Typography>
                                    <Box sx={{
                                        height: { xs: "350px", sm: '300px', md: "500px" },
                                    }}>
                                        <MediaQuery maxWidth={600}>
                                            <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey" }}>
                                                Click each section to reveal album
                                            </Typography>
                                            <Pie data={transformMostCommonAlbums(analysisData.most_common_albums, 0, 10)} sideMargin={30} topMargin={10} labelDiagonalLength={16} labelStraightLength={0} enableArcLinkLabels={false} enableLegend={false} />
                                        </MediaQuery>
                                        <MediaQuery minWidth={600}>
                                            <Pie data={transformMostCommonAlbums(analysisData.most_common_albums, 0, 10)} sideMargin={80} topMargin={40} labelDiagonalLength={24} labelStraightLength={16} />
                                        </MediaQuery>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sx={{
                                width: { xs: "100%", sm: '100%', md: "50%", lg: "50%", xl: "50%" },
                            }}>
                                <Box>
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Top Artists
                                    </Typography>
                                    <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey", paddingBottom: "10px" }}>
                                        Click on an artist to go to their's Spotify page
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <MostCommonTable data={analysisData.most_common_artists} type="Artist" />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sx={{
                                width: { xs: "100%", sm: '100%', md: "50%", lg: "50%", xl: "50%" },
                            }}>
                                <Box>
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Top Albums
                                    </Typography>
                                    <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey", paddingBottom: "10px" }}>
                                        Click on an album to go to it's Spotify page
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <MostCommonTable data={analysisData.most_common_albums} type="Album" />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sx={{ width: "90%" }}>
                                <Box>
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Track Length
                                    </Typography>
                                    <TrackLengthContainer shortestTracks={analysisData.shortest_tracks} longestTracks={analysisData.longest_tracks}></TrackLengthContainer>
                                </Box>
                            </Grid>
                            <Grid item sx={{
                                width: { xs: "100%", sm: '100%', md: "50%", lg: "50%", xl: "50%" },
                            }}>
                                <Box>
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Shortest Tracks
                                    </Typography>
                                    <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey", paddingBottom: "10px" }}>
                                        Click on a track to go to it's Spotify page
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <TrackLengthTable data={analysisData.shortest_tracks} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sx={{
                                width: { xs: "100%", sm: '100%', md: "50%", lg: "50%", xl: "50%" },
                            }}>
                                <Box>
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Longest Tracks
                                    </Typography>
                                    <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey", paddingBottom: "10px" }}>
                                        Click on a track to go to it's Spotify page
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <TrackLengthTable data={analysisData.longest_tracks} />
                                    </Box>
                                </Box>
                            </Grid>
                            {/* {analysisData.release_year_counts && 
                                <Grid item sx={{
                                    width: { xs: "90%", sm: '90%', md: "80%", lg: "80%", xl: "75%" },
                                }}>
                                    <Box>
                                        <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                            Release Years
                                        </Typography>
                                        <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey", paddingBottom: "10px" }}>
                                            Distribution of track release years
                                        </Typography>
                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <ReleaseYearGraph data={analysisData.release_year_counts} />
                                        </Box>
                                    </Box>
                                </Grid>
                            }    */}
                            <Grid item sx={{ width: "90%" }}>
                                <Box>
                                    <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                        Audio Features
                                    </Typography>
                                    <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey", paddingTop: "5px" }}>
                                        Based on Spotify's audio features, these are the average rankings of your library.
                                    </Typography>
                                    <Box sx={{
                                        height: { xs: "250px", sm: '300px', md: "500px" },
                                    }}>
                                        <MediaQuery maxWidth={600}>
                                            <AudioFeaturesRadar data={transformAudioFeatureData(analysisData.audio_features)} sideMargin={80} topMargin={30} gridLabelOffset={7} />
                                        </MediaQuery>
                                        <MediaQuery minWidth={600}>
                                            <AudioFeaturesRadar data={transformAudioFeatureData(analysisData.audio_features)} sideMargin={80} topMargin={50} gridLabelOffset={36} />
                                        </MediaQuery>
                                    </Box>
                                    <Box>
                                        {
                                            featureShowMoreDetails && 
                                            <FeatureScoreDetailedContainer audioFeatures={analysisData.audio_features}></FeatureScoreDetailedContainer>
                                        }
                                    </Box>
                                    <Box>
                                        <FeatureScoreContainer audioFeatures={analysisData.audio_features}></FeatureScoreContainer>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box>
                            <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                Liked Songs Tracker
                            </Typography>
                            <Typography variant='subtitle2' component="div" sx={{ color: "lightgrey", paddingTop: "5px" }}>
                                Only shows statistics after tracking was enabled on True Shuffle
                            </Typography>
                            {
                                likedTracksTrackerData.length > 0 ?
                                    (<Box><Typography variant='subtitle2' component="div" sx={{ color: "lightgrey" }}>
                                        Our liked tracks history is updated once a week so if you don't see many data points, come back in a few weeks to see more data.
                                    </Typography>
                                        <Paper sx={{ height: "500px", backgroundColor: "#b9b9b9" }}>
                                            <LikedTracksHistoryGraph data={likedTracksTrackerData} />
                                        </Paper>
                                    </Box>)
                                    :
                                    (<Typography variant='subtitle2' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                        <strong>Not enough data to generate tracker data. Our liked tracks history is updated at the start of each week.</strong>
                                    </Typography>)
                            }
                        </Box>
                    </Box>
                    <Footer></Footer>
                </Box>
            }
        </Box >
    );
}

export default AnalysisPage;
