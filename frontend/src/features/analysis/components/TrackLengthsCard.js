import React from "react";
import Grid from '@mui/material/Grid2';
import { Box } from "@mui/material";
import AnalysisCard from "./AnalysisCard";
import TrackLengthContainer from "../../../components/analysisPageComponents/TrackLengthContainer";
import TrackLengthTable from "../../../components/dataVisualisers/TrackLengthTable";

/**
 * Track Lengths card component displaying track length statistics and tables.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.shortestTracks - Array of shortest tracks data
 * @param {Array} props.longestTracks - Array of longest tracks data
 */
const TrackLengthsCard = ({ shortestTracks, longestTracks }) => {
    if (shortestTracks === null && longestTracks === null) {
        return null;
    }

    return (
        <AnalysisCard
            title="Track Length Statistics"
            description="Statistics about track lengths in your library"
        >
            <Box sx={{ marginBottom: 3 }}>
                <TrackLengthContainer
                    shortestTracks={shortestTracks}
                    longestTracks={longestTracks}
                />
            </Box>
            <Grid
                container
                spacing={3}
                sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Box sx={{ 
                        width: "100%", 
                        height: { xs: "auto", md: "400px" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start"
                    }}>
                        <Box sx={{ 
                            width: "100%", 
                            height: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <TrackLengthTable data={shortestTracks} />
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Box sx={{ 
                        width: "100%", 
                        height: { xs: "auto", md: "400px" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start"
                    }}>
                        <Box sx={{ 
                            width: "100%", 
                            height: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <TrackLengthTable data={longestTracks} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </AnalysisCard>
    );
};

export default TrackLengthsCard;

