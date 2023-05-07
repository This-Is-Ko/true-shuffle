import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";

const FeatureScoreItem = ({ featureScoreData }) => {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Grid item>
            <Card sx={{
                textAlign: "left",
                backgroundColor: "#1DB954",
                borderRadius: "5px",
                height: "auto",
                maxHeight: "360px",
                width: "auto",
                maxWidth: "270px",
                minWidth: "270px"
            }}>
                <CardContent>
                    <Typography sx={{ fontFamily: "'Questrial', sans-serif;" }} variant="subtitle1" color="text.secondary" gutterBottom>
                        <strong>{capitalizeFirstLetter(featureScoreData["feature_name"])}</strong>
                    </Typography>
                    <Typography sx={{ color: "white", textAlign: "center" }} variant="h3" component="div">
                        <strong>{featureScoreData["highest_feature_score"]["value"]}</strong>
                    </Typography>
                    <Typography variant="body2" color="black">
                        Highest value
                    </Typography>
                    <Typography sx={{ color: "white", textAlign: "center" }} variant="h3" component="div">
                        <strong>{featureScoreData["lowest_feature_score"]["value"]}</strong>
                    </Typography>
                    <Typography variant="body2" color="black">
                        Lowest value
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default FeatureScoreItem;