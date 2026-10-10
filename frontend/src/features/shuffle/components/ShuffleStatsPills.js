import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { formatNumberWithCommas } from "../../../utils/NumberFormatter";

/**
 * StatPill - A single rounded pill showing an icon, a count and a noun.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon rendered before the count
 * @param {number|string} props.count - The value to display
 * @param {string} props.noun - Word shown after the count (e.g. "playlists")
 */
const StatPill = ({ icon, count, noun }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.5,
            borderRadius: '999px',
            border: '1px solid #4d4d4d',
            bgcolor: 'transparent',
            whiteSpace: 'nowrap'
        }}
    >
        {icon}
        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
            {formatNumberWithCommas(count)} {noun}
        </Typography>
    </Box>
);

/**
 * ShuffleStatsPills component - Displays the user's cumulative shuffled
 * playlists and tracks as two pills (e.g. "396 playlists", "644,477 tracks").
 * Renders nothing when the counter is unavailable.
 *
 * @param {Object} props
 * @param {Object|boolean} props.userShuffleCounter - Counter with playlist_count / track_count
 */
const ShuffleStatsPills = ({ userShuffleCounter }) => {
    if (!userShuffleCounter) {
        return null;
    }

    const playlistCount = userShuffleCounter.playlist_count;
    const trackCount = userShuffleCounter.track_count;

    if (playlistCount == null && trackCount == null) {
        return null;
    }

    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}
        >
            {playlistCount != null && (
                <StatPill
                    icon={<ListIcon sx={{ color: "#1DB954", fontSize: "1.1rem" }} />}
                    count={playlistCount}
                    noun={playlistCount === 1 ? 'playlist' : 'playlists'}
                />
            )}
            {trackCount != null && (
                <StatPill
                    icon={<AudiotrackIcon sx={{ color: "#1DB954", fontSize: "1.1rem" }} />}
                    count={trackCount}
                    noun={trackCount === 1 ? 'track' : 'tracks'}
                />
            )}
        </Stack>
    );
};

export default ShuffleStatsPills;
