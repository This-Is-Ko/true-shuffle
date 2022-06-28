import React from "react"
import axios from "axios";

import PlaylistList from "./PlaylistList";
import {getAccessTokenUsingRefreshCall, getPlaylists} from "../utils/SpotifyAuthService";
import * as StatusCodes from "http-status-codes";
import ErrorMessage from "./ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";

class PlaylistContainer extends React.Component {

  getPlaylistsCall = () => {
    this.setState({ isLoading: true, isError: false });

    axios
      .post(process.env.REACT_APP_BACKEND_PATH +`/playlist/my-playlists`,
        {
          spotifyAccessToken: localStorage.getItem('accessToken')
        })
      .then(result => {
        console.log("THEN>>>" + result.data);
        this.setState({
          playlists: result.data.allPlaylists,
          isLoading: false,
          isError: false
        });
      })
      .catch(error => {
        console.log(error);
        if (error.code === "ERR_NETWORK"){
          this.setState({
            error,
            isLoading: false,
            isError: true
          })
        } else {
          let errorObject = error.response.data;
          let errorStatus = errorObject.status;
          if (errorStatus === StatusCodes.UNAUTHORIZED){
            getAccessTokenUsingRefreshCall();
          } else {
            this.setState({
              error,
              isLoading: false,
              isError: true
            })
          }
        }
      });
  };

  state = {
    playlists: [],
    isLoading: false,
    isError: false
  };

  componentDidMount() {
    this.getPlaylistsCall();
  }

  render() {
    const isError = this.state.isError;

    return (
      <div>
        {isError ? (
          <ErrorMessage error={this.state.error}/>
        ) : (
          this.state.playlists.length > 0?(
            <PlaylistList playlists={this.state.playlists}/>
          ):(
            <CircularProgress />
          )
        )}
      </div>
    )
  }
}
export default PlaylistContainer