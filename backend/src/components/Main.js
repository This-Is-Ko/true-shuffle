import React, {useEffect} from "react";
import {getAccessTokenCall} from "../utils/SpotifyAuthService";
import Button from "@mui/material/Button";

import loginIcon from '../images/loginIconWhite.png';
import headphonesIcon from '../images/headphonesIconWhite.png';
import shuffleIcon from '../images/shuffleIconWhite.png';


const Main = ({loginUri}) => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
  const [localLoginUri, setLocalLoginUri] = React.useState("/#");

  // function getLoginUriApi() {
  //   console.log("Retrieve login uri")
  //   if (loginUri === "/#"){
  //     axios.get(process.env.REACT_APP_BACKEND_PATH + `/auth/spotify/auth-login`)
  //       .then(result => {
  //         console.log("Dhat")
  //
  //         // console.log(result.data.loginUri);
  //         setLoginUri(result.data.loginUri)
  //       })
  //       .catch(error => {
  //         if (error.code === "ERR_NETWORK") {
  //           setLoginUri("/error")
  //         } else {
  //           setLoginUri("/error")
  //         }
  //       });
  //   }
  // };

  function useQuery() {
    return new URLSearchParams(window.location.search);
  }

  useEffect(() => {
    console.log("On page load")
    getAccessTokenCall(useQuery().get('code'), setAuth);
    setLocalLoginUri(loginUri)
  }, [loginUri]);

  return (
    <>
      <main>
          {auth ?
            <div>
              <h1 className={"mainTitle"}>Features</h1>
              <div className={"featuresContainer"}>
                <div className={"featureItem"}>
                  <h2>True Shuffle</h2>
                  <p>Shuffle your playlists easily</p>
                  {/*Demo with screenshots or gifs*/}
                  <div>
                    <p>Select playlist to shuffle</p>
                    <img className={"homepageIcon"}
                         src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"login"}/>
                    <p>In Spotify a new playlist will be created titled prefixed with [Shuffled]</p>
                    <img className={"homepageIcon"}
                         src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"login"}/>
                    <p>Ensure shuffle is turned off and start listening</p>
                    <img className={"homepageIcon"}
                         src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"login"}/>
                  </div>
                  <Button
                    onClick={""}
                    variant="contained"
                    disableElevation
                    sx={{my: 2, color: 'white', display: 'block', bgcolor: "#161817"}}
                    href={"/playlists"}
                  >Select</Button>
                </div>
                <div className={"featureItem"}>
                  <h2>Remove shuffled playlists</h2>
                  <p>Quickly remove custom shuffled playlists</p>
                  <Button
                    onClick={""}
                    variant="contained"
                    disableElevation
                    sx={{my: 2, color: 'white', display: 'block', bgcolor: "#161817"}}
                    href={"/#"}
                  >Select</Button>
                </div>
              </div>

            </div>
            :
            <div>
              <h1 className={"mainTitle"}>Welcome to True Shuffle</h1>
              <div className={"centerSpacingContainer"}>
                <Button
                  className={"largeButton"}
                  variant="contained"
                  disableElevation
                  sx={{my: 2, color: 'white', display: 'block', bgcolor: "#161817"}}
                  href={localLoginUri}
                >Get started</Button>
              </div>

              <div className={"homepageIconHolder"}>
                <div>
                  <img className={"homepageIcon"}
                       src={loginIcon} alt={"login"}/>
                  <h2 className={"homepageIconText"}>Login to Spotify</h2>
                  <p></p>
                </div>
                <div>
                  <img className={"homepageIcon"}
                       src={shuffleIcon} alt={"shuffle"}/>
                  <h2 className={"homepageIconText"}>Select playlist to shuffle</h2>
                  <p></p>
                </div>
                <div>
                  <img className={"homepageIcon"}
                       src={headphonesIcon} alt={"headphones"}/>
                  <h2 className={"homepageIconText"}>Start listening</h2>
                  <p></p>
                </div>
              </div>
            </div>
          }
      </main>

    </>
  );
}

export default Main;
