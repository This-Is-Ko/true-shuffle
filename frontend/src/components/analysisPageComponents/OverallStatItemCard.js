import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Card, CardContent } from "@mui/material";
import { formatNumberWithSpaces } from "../../utils/NumberFormatter";

const OverallStatItemCard = ({ title, stat, description }) => {
    // Format stat if it's a number >= 1000, otherwise use as-is (for strings like track length)
    const formattedStat = typeof stat === 'number' ? formatNumberWithSpaces(stat) : stat;
    const statString = String(formattedStat);
    
    return (
        <Grid item
            xs={12} sm={6}
            sx={{
                display: "flex",
                justifyContent: "center",
                margin: "0 auto",
            }}
        >
            <Card sx={{
                textAlign: "left",
                backgroundColor: "#1DB954",
                borderRadius: "5px",
                height: "auto",
                maxHeight: "360px",
                width: "auto",
                maxWidth: "270px"
            }}>
                <CardContent>
                    <Typography sx={{ fontFamily: "'Questrial', sans-serif;" }} variant="subtitle1" color="text.secondary" gutterBottom>
                        <strong>{title}</strong>
                    </Typography>
                    {
                        statString.length > 9 ? 
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h4" component="div">
                            <strong>{formattedStat}</strong>
                        </Typography>
                        : statString.length > 8 ?
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h3" component="div">
                            <strong>{formattedStat}</strong>
                        </Typography>
                        : 
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h2" component="div">
                            <strong>{formattedStat}</strong>
                        </Typography>
                    }
                    <Typography variant="body2" color="black">
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default OverallStatItemCard;