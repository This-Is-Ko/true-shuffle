import React from "react";
import { Grid } from "@mui/material";
import OverallStatItemCard from "./OverallStatItemCard";

const OverallStatsContainer = ({ analysisData }) => {
    const makeTrackLengthString = (length_data) => {
        if (length_data.days != 0) {
            return (length_data.days + ":" + length_data.hours + ":" + length_data.minutes + ":" + length_data.seconds)
        } else if (length_data.hours != 0) {
            return (length_data.hours + ":" + length_data.minutes + ":" + length_data.seconds)
        } else {
            return (length_data.minutes + ":" + length_data.seconds)
        }
    }

    return (
        <Grid
            sx={{
                margin: { sm: "auto", md: "0 auto", },
                maxWidth: "600px"
            }}
            container
            spacing={3}
            justifyContent="center"
            alignItems="flex-start"
        >
            <OverallStatItemCard title={"Songs"} stat={analysisData.num_tracks} description={"Total number of songs in your Liked Songs library"} />
            <OverallStatItemCard title={"Artists"} stat={analysisData.num_artists} description={"Total number of unique artists in your Liked Songs library"} />
            <OverallStatItemCard title={"Albums"} stat={analysisData.num_albums} description={"Total number of unique albums in your Liked Songs library"} />
            <OverallStatItemCard title={"Average Length"} stat={makeTrackLengthString(analysisData.average_track_length)} description={"Average track length of all your songs"} />
            <OverallStatItemCard title={"Total Length"} stat={makeTrackLengthString(analysisData.total_length)} description={"How long it takes to listen to all your Liked Songs (d:h:m:s)"} />
        </Grid>
    )
}

export default OverallStatsContainer;