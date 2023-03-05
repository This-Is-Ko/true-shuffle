import React from "react";
import { Typography, Grid } from "@mui/material";

const OverallStatItem = ({ title, stat }) => {
    return (
        <Grid item sx={{
            width: "33%",
            maxWidth: "200px"
        }}>
            <Typography variant='body2' component="div" sx={{ paddingTop: "5px", color: "white", textAlign: "center", fontFamily: "'Questrial', sans-serif;" }}>
                {title}
            </Typography>
            <Typography variant='h3' component="div" sx={{ paddingTop: "5px", color: "white", textAlign: "center" }}>
                <strong>{stat}</strong>
            </Typography>
        </Grid>
    )
}

export default OverallStatItem;