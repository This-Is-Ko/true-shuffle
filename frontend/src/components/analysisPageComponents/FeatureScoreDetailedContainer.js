import React from "react";
import { Grid } from "@mui/material";
import FeatureScoreItem from "./FeatureScoreItem";

const FeatureScoreDetailedContainer = ({ audioFeatures }) => {

    // Get track information using ids

    return (
        <Grid
            sx={{
                margin: { sm: "auto", md: "0 auto", },
                maxWidth: "600px"
            }}
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
        >
            {
                audioFeatures.map((audioFeatureItem) => (
                    <FeatureScoreItem featureScoreData={audioFeatureItem}></FeatureScoreItem>
                ))
            }
        </Grid>
    )
}

export default FeatureScoreDetailedContainer;