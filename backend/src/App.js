import './App.css';
import {Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Main from "./components/Main"
import AllPlaylists from "./components/AllPlaylists";
import ShufflePage from "./components/ShufflePage";
import Features from "./components/Features";
import ContactPage from "./components/ContactPage";
import Header from "./components/Header";
import {getLoginUriApi} from "./utils/SpotifyAuthService";

function App() {
  const [loginUri, setLoginUri] = useState(0);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("accessToken") != null);

  useEffect(() => {
    if (!loginUri){
      getLoginUriApi(setLoginUri);
    }
    setIsAuth(localStorage.getItem("accessToken") != null);
  });

  return (
    <div className="App">

      <Header loginUri={loginUri} isAuth={isAuth}/>
      <Routes>
        <Route path="/" element={<Main loginUri={loginUri} isAuth={isAuth} setIsAuth={setIsAuth}/>}/>
        <Route path="/playlists" element={<AllPlaylists loginUri={loginUri}/>}/>
        <Route path="/shuffle" element={<ShufflePage/>}/>
        <Route path="/features" element={<Features/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
