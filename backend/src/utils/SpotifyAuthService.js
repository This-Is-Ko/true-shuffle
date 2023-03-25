import axios from "axios";

const AUTH_CODE_URL = process.env.REACT_APP_BACKEND_PATH + "/api/spotify/auth/code";
const LOGOUT_URL = process.env.REACT_APP_BACKEND_PATH + "/api/spotify/auth/logout";

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

export const getAccessTokenCall = (code, setIsAuth, navigate, setLoadingAccessToken, setAccessTokenError, setShowSuccessMessage) => {
  const accessToken = document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'));

  if (!accessToken) {
    if (code != null) {
      setLoadingAccessToken(true)
      axios.post(AUTH_CODE_URL,
        {
          code: code
        },
        { withCredentials: true }
      ).then(result => {
        setIsAuth(true);
        navigate("/");
        setLoadingAccessToken(false)
        setShowSuccessMessage(true)
      }).catch(error => {
        setLoadingAccessToken(false)
        setAccessTokenError(true)
      });
    }
  }
}

export const logoutUser = (setAuth) => {
  axios.post(LOGOUT_URL,
    {},
    { withCredentials: true }
  ).then(result => {
    setAuth(false)
  }).catch(error => {
    setAuth(false)
  });
}