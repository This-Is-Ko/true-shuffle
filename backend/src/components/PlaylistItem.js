import React from "react"

import {useTheme} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Button from "@mui/material/Button";

const PlaylistItem = (props) => {
  const theme = useTheme();

  return (
    <Grid item>
      <Card sx={{
        padding: "16px",
        background: "#181818",
        "borderRadius": "5px",
        "height": "auto",
        "maxHeight": "355px",
        "width": "auto",
        "maxWidth": "250px"
      }}>
        <CardMedia
          component="img"
          sx={{"width": "auto", "maxWidth": "250px"}}
          image={props.playlist.images[0].url}
          alt={props.playlist.name}
        />
        <CardContent sx={{flex: '1 0 auto'}}>
          <Typography component="div" variant="h5" color="common.white" sx={{
            "fontSize": "1rem", "overflow": "hidden", "textOverflow": "ellipsis", display: "inline-block", "maxWidth": "230px", "whiteSpace": "nowrap"
          }}>
            {props.playlist.name}
          </Typography>
          <Typography variant="subtitle1" color="common.white" component="div"
                      sx={{"fontSize": "0.85rem", "overflow": "hidden", "textOverflow": "ellipsis", "maxWidth": "230px", "whiteSpace": "nowrap", "paddingBottom": "5px"}}>
            {props.playlist.owner.displayName}
          </Typography>
          <Button variant="contained" href={"/shuffle?playlistId=" + props.playlist.id}
                  startIcon={<ShuffleIcon/>}>Shuffle</Button>
        </CardContent>
      </Card>
    </Grid>
  );
}
export default PlaylistItem