import apiClient from './apiClient';
import { OPERATION_TYPES } from '../contexts/CorrelationIdContext';

import RestrictedAccessPage from '../pages/RestrictedAccessPage'
import RedirectBackdrop from '../features/common/RedirectBackdrop'

const AUTH_CODE_URL = process.env.REACT_APP_BACKEND_PATH + "/api/spotify/auth/code";
const LOGOUT_URL = process.env.REACT_APP_BACKEND_PATH + "/api/spotify/auth/logout";

export function getLoginUriApi(setLoginUri) {
  console.debug("Retrieving login uri")
  apiClient.get(process.env.REACT_APP_BACKEND_PATH + `/api/spotify/auth/login`, { operationType: OPERATION_TYPES.GENERAL })
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
      apiClient.post(AUTH_CODE_URL,
        {
          code: code
        },
        { operationType: OPERATION_TYPES.GENERAL }
      ).then(result => {
        console.log(result)
        setIsAuth(true);
        setLoadingAccessToken(false)
        setShowSuccessMessage(true)
        
        // Use selected page to redirect otherwise go to main
        const redirectTo = localStorage.getItem("postSpotifyAuthRedirect")
        localStorage.removeItem("postSpotifyAuthRedirect");
        if (redirectTo !== null && redirectTo !== "") {
          navigate(redirectTo);
        } else {
          navigate("/");
        }
      }).catch(error => {
        localStorage.removeItem("postSpotifyAuthRedirect");
        setLoadingAccessToken(false)
        setAccessTokenError(true)
      });
    }
  }
}

export const checkPageAccessAndRedirect = (auth, loginUri, targetPage) => {
  if (auth === false) {
    if (loginUri !== null && targetPage !== null) {
        // Set up redirect page after Spotify auth succeeds
        localStorage.setItem("postSpotifyAuthRedirect", targetPage);        
        return (
            <main>
                <RedirectBackdrop loginUri={loginUri}/>
            </main>
        )
    }
    // Fallback if loginUri or targetPage isn't set
    return (
        <main>
            <RestrictedAccessPage />
        </main>
    )
  }
}

export const logoutUser = (setAuth) => {
  apiClient.post(LOGOUT_URL,
    {},
    { operationType: OPERATION_TYPES.GENERAL }
  ).then(result => {
    setAuth(false)
  }).catch(error => {
    setAuth(false)
  });
}