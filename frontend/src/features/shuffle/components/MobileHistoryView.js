import React from "react";
import { Box, Typography, Avatar, Chip, Divider } from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DeleteShuffledPlaylistsButton from "./DeleteShuffledPlaylists";
import { formatNumberWithCommas } from "../../../utils/NumberFormatter";

/**
 * Formats a shuffle timestamp for the mobile history list.
 * Today/yesterday show a prefix and time, older entries show d/m/yyyy.
 *
 * @param {string} timestamp - ISO timestamp of the shuffle
 * @returns {string} Formatted date string
 */
const formatShuffleDate = (timestamp) => {
    if (!timestamp) return "";

    const dateObj = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const shuffleDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const diffDays = Math.floor((today - shuffleDate) / (1000 * 60 * 60 * 24));
    const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    if (diffDays === 0) {
        return `Today, ${timeStr}`;
    }
    if (diffDays === 1) {
        return `Yesterday, ${timeStr}`;
    }
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
};

/**
 * MobileHistoryView component - Mobile history tab showing the user's recent
 * shuffles as a divider-separated list, with a header containing the delete action.
 *
 * @param {Object} props
 * @param {Array} props.recentShuffles - Array of recent shuffle records
 * @param {number|null} props.existingShuffledPlaylistCount - Count of shuffled playlists to delete
 * @param {Function} props.onDeleteSuccess - Callback when shuffle deletion succeeds
 */
const MobileHistoryView = ({ recentShuffles, existingShuffledPlaylistCount, onDeleteSuccess }) => {
    const hasShuffles = Array.isArray(recentShuffles) && recentShuffles.length > 0;
    const sortedShuffles = hasShuffles
        ? [...recentShuffles].sort((a, b) => new Date(b.shuffled_at) - new Date(a.shuffled_at))
        : [];

    return (
        <Box sx={{ width: '100%', boxSizing: 'border-box', px: 1.5, py: 1 }}>
            {/* Header with delete action */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: 'white', fontWeight: 700, fontSize: '1.15rem', textAlign: 'left' }}
                >
                    Shuffle history
                </Typography>
                <DeleteShuffledPlaylistsButton
                    variant="icon"
                    playlistCount={existingShuffledPlaylistCount || 0}
                    disabled={!existingShuffledPlaylistCount || existingShuffledPlaylistCount <= 0}
                    onDeleteSuccess={onDeleteSuccess}
                />
            </Box>

            {hasShuffles ? (
                <Box>
                    {sortedShuffles.map((shuffle, index) => (
                        <Box key={index}>
                            {index > 0 && <Divider sx={{ bgcolor: '#333' }} />}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}>
                                <Avatar
                                    src={shuffle.playlist_image_url || undefined}
                                    alt={shuffle.playlist_name}
                                    variant="rounded"
                                    sx={{ width: 44, height: 44, borderRadius: '6px', bgcolor: '#333', flexShrink: 0 }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                    <Typography
                                        sx={{
                                            color: 'white',
                                            fontSize: '1rem',
                                            textAlign: 'left',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {shuffle.playlist_name}
                                    </Typography>
                                    <Typography sx={{ color: '#b3b3b3', fontSize: '0.8rem', textAlign: 'left' }}>
                                        {formatShuffleDate(shuffle.shuffled_at)}
                                    </Typography>
                                </Box>
                                <Chip
                                    icon={<MusicNoteIcon />}
                                    label={formatNumberWithCommas(shuffle.tracks_shuffled)}
                                    size="small"
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        flexShrink: 0,
                                        '& .MuiChip-icon': { color: '#1DB954' },
                                        '& .MuiChip-label': { px: 1 }
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1" sx={{ color: '#b3b3b3', textAlign: 'center', py: 4 }}>
                    No recent shuffles yet.
                </Typography>
            )}
        </Box>
    );
};

export default MobileHistoryView;
