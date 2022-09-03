import React from "react";
import ErrorMessage from "./ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import * as StatusCodes from "http-status-codes";
import {getAccessTokenUsingRefreshCall} from "../utils/SpotifyAuthService";
import ShufflePlaylistResponse from "./ShufflePlaylistResponse";
import ShuffleLoading from "./ShuffleLoading";

class ShufflePlaylistContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  useQuery = () => {
    return new URLSearchParams(window.location.search);
  }

  getShuffleCall = () => {
    this.setState({isLoading: true, isError: false});

    if (!(this.useQuery().get('playlistId') == null || this.useQuery().get('playlistId') === "")) {
      // Get selected playlist info
      axios.post(process.env.REACT_APP_BACKEND_PATH + `/playlist/get-playlist-info`,
        {
          playlistId: this.useQuery().get('playlistId'),
          spotifyAccessToken: localStorage.getItem('accessToken')
        }).then(result => {
        console.log(result.data);
        this.setState({
          selectedPlaylist: result.data.playlist,
          isLoading: false,
          isError: false
        });

        // Call shuffle
        axios
          .post(process.env.REACT_APP_BACKEND_PATH + `/playlist/shuffle`,
            {
              isUseLikedTracks: "false",
              playlistId: this.useQuery().get('playlistId'),
              isMakeNewPlaylist: "false",
              spotifyAccessToken: localStorage.getItem('accessToken')
            },
            {headers:{"Content-Type" : "application/json"}})
          .then(result => {
            console.log(result.data);
            this.setState({
              playlistUrl: result.data.playlistUrl,
              isLoading: false,
              isError: false
            });
          })
          .catch(error => {
            if (error.code === "ERR_NETWORK") {
              this.setState({
                error,
                isLoading: false,
                isError: true
              })
            } else {
              let errorObject = error.response.data;
              let errorStatus = errorObject.status;
              if (errorStatus === StatusCodes.UNAUTHORIZED) {
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

      }).catch(error => {
        if (error.code === "ERR_NETWORK") {
          this.setState({
            error,
            isLoading: false,
            isError: true
          })
        } else {
          let errorObject = error.response.data;
          let errorStatus = errorObject.status;
          if (errorStatus === StatusCodes.UNAUTHORIZED) {
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
    } else {
      // Handle empty playlist id
      this.setState({
        error: {message: "No playlist selected"},
        isLoading: false,
        isError: true
      })
    }
  };

  state = {
    isLoading: false,
    isError: false
  };

  componentDidMount() {
    this.getShuffleCall();
    // this.timer = setInterval(() => {
    //     this.props.history.push('/playlists')
    //   },
    //   60000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const isError = this.state.isError;

    console.log(this.state)
    return (
      <div>
        {isError ? (
          <ErrorMessage error={this.state.error}/>
        ) : (
          this.state.playlistUrl != null ? (
            <ShufflePlaylistResponse playlistUrl={this.state.playlistUrl}/>
          ) : (
            this.state.selectedPlaylist != null ? (
              <ShuffleLoading playlist={this.state.selectedPlaylist}/>
            ) : (
              <CircularProgress/>
            )
          )
        )}
      </div>
    )
  }
}

export default ShufflePlaylistContainer