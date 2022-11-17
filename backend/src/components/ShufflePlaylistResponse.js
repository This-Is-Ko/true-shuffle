import React from "react";
import Button from "@mui/material/Button";
import { Typography, Grid } from "@mui/material";

class ShufflePlaylistResponse extends React.Component {
    render() {
        return (
            <div>
                <Typography variant='h4' component="div" sx={{ paddingBottom: "10px", color: "white" }}>
                    Finished shuffling your playlist
                </Typography>
                <img className="about-image"
                    src={process.env.PUBLIC_URL + '/assets/images/headset.png'} alt={"listening to music"} />
                <Grid
                    sx={{ paddingTop: "20px", margin: "0 auto" }}
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="flex-start">
                    <Grid item>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                my: 2, color: 'white', bgcolor: "#1DB954",
                                "&:hover": { backgroundColor: "#ac2ca5" },
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
                                "&:hover": { backgroundColor: "#ac2ca5" },
                            }}
                            href="/shuffle">
                            Shuffle another playlist
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ShufflePlaylistResponse
