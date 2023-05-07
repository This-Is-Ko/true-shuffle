import React from "react";
import { Box, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";

const TrackStatCard = ({ title, stat, description, track }) => {

    function getArtists(artists) {
        let numArtists = 0
        let artistNames = ""
        console.log(artists)
        for (const artist of artists){
            numArtists +=1;
            if (numArtists == 1){
                artistNames = artist["name"]
            } else {
                artistNames += ", " + artist["name"]
            }
        }
        return artistNames
    }

    if (track == null) {
        return null
    }

    return (
        <Grid item>
            <Card sx={{
                textAlign: "left",
                backgroundColor: "#1DB954",
                borderRadius: "5px",
                height: "auto",
                maxHeight: "360px",
                width: "auto",
                maxWidth: "400px",
                minWidth: { sm: "300px", md: "400px", }
            }}>
                <CardContent>
                    <Typography sx={{ fontFamily: "'Questrial', sans-serif;" }} variant="subtitle1" color="text.secondary" gutterBottom>
                        <strong>{title}</strong>
                    </Typography>
                    <Typography sx={{ color: "white", textAlign: "center" }} variant="h3" component="div">
                        <strong>{stat}</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                        <Box sx={{ paddingLeft: '10px', width: '70%' }} >
                            <Typography noWrap variant="h5" color="white">
                                <strong>{track["title"]}</strong>
                            </Typography>
                            <Typography noWrap variant="body2" color="white">
                                Artist(s): {getArtists(track["artists"])}
                            </Typography>
                            <Typography noWrap variant="body2" color="white">
                                Album: {track["album"]["name"]}
                            </Typography>
                        </Box>
                        <Box sx={{ width: '25%' }} >
                            <CardMedia
                                component="img"
                                image={track["album"]["image_url"]}
                                alt="Album cover"
                            />
                        </Box>
                    </Box>
                    <Typography sx={{ paddingTop: '10px'}} variant="body2" color="black">
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default TrackStatCard;