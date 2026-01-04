import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Card, CardContent, IconButton, Box, Tooltip } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FeatureScoreItem = ({ featureScoreData }) => {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Mapping of feature names to their tooltip descriptions
    const featureDescriptions = {
        "acousticness": "Measures how likely a track is to be acoustic. Scale: 0.0 to 1.0\n\nWhat it means: A higher value indicates a higher confidence that the track was created with acoustic instruments rather than electronic or synthesized sounds.",
        "danceability": "Describes how suitable a track is for dancing. Scale: 0.0 to 1.0\n\nWhat it means: This is calculated based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A score of 1.0 is the most danceable.",
        "energy": "Represents a perceptual measure of intensity and activity. Scale: 0.0 to 1.0\n\nWhat it means: Energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach solo cello prelude scores low.",
        "valence": "Measures the \"musical positiveness\" or mood of a track. Scale: 0.0 to 1.0\n\nWhat it means: Tracks with high valence sound more positive (happy, cheerful, euphoric), while tracks with low valence sound more negative (sad, depressed, angry).",
        "instrumentalness": "Predicts whether a track contains no vocals. Scale: 0.0 to 1.0\n\nWhat it means: Values above 0.5 suggest the track is instrumental. Note that \"ooh\" and \"aah\" sounds are treated as instrumental, whereas spoken word or rap are considered \"vocal.\"",
        "speechiness": "Detects the presence of spoken words in a track. Scale: 0.0 to 1.0\n\nWhat it means:\n• > 0.66: Likely a talk show, audiobook, or podcast.\n• 0.33 to 0.66: May contain both music and speech (e.g., rap music).\n• < 0.33: Represents music and other non-speech-like tracks.",
        "liveness": "Detects the presence of an audience in the recording. Scale: 0.0 to 1.0\n\nWhat it means: Higher values indicate a higher probability that the track was performed live. A value above 0.8 represents a very strong likelihood that the track is a live recording.",
        "tempo": "The overall estimated speed or pace of a track. Unit: Beats Per Minute (BPM)\n\nWhat it means: This is the average beat duration throughout the song.",
        "loudness": "The overall volume of a track. Unit: Decibels (dB)\n\nWhat it means: Values are averaged across the entire track. Typical values range between -60 and 0 dB; the closer to 0, the louder the song.",
        "key": "The estimated musical key and scale type of the track.\n\nWhat it means:\n• Key: Maps to standard Pitch Class notation (e.g., 0 = C, 1 = C♯/D♭, 2 = D, etc.).\n• Mode: Indicates the modality (1 = Major, 0 = Minor).",
        "mode": "The estimated musical key and scale type of the track.\n\nWhat it means:\n• Key: Maps to standard Pitch Class notation (e.g., 0 = C, 1 = C♯/D♭, 2 = D, etc.).\n• Mode: Indicates the modality (1 = Major, 0 = Minor).",
        "time_signature": "An estimate of how many beats are in each bar. Scale: Typically ranges from 3 to 7.\n\nWhat it means: This indicates the meter of the song (e.g., a value of 4 represents a standard 4/4 time signature).",
        "duration": "The total length of the track. Unit: Milliseconds (ms)\n\nWhat it means: On a website, this is typically converted into a minutes and seconds format (MM:SS) for readability."
    };

    const featureName = featureScoreData["feature_name"].toLowerCase();
    const tooltipText = featureDescriptions[featureName] || "";

    return (
        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{
                textAlign: "left",
                backgroundColor: "#1DB954",
                borderRadius: "5px",
                height: "auto",
                maxHeight: "360px",
                width: "auto",
                maxWidth: "270px",
                minWidth: "270px",
                position: "relative"
            }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 }}>
                        <Typography sx={{ fontFamily: "'Questrial', sans-serif;" }} variant="subtitle1" color="text.secondary" gutterBottom>
                            <strong>{capitalizeFirstLetter(featureScoreData["feature_name"])}</strong>
                        </Typography>
                        {tooltipText && (
                            <Tooltip title={tooltipText} arrow placement="top">
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: "black",
                                        padding: "2px",
                                        marginLeft: 1,
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.1)"
                                        }
                                    }}
                                >
                                    <HelpOutlineIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    <Typography sx={{ color: "white", textAlign: "center" }} variant="h3" component="div">
                        <strong>{featureScoreData["highest_feature_score"]["value"]}</strong>
                    </Typography>
                    <Typography variant="body2" color="black">
                        Highest value
                    </Typography>
                    <Typography sx={{ color: "white", textAlign: "center" }} variant="h3" component="div">
                        <strong>{featureScoreData["lowest_feature_score"]["value"]}</strong>
                    </Typography>
                    <Typography variant="body2" color="black">
                        Lowest value
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default FeatureScoreItem;