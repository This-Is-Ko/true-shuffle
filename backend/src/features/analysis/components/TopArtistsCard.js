import React from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import MediaQuery from 'react-responsive';
import AnalysisCard from "./AnalysisCard";
import Pie from "../../../components/dataVisualisers/Pie";
import MostCommonTable from "../../../components/dataVisualisers/MostCommonTable";
import { transformMostCommonArtists } from "../../../utils/StatisticsService";

/**
 * Top Artists card component displaying pie chart and table of most common artists.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.mostCommonArtists - Array of most common artists data
 */
const TopArtistsCard = ({ mostCommonArtists }) => {
    return (
        <AnalysisCard
            title="Top Artists"
            description="Your most listened to artists"
        >
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Grid container spacing={3} alignItems="center" sx={{ maxWidth: "1000px", justifyContent: "center" }}>
                    <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box
                            sx={{
                                width: { xs: "350px", sm: "400px", md: "500px" },
                                height: { xs: "350px", sm: "300px", md: "500px" },
                                marginBottom: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <MediaQuery maxWidth={600}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Pie
                                        data={transformMostCommonArtists(mostCommonArtists, 0, 10)}
                                        sideMargin={30}
                                        topMargin={10}
                                        labelDiagonalLength={16}
                                        labelStraightLength={0}
                                        enableArcLinkLabels={false}
                                        enableLegend={false}
                                    />
                                </Box>
                            </MediaQuery>
                            <MediaQuery minWidth={601}>
                                <Pie
                                    data={transformMostCommonArtists(mostCommonArtists, 0, 10)}
                                    sideMargin={80}
                                    topMargin={40}
                                    labelDiagonalLength={24}
                                    labelStraightLength={16}
                                />
                            </MediaQuery>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box
                            sx={{
                                width: { xs: "350px", sm: "500px", md: "700px" },
                                height: { xs: "250px", sm: "200px", md: "300px" },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <MostCommonTable data={mostCommonArtists} type="Artist" />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </AnalysisCard>
    );
};

export default TopArtistsCard;

