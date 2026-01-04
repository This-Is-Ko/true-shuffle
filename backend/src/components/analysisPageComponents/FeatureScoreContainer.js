import React from "react";
import Grid from '@mui/material/Grid2';
import FeatureScoreItem from "./FeatureScoreItem";

const FeatureScoreContainer = ({ audioFeatures }) => {
    return (
        <Grid
            sx={{
                margin: { sm: "auto", md: "0 auto", },
                maxWidth: "900px",
                width: "100%"
            }}
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
        >
            {
                audioFeatures.map((audioFeatureItem) => (
                    <FeatureScoreItem key={audioFeatureItem.feature_name} featureScoreData={audioFeatureItem}></FeatureScoreItem>
                ))
            }
        </Grid>
    )
}

export default FeatureScoreContainer;