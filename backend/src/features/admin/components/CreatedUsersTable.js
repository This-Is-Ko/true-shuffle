import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Button, Box
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const headCellSx = {
    color: "lightgrey",
    fontWeight: 600,
    backgroundColor: "#222",
};

const bodyCellSx = {
    color: "#ddd",
    borderColor: "#333",
};

/**
 * Table showing the number of users created per month, oldest first.
 * @param {Object} props - Component props
 * @param {Array} props.data - [{ month: "YYYY-MM", created_users: number }]
 * @param {boolean} props.canExpand - Whether the "show more months" button is shown
 * @param {Function} props.onShowMore - Callback to fetch and display more months
 */
const CreatedUsersTable = ({ data, canExpand, onShowMore }) => {
    if (!data || data.length === 0) {
        return (
            <Typography variant="body1" sx={{ color: "lightgrey", fontStyle: "italic", textAlign: "center", py: 4 }}>
                No user data yet
            </Typography>
        );
    }

    return (
        <Box>
            <TableContainer component={Paper} sx={{ bgcolor: "#181818", borderRadius: "5px" }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headCellSx}>Month</TableCell>
                            <TableCell align="right" sx={headCellSx}>New Users</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((entry, index) => (
                            <TableRow key={index} hover>
                                <TableCell sx={bodyCellSx}>{entry.month}</TableCell>
                                <TableCell align="right" sx={bodyCellSx}>{entry.created_users}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {canExpand && (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1.5 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ExpandMoreIcon />}
                        onClick={onShowMore}
                        sx={{
                            color: "#1DB954",
                            borderColor: "#1DB954",
                            "&:hover": {
                                borderColor: "#1ed760",
                                backgroundColor: "rgba(29, 185, 84, 0.08)",
                            },
                        }}
                    >
                        Show more months
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default CreatedUsersTable;
