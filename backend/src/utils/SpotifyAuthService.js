import axios from "axios";

const AUTH_CODE_URL = process.env.REACT_APP_BACKEND_PATH + "/auth/spotify/handle-auth-code?code=";
const REFRESH_TOKEN_URL = process.env.REACT_APP_BACKEND_PATH + "/auth/spotify/handle-refresh-token?refreshToken=";

export function getAccessTokenCall (code, setAuth) {
  if (localStorage.getItem('accessToken') == null) {
    if (code != null){
      console.log(code)
      axios.get(AUTH_CODE_URL + code)
        .then(result => {
          console.log(result)
          localStorage.setItem('accessToken', result.data.spotifyAccessToken);
          localStorage.setItem('refreshToken', result.data.spotifyRefreshToken);
        })
        .catch(error => {
            console.log(error)
          }
        );
      setAuth(true);
    }
  }
}

export function getAccessTokenUsingRefreshCall () {
  if (localStorage.getItem('refreshToken') != null) {
    axios.get(REFRESH_TOKEN_URL + localStorage.getItem('refreshToken'))
      .then(result => {
        // console.log(result)
        localStorage.setItem('accessToken', result.data.spotifyAccessToken);
        console.log("Retry...")
        // Refresh page after obtaining a new token
        window.location.reload(false);
        // callToRetry();
      })
      .catch(error => {
          console.log(error)
        }
      );
    }
}

// export function getPlaylists() {
//   if (localStorage.getItem('accessToken') != null) {
//     axios
//       .post(process.env.REACT_APP_BACKEND_PATH + `/playlist/my-playlists`,
//         {
//           spotifyAccessToken: localStorage.getItem('accessToken'),
//           spotifyRefreshToken: localStorage.getItem('refreshToken')
//         })
//       .then(result => {
//         console.log(result.data.allPlaylists);
//         this.setState({
//           playlists: result.data.allPlaylists,
//           isLoading: false
//         });
//       })
//       .catch(error => {
//           console.log(error)
//         }
//       );
//   }
// }
