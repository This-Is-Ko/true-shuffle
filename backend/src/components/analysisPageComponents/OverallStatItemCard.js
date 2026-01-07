import React from "react";
import { Typography, Card, CardContent, IconButton, Box, Tooltip } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { formatNumberWithSpaces } from "../../utils/NumberFormatter";

const OverallStatItemCard = ({ title, stat, description }) => {
    // Format stat if it's a number >= 1000, otherwise use as-is (for strings like track length)
    const formattedStat = typeof stat === 'number' ? formatNumberWithSpaces(stat) : stat;
    const statString = String(formattedStat);
    
    return (
        <Card sx={{
            textAlign: "left",
            backgroundColor: "#1DB954",
            borderRadius: "5px",
            height: "100%",
            width: "100%",
            maxWidth: "180px",
            flex: "1 1 0",
            minWidth: "150px",
            minHeight: "90px",
            position: "relative",
            display: "flex",
            flexDirection: "column"
        }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 }}>
                    <Typography sx={{ fontFamily: "'Questrial', sans-serif;" }} variant="subtitle2" color="text.secondary">
                        <strong>{title}</strong>
                    </Typography>
                    <Tooltip title={description || ""} arrow placement="top">
                        <IconButton
                            size="small"
                            sx={{
                                color: "black",
                                padding: "2px",
                                marginLeft: 1,
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.1)"
                                }
                            }}
                        >
                            <HelpOutlineIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    minHeight: "40px",
                    flexGrow: 1
                }}>
                    {
                        statString.length > 9 ? 
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h6" component="div">
                            <strong>{formattedStat}</strong>
                        </Typography>
                        : statString.length > 8 ?
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h5" component="div">
                            <strong>{formattedStat}</strong>
                        </Typography>
                        : 
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h4" component="div">
                            <strong>{formattedStat}</strong>
                        </Typography>
                    }
                </Box>
            </CardContent>
        </Card>
    )
}

export default OverallStatItemCard;