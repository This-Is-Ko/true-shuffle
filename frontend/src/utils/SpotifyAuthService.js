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
        },
        { withCredentials: true }
      )
        .then(result => {
          setAuth(true);
          navigate("/");
          setLoadingAccessToken(false)
          setShowSuccessMessage(true)
        })
        .catch(error => {
          setLoadingAccessToken(false)
          setAccessTokenError(true)
        }
        );
    }
  }
}
