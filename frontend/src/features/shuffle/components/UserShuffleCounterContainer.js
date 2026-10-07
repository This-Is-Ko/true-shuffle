import React from "react";
import ListIcon from '@mui/icons-material/List';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { Stack } from "@mui/material";
import CounterTooltipChip from './CounterTooltipChip';

const UserShuffleCounterContainer = ({ userShuffleCounter }) => {
    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ flexWrap: "wrap", maxWidth: "400px", margin: "auto" }}
        >
            {/* Playlist Count Chip */}
            <CounterTooltipChip
                icon={<ListIcon sx={{ color: "#1DB954" }} />}
                label={userShuffleCounter.playlist_count}
                tooltipTitle="Number of playlists shuffled"
            />

            {/* Track Count Chip */}
            <CounterTooltipChip
                icon={<AudiotrackIcon sx={{ color: "#1DB954" }} />}
                label={userShuffleCounter.track_count}
                tooltipTitle="Number of tracks shuffled"
            />
        </Stack>
    );
};

export default UserShuffleCounterContainer;
