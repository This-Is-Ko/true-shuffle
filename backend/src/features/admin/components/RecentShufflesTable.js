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

const RecentShufflesTable = ({ shuffles }) => {
    if (!shuffles || shuffles.length === 0) {
        return (
            <Typography variant="body1" sx={{ color: "lightgrey", fontStyle: "italic", textAlign: "center", py: 4 }}>
                No shuffles yet
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

    const formatDuration = (seconds) => {
        if (seconds == null) return "-";
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

    return (
        <TableContainer component={Paper} sx={{ bgcolor: "#181818", borderRadius: "5px", maxHeight: 400 }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headCellSx}>User</TableCell>
                        <TableCell sx={headCellSx}>Playlist</TableCell>
                        <TableCell align="right" sx={headCellSx}>Tracks</TableCell>
                        <TableCell align="right" sx={headCellSx}>Duration</TableCell>
                        <TableCell sx={headCellSx}>Date</TableCell>
                        <TableCell sx={headCellSx}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shuffles.map((shuffle, index) => (
                        <TableRow key={index} hover>
                            <TableCell sx={bodyCellSx}>{shuffle.user_id}</TableCell>
                            <TableCell sx={bodyCellSx}>{shuffle.playlist_name}</TableCell>
                            <TableCell align="right" sx={bodyCellSx}>{shuffle.tracks_shuffled}</TableCell>
                            <TableCell align="right" sx={bodyCellSx}>{formatDuration(shuffle.duration_seconds)}</TableCell>
                            <TableCell sx={bodyCellSx}>{formatDate(shuffle.shuffled_at)}</TableCell>
                            <TableCell sx={{ ...bodyCellSx, color: shuffle.status === "failed" ? "#f28b82" : "#7ee787" }}>
                                {shuffle.status}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RecentShufflesTable;
