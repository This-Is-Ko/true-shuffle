import React from "react"
import axios from "axios";

import PlaylistList from "./PlaylistList";
import {getAccessTokenUsingRefreshCall, getPlaylists} from "../utils/SpotifyAuthService";
import * as StatusCodes from "http-status-codes";

class PlaylistContainer extends React.Component {

  getPlaylistsCall = () => {
    this.setState({ isLoading: true });

    axios
      .post(`http://localhost:8080/playlist/my-playlists`,
        {
          spotifyAccessToken: localStorage.getItem('accessToken'),
          spotifyRefreshToken: localStorage.getItem('refreshToken')
        })
      .then(result => {
        console.log(result.data);
        this.setState({
          playlists: result.data.allPlaylists,
          isLoading: false
        });
      })
      .catch(error => {
        let errorObject = error.response.data;
        let errorStatus = errorObject.status;
        if (errorStatus === StatusCodes.UNAUTHORIZED){
          getAccessTokenUsingRefreshCall();
        } else {
          this.setState({
            error,
            isLoading: false
          })
        }
      });
  };

  state = {
    playlists: [],
    isLoading: false
  };

  componentDidMount() {
    this.getPlaylistsCall();
  }

  render() {
    return (
      <div>
        <PlaylistList playlists={this.state.playlists}/>
      </div>
    )
  }
}
export default PlaylistContainer