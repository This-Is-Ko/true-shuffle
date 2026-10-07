import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Box, Link } from "@mui/material";
import { makeTrackLengthString } from "../../utils/StatisticsService";

const TrackLengthTable = ({ data }) => {
    return (
        <TableContainer component={Box} sx={{ width: "100%", height: "100%" }}>
            <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954', width: "60px" }}>Rank</TableCell>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954', maxWidth: "300px" }}>Name</TableCell>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954', width: "100px" }} align="right">Length</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                            key={row.id}
                            hover
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                color: "white"
                            }}
                        >
                            <TableCell sx={{ color: "white", width: "60px" }}>{index + 1}</TableCell>
                            <TableCell 
                                sx={{ 
                                    color: "white", 
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }} 
                                component="th" 
                                scope="row"
                            >
                                <Link 
                                    underline="hover" 
                                    href={row.external_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    sx={{ 
                                        color: "white",
                                        display: "block",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                    title={row.title}
                                >
                                    {row.title}
                                </Link>
                            </TableCell>
                            <TableCell sx={{ color: "white", width: "100px" }} align="right">{makeTrackLengthString(row.length)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TrackLengthTable;