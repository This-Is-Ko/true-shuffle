import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {getAccessTokenCall} from "../utils/SpotifyAuthService";
import Button from "@mui/material/Button";
import axios from "axios";

const Main = () => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
  const [loginUri, setLoginUri] = React.useState("/#");

  function getLoginUriApi() {

    axios.get(process.env.REACT_APP_BACKEND_PATH + `/auth/spotify/auth-login`)
      .then(result => {
        // console.log(result.data.loginUri);
        setLoginUri(result.data.loginUri)
      })
      .catch(error => {
        if (error.code === "ERR_NETWORK") {
          setLoginUri("/error")
        } else {
          setLoginUri("/error")
        }
      });
  };

  function useQuery() {
    return new URLSearchParams(window.location.search);
  }

  useEffect(() => {
    getAccessTokenCall(useQuery().get('code'), setAuth);
    getLoginUriApi();
  });

  return (
    <>
      <main>
        <nav>
          {auth ?
            <Link to="/playlists">Playlists</Link>
            :
            <div>
              <h1 className={"mainTitle"}>Welcome to True Shuffle</h1>
              <div className={"centerSpacingContainer"}>
                <Button
                  className={"largeButton"}
                  onClick={""}
                  variant="contained"
                  disableElevation
                  sx={{my: 2, color: 'white', display: 'block'}}
                  href={loginUri}
                >Try it now</Button>
              </div>

              <div className={"homepageIconHolder"}>
                <div>
                  <img className={"homepageIcon"}
                       src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"login image"}/>
                  <h2>Login to Spotify</h2>
                  <p></p>
                </div>
                <div>
                  <img className={"homepageIcon"}
                       src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"shuffle image"}/>
                  <h2>Select playlist to shuffle</h2>
                  <p></p>
                </div>
                <div>
                  <img className={"homepageIcon"}
                       src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"music image"}/>
                  <h2>Start listening</h2>
                  <p></p>
                </div>
              </div>
            </div>
          }
        </nav>
      </main>

    </>
  );
}

export default Main;
