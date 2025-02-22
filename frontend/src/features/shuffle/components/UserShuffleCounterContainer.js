import React from "react";
import { Grid } from "@mui/material";
import OverallStatItemCard from "../../../components/analysisPageComponents/OverallStatItemCard";

const UserShuffleCounterContainer = ({ userShuffleCounter }) => {
    return (
        <Grid
            sx={{
                margin: { sm: "auto", md: "0 auto", },
                maxWidth: "600px",
            }}
            container
            spacing={1}
            justifyContent="center"
            alignItems="flex-start"
        >
            <OverallStatItemCard 
                title={"Playlists"} 
                stat={userShuffleCounter.playlist_count} 
                description={"Total number of playlists you've shuffled using True Shuffle"}
            />
            <OverallStatItemCard
                title={"Tracks"}
                stat={userShuffleCounter.track_count}
                description={"Total number of tracks you've shuffled using True Shuffle"}
            />
        </Grid>
    );
}

export default UserShuffleCounterContainer;