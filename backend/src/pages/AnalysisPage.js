import React, { useEffect } from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Grid from '@mui/material/Grid';
import MediaQuery from 'react-responsive'

import RestrictedAccessPage from './RestrictedAccessPage'
import Footer from "../components/Footer";

import Pie from "../components/dataVisualisers/Pie"
import MostCommonTable from "../components/dataVisualisers/MostCommonList"
import AudioFeaturesRadar from "../components/dataVisualisers/AudioFeaturesRadar"
import { transformMostCommonArtists, transformMostCommonAlbums, transformTrackerData, transformAudioFeatureData } from "../utils/StatisticsService";
import ErrorMessage from "../components/ErrorMessage";
import OverallStatsContainer from "../components/analysisPageComponents/OverallStatsContainer";
import LineGraphApex from "../components/dataVisualisers/LineGraphApex";
import FeatureScoreContainer from "../components/analysisPageComponents/FeatureScoreContainer";
import FeatureScoreDetailedContainer from "../components/analysisPageComponents/FeatureScoreDetailedContainer";
import TrackLengthContainer from "../components/analysisPageComponents/TrackLengthContainer";

const AnalysisPage = ({ isAuth }) => {
    const [auth, setAuth] = React.useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );

    const [startAnalysis, setStartAnalysis] = React.useState(false);
    const [analysisData, setAnalysisData] = React.useState({});
    const [likedTracksTrackerData, setLikedTracksTrackerData] = React.useState([]);
    const [isUserAggregateLoading, setIsUserAggregateLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [featureShowMoreDetails, setFeatureShowMoreDetails] = React.useState(false);

    const getUserAggregatedData = () => {
        axios
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/user/aggregate`, { withCredentials: true })
            .then((result) => {
                setAnalysisData(result.data.analysis)
                setLikedTracksTrackerData(result.data.track_liked_tracks.data)
                setIsUserAggregateLoading(false);
                setError(false);
            })
            .catch((responseError) => {
                setStartAnalysis(false)
                if (responseError.response.status === 401) {
                    setError({ message: "Unable to authenticate your account, please logout and try again" });
                } else {
                    setError({ message: "Unable to connect to Spotify, please try again later" });
                }
            });
    };

    useEffect(() => {
        // setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
        if (startAnalysis) {
            getUserAggregatedData();
        }
    }, [startAnalysis, error]);

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
            {
                error !== false || analysisData == null ? (
                    <ErrorMessage error={error} isGeneric={false} />
                ) :
                    !startAnalysis ? (
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
                                    onClick={() => setStartAnalysis(true)}
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
                    ) : isUserAggregateLoading ? (
                        <div>
                            <br/>
                            <Typography variant='body1' component="div" sx={{ color: "white", paddingBottom: "10px" }}>
                                Analysing your library. If you have many Liked Songs, this process may take longer...
                            </Typography>
                            <CircularProgress />
                        </div>
                    ) : analysisData.num_tracks === 0 ? (
                        <Box>
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white", textAlign: "center" }}>
                                Your library is empty. Add some music to your Liked Songs to analyse.
                            </Typography>
                        </Box>
                    ) : (
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
                                                Click on an artist to go to artist's Spotify page
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
                                                Click on an album to go to album's Spotify page
                                            </Typography>
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                <MostCommonTable data={analysisData.most_common_albums} type="Album" />
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item sx={{ width: "90%" }}>
                                        <Box>
                                            <Typography variant='h5' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                                                Song Length
                                            </Typography>
                                            <TrackLengthContainer shortestTrack={analysisData.shortest_track} longestTrack={analysisData.longest_track}></TrackLengthContainer>
                                        </Box>
                                    </Grid>
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
                                                    <LineGraphApex data={transformTrackerData(likedTracksTrackerData, "Liked Tracks")} />
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
                    )
            }
        </Box >
    );
}

export default AnalysisPage;
