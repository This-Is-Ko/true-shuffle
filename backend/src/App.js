import './App.css';
import {Route, Routes} from "react-router-dom";
import React from "react";
import Main from "./components/Main"
import AllPlaylists from "./components/AllPlaylists";
import ShufflePage from "./components/ShufflePage";
import AboutPage from "./components/AboutPage";
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
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
