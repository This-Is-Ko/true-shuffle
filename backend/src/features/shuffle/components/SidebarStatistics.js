import React from "react";
import { Typography, Stack, Box } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import SidebarCard from "./SidebarCard";
import { formatNumberWithSpaces } from "../../../utils/NumberFormatter";

const SidebarStatistics = ({ userShuffleCounter }) => {
    if (!userShuffleCounter) {
        return null;
    }

    return (
        <SidebarCard>
            <Typography 
                variant="h6" 
                sx={{ 
                    color: 'white', 
                    fontSize: '1.1rem', 
                    fontWeight: 600,
                    mb: 1.5,
                    letterSpacing: '0.01em',
                    textAlign: 'center'
                }}
            >
                Overview
            </Typography>
            <Box sx={{ width: '100%' }}>
                {/* Playlist Count Card */}
                <Box sx={{
                    backgroundColor: "#333",
                    borderRadius: "8px",
                    p: 2,
                    textAlign: "center",
                    mb: 0.25
                }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                        <ListIcon sx={{ color: "#1DB954" }} />
                        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 'bold' }}>
                            Playlists Shuffled
                        </Typography>
                    </Stack>
                    <Typography variant="h4" component="div" sx={{ color: "#1DB954", fontWeight: 'bold' }}>
                        {formatNumberWithSpaces(userShuffleCounter.playlist_count)}
                    </Typography>
                </Box>

                {/* Track Count Card */}
                <Box sx={{
                    backgroundColor: "#333",
                    borderRadius: "8px",
                    p: 2,
                    textAlign: "center"
                }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                        <AudiotrackIcon sx={{ color: "#1DB954" }} />
                        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 'bold' }}>
                            Tracks Shuffled
                        </Typography>
                    </Stack>
                    <Typography variant="h4" component="div" sx={{ color: "#1DB954", fontWeight: 'bold' }}>
                        {formatNumberWithSpaces(userShuffleCounter.track_count)}
                    </Typography>
                </Box>
            </Box>
        </SidebarCard>
    );
};

export default SidebarStatistics;
