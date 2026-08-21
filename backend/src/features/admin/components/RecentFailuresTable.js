import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography
} from "@mui/material";

const headCellSx = {
    color: "lightgrey",
    fontWeight: 600,
    backgroundColor: "#222",
};

const bodyCellSx = {
    color: "#ddd",
    borderColor: "#333",
};

const RecentFailuresTable = ({ failures }) => {
    if (!failures || failures.length === 0) {
        return (
            <Typography variant="body1" sx={{ color: "lightgrey", fontStyle: "italic", textAlign: "center", py: 4 }}>
                No failures yet
            </Typography>
        );
    }

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString;
        return date.toLocaleString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <TableContainer component={Paper} sx={{ bgcolor: "#181818", borderRadius: "5px", maxHeight: 400 }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headCellSx}>User</TableCell>
                        <TableCell sx={headCellSx}>Playlist</TableCell>
                        <TableCell sx={headCellSx}>Error</TableCell>
                        <TableCell sx={headCellSx}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {failures.map((failure, index) => (
                        <TableRow key={index} hover>
                            <TableCell sx={bodyCellSx}>{failure.user_id}</TableCell>
                            <TableCell sx={bodyCellSx}>{failure.playlist_name}</TableCell>
                            <TableCell sx={{ ...bodyCellSx, color: "#f28b82" }}>{failure.error_message || "-"}</TableCell>
                            <TableCell sx={bodyCellSx}>{formatDate(failure.shuffled_at)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RecentFailuresTable;
