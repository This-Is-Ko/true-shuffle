import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AnalysisCard from "./AnalysisCard";
import Pie from "../../../components/dataVisualisers/Pie";
import MostCommonTable from "../../../components/dataVisualisers/MostCommonTable";
import { transformMostCommonAlbums } from "../../../utils/StatisticsService";

/**
 * Top Albums card component displaying pie chart and table of most common albums.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.mostCommonAlbums - Array of most common albums data
 */
const TopAlbumsCard = ({ mostCommonAlbums }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(600));

    return (
        <AnalysisCard
            title="Top Albums"
            description="Your most listened to albums"
        >
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Grid container spacing={1.5} alignItems="center" sx={{ maxWidth: "1000px", justifyContent: "center" }}>
                    <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box
                            sx={{
                                width: { xs: "350px", sm: "400px", md: "500px" },
                                height: { xs: "350px", sm: "300px", md: "500px" },
                                marginBottom: { xs: 1.5, md: 0 },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {isMobile ? (
                                <Box sx={{ marginBottom: 2, width: "100%", height: "100%" }}>
                                    <Pie
                                        data={transformMostCommonAlbums(mostCommonAlbums, 0, 10)}
                                        sideMargin={30}
                                        topMargin={10}
                                        labelDiagonalLength={16}
                                        labelStraightLength={0}
                                        enableArcLinkLabels={false}
                                        enableLegend={false}
                                    />
                                </Box>
                            ) : (
                                <Pie
                                    data={transformMostCommonAlbums(mostCommonAlbums, 0, 10)}
                                    sideMargin={80}
                                    topMargin={40}
                                    labelDiagonalLength={24}
                                    labelStraightLength={16}
                                />
                            )}
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
                            <MostCommonTable data={mostCommonAlbums} type="Album" />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </AnalysisCard>
    );
};

export default TopAlbumsCard;

