import React from 'react';
import { Paper } from "@mui/material";

import { transformTrackerData } from "../../utils/StatisticsService";
import LineGraphApex from './LineGraphApex';

const LikedTracksHistoryGraph = ({ data }) => {
    let transformData = transformTrackerData(data, "Liked Tracks")
    const xValues = transformData[0]["data"].map((point) => point["x"]);
    const yValues = transformData[0]["data"].map((point) => point["y"]);

    return (
        <Paper sx={{ height: "500px", backgroundColor: "#b9b9b9" }}>
            <LineGraphApex xValues={xValues} yValues={yValues} yName="Liked Tracks"/>
        </Paper>
    )
}

export default LikedTracksHistoryGraph;