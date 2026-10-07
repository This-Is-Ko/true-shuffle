import React from "react";
import { Divider, Card, Button } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteShuffledPlaylistsButton from "./DeleteShuffledPlaylists";

/**
 * SidebarActionButtonsCard component - Displays action buttons for library analysis, sharing, and deletion.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onDeleteSuccess - Callback when shuffle deletion succeeds
 * @param {number|null} props.existingShuffledPlaylistCount - Count of existing shuffled playlists
 */
const SidebarActionButtonsCard = ({ 
    onDeleteSuccess,
    existingShuffledPlaylistCount 
}) => {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '100%',
                backgroundColor: '#181818',
                borderRadius: '5px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                height: 'auto'
            }}
        >
            {/* Analyse Library Button */}
            <Button
                component={Link}
                to="/analysis"
                variant="contained"
                fullWidth
                sx={{
                    color: 'white',
                    bgcolor: "#1DB954",
                    mb: 1,
                    '&:hover': {
                        bgcolor: "#1ed760"
                    }
                }}
            >
                Analyse Library
            </Button>

            {/* Share Library Button */}
            <Button
                component={Link}
                to="/share"
                variant="contained"
                fullWidth
                sx={{
                    color: 'white',
                    bgcolor: "#1DB954",
                    mb: existingShuffledPlaylistCount != null && existingShuffledPlaylistCount > 0 ? 1 : 0,
                    '&:hover': {
                        bgcolor: "#1ed760"
                    }
                }}
            >
                Share Library
            </Button>

            {/* Delete Button - only show if existing_shuffled_playlist_count exists and is not 0 */}
            {existingShuffledPlaylistCount != null && existingShuffledPlaylistCount > 0 && (
                <>
                    <Divider sx={{ bgcolor: '#333', my: 1 }} />
                    <DeleteShuffledPlaylistsButton 
                        onDeleteSuccess={onDeleteSuccess} 
                        playlistCount={existingShuffledPlaylistCount}
                    />
                </>
            )}
        </Card>
    );
};

export default SidebarActionButtonsCard;

