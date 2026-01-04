import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Box, Link } from "@mui/material";
import { makeTrackLengthString } from "../../utils/StatisticsService";

const TrackLengthTable = ({ data }) => {
    return (
        <TableContainer component={Box} sx={{ width: "90%", maxHeight: "300px" }}>
            <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954' }}>Rank</TableCell>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954' }}>Name</TableCell>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954' }} align="right">Length</TableCell>
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
                            <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                            <TableCell sx={{ color: "white" }} component="th" scope="row">
                                <Link underline="hover" href={row.external_url} target="_blank" rel="noopener noreferrer" sx={{ color: "white" }}>
                                    {row.title}
                                </Link>
                            </TableCell>
                            <TableCell sx={{ color: "white" }} align="right">{makeTrackLengthString(row.length)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TrackLengthTable;