import React from "react";
import Grid from '@mui/material/Grid2';
import { makeTrackLengthString } from "../../utils/StatisticsService";
import TrackStatCard from "./TrackStatCard"

const TrackLengthContainer = ({ shortestTracks, longestTracks }) => {
    if (shortestTracks === null && longestTracks == null) {
        return null
    }

    return (
        <Grid
            sx={{
                margin: { sm: "auto", md: "0 auto", },
                maxWidth: "850px"
            }}
            container
            spacing={3}
            justifyContent="center"
            alignItems="flex-start"
        >
            <TrackStatCard title="Shortest Track Length" stat={makeTrackLengthString(shortestTracks[0]["length"])} description="Shortest track in your Liked Songs library" track={shortestTracks[0]}></TrackStatCard>
            <TrackStatCard title="Longest Track Length" stat={makeTrackLengthString(longestTracks[0]["length"])} description="Longest track in your Liked Songs library" track={longestTracks[0]}></TrackStatCard>
        </Grid>
    )
}

export default TrackLengthContainer;