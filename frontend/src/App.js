import './App.css';
import {Route, Routes} from "react-router-dom";
import React from "react";
import Main from "./components/Main"
import AllPlaylists from "./components/AllPlaylists";
import ShufflePage from "./components/ShufflePage";
import HowItWorksPage from "./components/HowItWorksPage";
import ContactPage from "./components/ContactPage";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">

      <Header/>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/playlists" element={<AllPlaylists/>}/>
        <Route path="/shuffle" element={<ShufflePage/>}/>
        <Route path="/how-it-works" element={<HowItWorksPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
