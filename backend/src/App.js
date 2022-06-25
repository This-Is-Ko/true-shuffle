import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import React from "react";
import Home from "./components/Home"
import Main from "./components/Main"
import AllPlaylists from "./components/AllPlaylists";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/home" element={<Home />} />
            <Route path="playlists" element={<AllPlaylists />} />
        </Routes>
    </div>
  );
}

export default App;
