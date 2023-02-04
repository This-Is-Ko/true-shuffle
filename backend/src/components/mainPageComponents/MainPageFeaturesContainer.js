import React from "react"

import Grid from '@mui/material/Grid';
import { Box, Typography } from "@mui/material";

import MainPageFeaturesItem from "./MainPageFeaturesItem";
import { features } from "./MainPageFeaturesEntries";

const MainPageFeaturesContainer = () => {
    return (
        <Box>
            <Typography variant='h3' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                Features
            </Typography>
            <Grid
                sx={{ paddingTop: "20px", margin: "0 auto" }}
                container
                spacing={2}
                justifyContent="center"
                alignItems="flex-start"
            >
                {features.map((feature) => (
                    <MainPageFeaturesItem
                        class="MainPageFeaturesItem"
                        key={feature.name}
                        feature={feature}
                    />
                ))}
            </Grid>
        </Box>
    )
};

export default MainPageFeaturesContainer;