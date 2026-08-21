import React from "react";
import { Card, CardContent, Typography, Box, Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { formatNumberWithSpaces } from "../../../utils/NumberFormatter";

const StatCard = ({ title, value, description }) => {
    const formattedValue = typeof value === 'number' ? formatNumberWithSpaces(value) : (value ?? "-");
    const valueString = String(formattedValue);

    return (
        <Card sx={{
            backgroundColor: "#181818",
            borderRadius: "5px",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1, textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: "lightgrey" }}>
                        <strong>{title}</strong>
                    </Typography>
                    {description && (
                        <Tooltip title={description} arrow placement="top">
                            <IconButton
                                size="small"
                                sx={{
                                    color: "#aaa",
                                    padding: "2px",
                                    marginLeft: 0.5,
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                                }}
                            >
                                <HelpOutlineIcon sx={{ fontSize: "14px" }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
                    <Typography
                        variant={valueString.length > 9 ? "h6" : "h4"}
                        component="div"
                        sx={{ color: "white", fontWeight: "bold" }}
                    >
                        {formattedValue}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatCard;
