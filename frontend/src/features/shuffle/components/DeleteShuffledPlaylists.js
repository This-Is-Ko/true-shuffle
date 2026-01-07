import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, CircularProgress, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from "../../../utils/apiClient";
import { OPERATION_TYPES } from "../../../contexts/CorrelationIdContext";

const DeleteShuffledPlaylistsButton = ({ onDeleteSuccess, playlistCount }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        setError(false);
        setIsSuccess(false);
    };

    const handleClose = () => {
        if (!isLoading) {
            setOpen(false);
        }
    };

    const handleDelete = () => {
        setIsLoading(true);
        setError(false);
        setIsSuccess(false);

        apiClient
            .delete(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/delete`, { operationType: OPERATION_TYPES.DELETE })
            .then(result => {
                setIsLoading(false);
                setIsSuccess(true);
                setError(false);
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
                // Close dialog after a brief delay
                setTimeout(() => {
                    setOpen(false);
                    setIsSuccess(false);
                }, 4000);
            })
            .catch(error => {
                setIsLoading(false);
                setError(true);
                setIsSuccess(false);
            });
    };

    return (
        <Box sx={{ width: '100%', mt: 1 }}>
            <Button
                variant="contained"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={handleClickOpen}
                sx={{
                    color: "white",
                    bgcolor: "#d32f2f",
                    '&:hover': {
                        bgcolor: "#c62828",
                    }
                }}
            >
                Delete {playlistCount} shuffled playlist{playlistCount !== 1 ? 's' : ''}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                PaperProps={{
                    sx: {
                        bgcolor: '#292e2f',
                    }
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ color: "white" }}>
                    Delete {playlistCount} Shuffled Playlist{playlistCount !== 1 ? 's' : ''}
                </DialogTitle>
                <DialogContent>
                    {isSuccess ? (
                        <DialogContentText id="delete-dialog-description" sx={{ color: "white" }}>
                            <Typography variant="body1" sx={{ color: "white", fontWeight: 'bold' }}>
                                Successfully deleted {playlistCount} shuffled playlist{playlistCount !== 1 ? 's' : ''}!
                            </Typography>
                        </DialogContentText>
                    ) : error ? (
                        <DialogContentText id="delete-dialog-description" sx={{ color: "white" }}>
                            <Typography variant="body1" sx={{ color: "#d32f2f" }}>
                                Unable to connect to Spotify, please try again later.
                            </Typography>
                        </DialogContentText>
                    ) : (
                        <DialogContentText id="delete-dialog-description" sx={{ color: "white" }}>
                            This will remove {playlistCount} playlist{playlistCount !== 1 ? 's' : ''} named "[Shuffled] ..." from your Spotify account.
                            This will not affect any of your existing playlists and only delete playlists created by True Shuffle.
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: "#1DB954" }} />
                    ) : (
                        <>
                            <Button onClick={handleClose} sx={{ color: isSuccess ? "#1DB954" : "white" }}>
                                {isSuccess ? "Close" : "Cancel"}
                            </Button>
                            {!isSuccess && (
                                <Button onClick={handleDelete} sx={{ color: "#d32f2f" }} autoFocus>
                                    Delete
                                </Button>
                            )}
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteShuffledPlaylistsButton;

