import React, { useState } from "react";
import { Box, Button, Typography, TextField, Accordion, AccordionSummary, AccordionDetails, Stack } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SidebarCard from "./SidebarCard";

const FilteredLikedSongsShuffle = () => {
    const [expanded, setExpanded] = useState(false);
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [yearReleasedMin, setYearReleasedMin] = useState("");
    const [yearReleasedMax, setYearReleasedMax] = useState("");
    const [yearAddedMin, setYearAddedMin] = useState("");
    const [yearAddedMax, setYearAddedMax] = useState("");

    const handleAccordionChange = (event, isExpanded) => {
        setExpanded(isExpanded);
    };

    const handleShuffle = () => {
        // TODO: Implement API call when backend supports filter parameters
        // This is a placeholder for future implementation
        console.log("Filtered shuffle:", {
            artist,
            genre,
            yearReleasedMin,
            yearReleasedMax,
            yearAddedMin,
            yearAddedMax
        });
        // Placeholder: Show alert that this feature is coming soon
        alert("Filtered shuffle feature coming soon!");
    };

    const hasFilters = artist || genre || yearReleasedMin || yearReleasedMax || yearAddedMin || yearAddedMax;

    return (
        <SidebarCard>
            <Accordion
                expanded={expanded}
                onChange={handleAccordionChange}
                sx={{
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    sx={{ color: "white", minHeight: '48px', '& .MuiAccordionSummary-content': { my: 0 } }}
                >
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            letterSpacing: '0.01em'
                        }}
                    >
                        Filter & Shuffle
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        <TextField
                            label="Artist"
                            variant="outlined"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: '#555',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#777',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1DB954',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#aaa',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1DB954',
                                },
                            }}
                        />

                        <TextField
                            label="Genre"
                            variant="outlined"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: '#555',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#777',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1DB954',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#aaa',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1DB954',
                                },
                            }}
                        />

                        <Box>
                            <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                                Year Released
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    label="Min"
                                    variant="outlined"
                                    type="number"
                                    value={yearReleasedMin}
                                    onChange={(e) => setYearReleasedMin(e.target.value)}
                                    size="small"
                                    sx={{
                                        flex: 1,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: '#555',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#777',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1DB954',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#aaa',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1DB954',
                                        },
                                    }}
                                />
                                <TextField
                                    label="Max"
                                    variant="outlined"
                                    type="number"
                                    value={yearReleasedMax}
                                    onChange={(e) => setYearReleasedMax(e.target.value)}
                                    size="small"
                                    sx={{
                                        flex: 1,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: '#555',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#777',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1DB954',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#aaa',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1DB954',
                                        },
                                    }}
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                                Year Added to Liked Songs
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    label="Min"
                                    variant="outlined"
                                    type="number"
                                    value={yearAddedMin}
                                    onChange={(e) => setYearAddedMin(e.target.value)}
                                    size="small"
                                    sx={{
                                        flex: 1,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: '#555',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#777',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1DB954',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#aaa',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1DB954',
                                        },
                                    }}
                                />
                                <TextField
                                    label="Max"
                                    variant="outlined"
                                    type="number"
                                    value={yearAddedMax}
                                    onChange={(e) => setYearAddedMax(e.target.value)}
                                    size="small"
                                    sx={{
                                        flex: 1,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: '#555',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#777',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1DB954',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#aaa',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1DB954',
                                        },
                                    }}
                                />
                            </Stack>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<ShuffleIcon />}
                            onClick={handleShuffle}
                            disabled={!hasFilters}
                            sx={{
                                color: "white",
                                bgcolor: "#1DB954",
                                '&:hover': {
                                    bgcolor: "#1ed760",
                                },
                                '&:disabled': {
                                    bgcolor: '#555',
                                    color: '#999',
                                }
                            }}
                        >
                            Shuffle Filtered Liked Songs
                        </Button>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </SidebarCard>
    );
};

export default FilteredLikedSongsShuffle;

