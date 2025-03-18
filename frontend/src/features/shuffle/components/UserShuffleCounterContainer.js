import React, { useState } from "react";
import ListIcon from '@mui/icons-material/List';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { Chip, Stack, Tooltip, ClickAwayListener  } from "@mui/material";

const UserShuffleCounterContainer = ({ userShuffleCounter }) => {
  const [openPlaylistTooltip, setOpenPlaylistTooltip] = useState(false);
  const [openTrackTooltip, setOpenTrackTooltip] = useState(false);

  return (
      <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          sx={{ flexWrap: "wrap", maxWidth: "400px", margin: "auto" }}
      >
          {/* Playlist Count Chip */}
          <ClickAwayListener onClickAway={() => setOpenPlaylistTooltip(false)}>
              <Tooltip 
                  title="Number of playlists shuffled" 
                  arrow 
                  open={openPlaylistTooltip}
                  onClose={() => setOpenPlaylistTooltip(false)}
              >
                  <Chip 
                      icon={<ListIcon sx={{ color: "#1DB954" }} />}
                      label={`${userShuffleCounter.playlist_count}`} 
                      sx={{ backgroundColor: "#232323", color: "#FFF" }}
                      onClick={() => setOpenPlaylistTooltip(!openPlaylistTooltip)}
                  />
              </Tooltip>
          </ClickAwayListener>

          {/* Track Count Chip */}
          <ClickAwayListener onClickAway={() => setOpenTrackTooltip(false)}>
              <Tooltip 
                  title="Number of tracks shuffled" 
                  arrow 
                  open={openTrackTooltip}
                  onClose={() => setOpenTrackTooltip(false)}
              >
                  <Chip 
                      icon={<AudiotrackIcon sx={{ color: "#1DB954" }} />}
                      label={`${userShuffleCounter.track_count}`} 
                      sx={{ backgroundColor: "#232323", color: "#FFF" }}
                      onClick={() => setOpenTrackTooltip(!openTrackTooltip)}
                  />
              </Tooltip>
          </ClickAwayListener>
      </Stack>
  );
};


export default UserShuffleCounterContainer;
