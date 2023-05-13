import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Box, Link } from "@mui/material";

const MostCommonTable = ({ data, type }) => {
    const numOfArtists = data.length
    return (
        <TableContainer component={Box} sx={{ width: "90%", maxHeight: "300px" }}>
            <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954' }}>{type}</TableCell>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954' }} align="right">Count</TableCell>
                        <TableCell sx={{ color: "white", backgroundColor: '#1DB954' }} align="right">Percentage (Rounded)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.id}
                            hover
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                color: "white"
                            }}
                        >
                            <TableCell sx={{ color: "white" }} component="th" scope="row">
                                <Link underline="hover" href={row.external_url} target="_blank" rel="noopener noreferrer" sx={{ color: "white" }}>
                                    {row.name}
                                </Link>
                            </TableCell>
                            <TableCell sx={{ color: "white" }} align="right">{row.count}</TableCell>
                            <TableCell sx={{ color: "white" }} align="right">{Math.round(row.count / numOfArtists * 100)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MostCommonTable;