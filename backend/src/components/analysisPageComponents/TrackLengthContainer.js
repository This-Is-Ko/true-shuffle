import React from "react";
import { Grid } from "@mui/material";
import { makeTrackLengthString } from "../../utils/StatisticsService";
import TrackStatCard from "./TrackStatCard"

const TrackLengthContainer = ({ shortestTrack, longestTrack }) => {
    if (shortestTrack === null && longestTrack == null) {
        return null
    }

    return (
        <Grid
            sx={{
                margin: { sm: "auto", md: "0 auto", },
                maxWidth: "850px"
            }}
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
        >
            <TrackStatCard title="Shortest Track Length" stat={makeTrackLengthString(shortestTrack["length"])} description="Shortest track in your Liked Songs library" track={shortestTrack}></TrackStatCard>
            <TrackStatCard title="Longest Track Length" stat={makeTrackLengthString(longestTrack["length"])} description="Longest track in your Liked Songs library" track={longestTrack}></TrackStatCard>
        </Grid>
    )
}

export default TrackLengthContainer;