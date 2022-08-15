import './App.css';
import {Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Main from "./components/Main"
import AllPlaylists from "./components/AllPlaylists";
import ShufflePage from "./components/ShufflePage";
import HowItWorksPage from "./components/HowItWorksPage";
import ContactPage from "./components/ContactPage";
import Header from "./components/Header";
import {getLoginUriApi} from "./utils/SpotifyAuthService";

function App() {
  const [loginUri, setLoginUri] = useState(0);

  useEffect(() => {
    if (!loginUri){
      getLoginUriApi(setLoginUri);
    }
  });

  return (
    <div className="App">

      <Header loginUri={loginUri}/>
      <Routes>
        <Route path="/" element={<Main loginUri={loginUri}/>}/>
        <Route path="/playlists" element={<AllPlaylists/>}/>
        <Route path="/shuffle" element={<ShufflePage/>}/>
        <Route path="/how-it-works" element={<HowItWorksPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
