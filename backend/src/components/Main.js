import React, {useEffect} from "react";
import {getAccessTokenCall} from "../utils/SpotifyAuthService";
import Button from "@mui/material/Button";

import loginIcon from '../images/loginIconWhite.png';
import headphonesIcon from '../images/headphonesIconWhite.png';
import shuffleIcon from '../images/shuffleIconWhite.png';
import shuffleStep1 from '../images/shuffleStep1.gif';
import Box from "@mui/material/Box";


const Main = ({loginUri, isAuth, setIsAuth}) => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
  const [localLoginUri, setLocalLoginUri] = React.useState("/#");

  function useQuery() {
    return new URLSearchParams(window.location.search);
  }

  useEffect(() => {
    getAccessTokenCall(useQuery().get('code'), setIsAuth);
    // Set global values to local values
    setLocalLoginUri(loginUri)
    setAuth(isAuth);
    console.log(auth);
  }, [loginUri, isAuth]);

  return (
    <>
      <main>
        <div className={"mainTopContainer"}>
          <h1 className={"mainTitle"}>Welcome to True Shuffle</h1>
          <div className={"centerSpacingContainer"}>
            {
              auth ?
                <Button
                  className={"largeButton"}
                  variant="contained"
                  disableElevation
                  sx={{my: 2, color: 'white', display: 'block', bgcolor: "#1DB954",
                    '&:hover': {backgroundColor: '#1DB954'}
                  }}
                  href={"/playlists"}
                >Go to Shuffle</Button>
                :
                <Button
                  className={"largeButton"}
                  variant="contained"
                  disableElevation
                  sx={{my: 2, color: 'white', display: 'block', bgcolor: "#1DB954",
                    '&:hover': {backgroundColor: '#1DB954'}
                  }}
                  href={localLoginUri}
                >Get started</Button>
            }
          </div>

          <div className={"homepageIconHolder"}>
            <div className={"iconSet"}>
              <img className={"homepageIcon"}
                   src={loginIcon} alt={"login"}/>
              <h2 className={"homepageIconText"}>Login to Spotify</h2>
              <p></p>
            </div>
            <div className={"iconSet"}>
              <img className={"homepageIcon"}
                   src={shuffleIcon} alt={"shuffle"}/>
              <h2 className={"homepageIconText"}>Select playlist</h2>
              <p></p>
            </div>
            <div className={"iconSet"}>
              <img className={"homepageIcon"}
                   src={headphonesIcon} alt={"headphones"}/>
              <h2 className={"homepageIconText"}>Start listening</h2>
              <p></p>
            </div>
          </div>
        </div>
        <div className={"featuresContainer"}>
          <h1 className={"featureTitle"}>Features</h1>
          <div className={"featureItem"}>
            <h2>True Shuffle</h2>
            <p className={"featureSubtitle"}>Shuffle your playlists easily</p>
            <div>
                <img className={"homepageGif"} src={"shuffleStep1"} alt={"login"}/>
            </div>
            <Button
              className={"normalButton"}
              // onClick={""}
              variant="contained"
              disableElevation
              sx={{my: 2, color: 'white', bgcolor: "#1DB954"}}
              href={"/playlists"}
            >Select</Button>
          </div>
          <Box textAlign='center' className={"featureItem"}>
            <h2>Remove shuffled playlists</h2>
            <p>Quickly remove custom shuffled playlists</p>
            <Button
              className={"normalButton"}
              // onClick={""}
              variant="contained"
              disableElevation
              sx={{my: 2, color: 'white', bgcolor: "#1DB954"}}
              href={"/#"}
            >Select</Button>
          </Box >
        </div>
      </main>
    </>
  );
}

export default Main;
