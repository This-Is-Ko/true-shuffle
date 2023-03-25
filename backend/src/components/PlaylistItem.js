import React from "react"

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Typography, Button } from "@mui/material";

const PlaylistItem = (props) => {
    return (
        <Grid item>
            <Card sx={{
                padding: "16px",
                background: "#181818",
                "borderRadius": "5px",
                "height": "auto",
                "maxHeight": "360px",
                "width": "auto",
                "maxWidth": "250px"
            }}>
                <CardMedia
                    component="img"
                    sx={{ "width": "auto", "maxWidth": "250px" }}
                    image={props.playlist.images.url}
                    alt={props.playlist.name}
                />
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5" color="common.white" sx={{
                        "fontSize": "1rem", "overflow": "hidden", "textOverflow": "ellipsis", display: "inline-block", "maxWidth": "230px", "whiteSpace": "nowrap", fontFamily: "'Questrial', sans-serif;"
                    }}>
                        {props.playlist.name}
                    </Typography>
                    <Typography variant="subtitle1" color="common.white" component="div"
                        sx={{ "fontSize": "0.85rem", "overflow": "hidden", "textOverflow": "ellipsis", "maxWidth": "230px", "whiteSpace": "nowrap", "paddingBottom": "5px" }}>
                        {props.playlist.owner.display_name}
                    </Typography>
                    <Button variant="contained"
                        // onClick={() => { props.selectPlaylist(props.playlist.id, props.playlist.name) }}
                        href={"/shuffle/playlist?playlistId=" + props.playlist.id + "&playlistName=" + props.playlist.name}
                        sx={{ color: 'white', bgcolor: "#1DB954" }}
                        startIcon={<ShuffleIcon />}>Shuffle</Button>
                </CardContent>
            </Card>
        </Grid>
    );
}
export default PlaylistItem