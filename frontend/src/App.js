import './App.css';
import {Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Main from "./components/Main"
import AllPlaylists from "./components/AllPlaylists";
import ShufflePlaylistContainer from "./components/ShufflePlaylistContainer";
import NewShufflePage from "./pages/NewShufflePage";
import Features from "./components/Features";
import ContactPage from "./components/ContactPage";
import Header from "./components/Header";
import {getLoginUriApi} from "./utils/SpotifyAuthService";

function App() {
  const [loginUri, setLoginUri] = useState(process.env.REACT_APP_SPOTIFY_AUTH_URI);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("accessToken") != null);

  // useEffect(() => {
  //   if (!loginUri){
  //     setLoginUri(process.env.REACT_APP_SPOTIFY_AUTH_URI)
  //     // getLoginUriApi(setLoginUri);
  //   }
  //   setIsAuth(localStorage.getItem("accessToken") != null);
  // }, []);

  const ShufflePages = (isAuth, setIsAuth) => {
    console.log("MAIN LOAD")
    return (
      <div>
        <h1>Shuffle</h1>
        <Routes>
          <Route path="/" element={<NewShufflePage isAuth={isAuth} setIsAuth={setIsAuth}/>}/>
          <Route path="/playlist" element={<ShufflePlaylistContainer isAuth={isAuth} setIsAuth={setIsAuth}/>}/>
        </Routes>
      </div>
    )
  }

  return (
    <div className="App">
      <Header loginUri={loginUri} isAuth={isAuth}/>
      <Routes>
        <Route path="/" element={<Main loginUri={loginUri} isAuth={isAuth} setIsAuth={setIsAuth}/>}/>
        {/* <Route path="/playlists" element={<AllPlaylists loginUri={loginUri}/>}/> */}
        <Route path="/shuffle/*" element={<ShufflePages isAuth={isAuth} setIsAuth={setIsAuth}/>}/>
        {/* <Route path="/shuffle/playlist" element={<ShufflePage isAuth={isAuth} setIsAuth={setIsAuth}/>}/> */}
        <Route path="/contact" element={<ContactPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
