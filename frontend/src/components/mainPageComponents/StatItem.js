import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Divider } from "@mui/material";

const StatItem = ({ stat, description }) => {
    if (stat == null) {
      return <Grid item></Grid>
    }

    return (
        <Grid item xs="auto" sx={{ width: "auto", maxWidth: "400px", textAlign: "center" }}>
            <Typography
                variant='h3'
                component="div"
                sx={{
                    color: "white",
                    fontSize: {
                        xs: "2rem",
                        sm: "3rem",
                    }
                }}
            >
                <strong>{formatNumber(stat)}</strong>
            </Typography>
            <Divider
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                margin: "10px auto",
                width: "60px",
                height: "2px",
              }}
            />
            <Typography variant='h6' component="div" sx={{color: "white" }}>
                {description}
            </Typography>
        </Grid>
    )
}

export function formatNumber(number) {
  if (number >= 1000000) {
    return `${(Math.round((number / 1000000) * 100) / 100).toFixed(2)}M`;
  }
  if (number >= 1000) {
    return `${(Math.round((number / 1000) * 100) / 100).toFixed(2)}K`;
  }
  return number.toFixed(2);
}


export default StatItem;
