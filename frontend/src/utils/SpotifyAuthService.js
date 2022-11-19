import axios from "axios";

const AUTH_CODE_URL = process.env.REACT_APP_BACKEND_PATH + "/api/spotify/auth/code";
const REFRESH_TOKEN_URL = process.env.REACT_APP_BACKEND_PATH + "/auth/spotify/handle-refresh-token?refreshToken=";

export function getLoginUriApi(setLoginUri) {
  console.debug("Retrieving login uri")
  axios.get(process.env.REACT_APP_BACKEND_PATH + `/api/spotify/auth/login`)
    .then(result => {
      setLoginUri(result.data.loginUri)
    })
    .catch(error => {
      console.debug("Error while retrieving login uri" + error)
      if (error.code === "ERR_NETWORK") {
        setLoginUri("/#")
      } else {
        setLoginUri("/#")
      }
    });
}

export const getAccessTokenCall = (code, setAuth, navigate, setLoadingAccessToken, setAccessTokenError, setShowSuccessMessage) => {
  if (localStorage.getItem('accessToken') == null) {
    if (code != null) {
      setLoadingAccessToken(true)
      axios.post(AUTH_CODE_URL,
        {
          code: code
        }
      )
        .then(result => {
          localStorage.setItem('accessToken', result.data.access_token);
          localStorage.setItem('refreshToken', result.data.refresh_token);
          localStorage.setItem('expiresAt', result.data.expires_at);
          localStorage.setItem('scope', result.data.scope);
          localStorage.setItem('tokenType', result.data.token_type);
          setAuth(true);
          navigate("/");
          setLoadingAccessToken(false)
          setShowSuccessMessage(true)
        })
        .catch(error => {
          // console.log(error)
          setLoadingAccessToken(false)
          setAccessTokenError(true)
        }
        );
    }
  }
}

export function getAccessTokenUsingRefreshCall() {
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
