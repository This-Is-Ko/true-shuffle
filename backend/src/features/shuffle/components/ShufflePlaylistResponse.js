import React from "react";
import Button from "@mui/material/Button";
import { Typography, Grid, Box } from "@mui/material";

class ShufflePlaylistResponse extends React.Component {
    render() {
        return (
            <Box
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant='h4' component="div" sx={{ paddingBottom: "10px", color: "white" }}>
                    Playlist shuffled!
                </Typography>
                <img className="about-image"
                    src={process.env.PUBLIC_URL + '/assets/images/headset.png'} alt={"listening to music"} />
                <Grid
                    sx={{ paddingTop: "20px", width: "100%", margin: "auto" }}
                    container
                    spacing={2}
                    justifyContent="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2, color: 'white', bgcolor: "#1DB954",
                                width: "30rem", maxWidth: "300px"
                            }}
                            href={this.props.playlistUri} target="_blank">
                            Open shuffled playlist
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2, color: 'white', bgcolor: "#1DB954",
                                width: "30rem", maxWidth: "300px"
                            }}
                            href="/shuffle">
                            Shuffle another playlist
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant='subtitle1' component="div" sx={{ paddingBottom: "5px", color: "white" }}>
                    If you like to shuffle this playlist often, bookmark this page to directly shuffle it.
                </Typography>
            </Box>
        )
    }
}

export default ShufflePlaylistResponse
