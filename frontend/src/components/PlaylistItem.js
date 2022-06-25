import React from "react"

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const PlaylistItem = (props) => {
    const theme = useTheme();

    return (
        <Grid item>
            <Card  sx={{display: 'flex', padding:"16px", background:"#181818"}}>
                <CardMedia
                    component="img"
                    sx={{width: 151}}
                    image="/static/images/cards/live-from-space.jpg"
                    alt="Live from space album cover"
                />
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        {props.playlist.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {props.playlist.owner.displayName}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}
export default PlaylistItem