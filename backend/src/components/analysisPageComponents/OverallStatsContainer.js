import React from "react";
import { Grid } from "@mui/material";
import OverallStatItem from "./OverallStatItem";

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
            <OverallStatItem title={"Total Songs"} stat={analysisData.num_tracks} />
            <OverallStatItem title={"Total Artists"} stat={analysisData.num_artists} />
            <OverallStatItem title={"Total Album"} stat={analysisData.num_albums} />
            <OverallStatItem title={"Average Length"} stat={makeTrackLengthString(analysisData.average_track_length)} />
            <OverallStatItem title={"Total Length"} stat={makeTrackLengthString(analysisData.total_length)} />
        </Grid>
    )
}

export default OverallStatsContainer;