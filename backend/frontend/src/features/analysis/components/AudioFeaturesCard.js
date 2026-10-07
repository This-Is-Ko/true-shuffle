import React from "react";
import { Box } from "@mui/material";
import MediaQuery from 'react-responsive';
import AnalysisCard from "./AnalysisCard";
import AudioFeaturesRadar from "../../../components/dataVisualisers/AudioFeaturesRadar";
import FeatureScoreContainer from "../../../components/analysisPageComponents/FeatureScoreContainer";
import { transformAudioFeatureData } from "../../../utils/StatisticsService";

/**
 * Audio Features card component displaying radar chart and feature score details.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.audioFeatures - Array of audio features data
 */
const AudioFeaturesCard = ({ audioFeatures }) => {
    return (
        <AnalysisCard
            title="Audio Features Analysis"
            description="Based on Spotify's audio features, these are the average rankings of your library."
        >
            <Box
                sx={{
                    height: { xs: "250px", sm: '300px', md: "500px" },
                    marginBottom: 3,
                }}
            >
                <MediaQuery maxWidth={600}>
                    <AudioFeaturesRadar
                        data={transformAudioFeatureData(audioFeatures)}
                        sideMargin={80}
                        topMargin={30}
                        gridLabelOffset={7}
                    />
                </MediaQuery>
                <MediaQuery minWidth={600}>
                    <AudioFeaturesRadar
                        data={transformAudioFeatureData(audioFeatures)}
                        sideMargin={80}
                        topMargin={50}
                        gridLabelOffset={36}
                    />
                </MediaQuery>
            </Box>
            <FeatureScoreContainer audioFeatures={audioFeatures} />
        </AnalysisCard>
    );
};

export default AudioFeaturesCard;

