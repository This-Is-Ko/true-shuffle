import React from "react";
import { Box } from "@mui/material";
import AnalysisCard from "./AnalysisCard";
import OverallStatItemCard from "../../../components/analysisPageComponents/OverallStatItemCard";
import { makeTrackLengthString } from "../../../utils/StatisticsService";

/**
 * Overview cards component displaying key library statistics.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.analysisData - Analysis data object containing library statistics
 */
const OverviewCardsCard = ({ analysisData }) => {
    return (
        <AnalysisCard
            title="Library Overview"
            description="Key statistics about your music library"
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "space-around",
                    alignItems: "stretch",
                }}
            >
                <OverallStatItemCard
                    title="Tracks"
                    stat={analysisData.num_tracks}
                    description="Total number of tracks in your Liked Songs library"
                />
                <OverallStatItemCard
                    title="Artists"
                    stat={analysisData.num_artists}
                    description="Total number of unique artists in your Liked Songs library"
                />
                <OverallStatItemCard
                    title="Albums"
                    stat={analysisData.num_albums}
                    description="Total number of unique albums in your Liked Songs library"
                />
                <OverallStatItemCard
                    title="Average Length"
                    stat={makeTrackLengthString(analysisData.average_track_length)}
                    description="Average track length of all your tracks"
                />
                <OverallStatItemCard
                    title="Total Length"
                    stat={makeTrackLengthString(analysisData.total_length)}
                    description="How long it takes to listen to all your Liked Songs (d:h:m:s)"
                />
            </Box>
        </AnalysisCard>
    );
};

export default OverviewCardsCard;

