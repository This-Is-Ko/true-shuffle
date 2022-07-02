import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import React from "react";
import Main from "./components/Main"
import AllPlaylists from "./components/AllPlaylists";
import ShufflePage from "./components/ShufflePage";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">

      <Header/>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/playlists" element={<AllPlaylists />} />
            <Route path="/shuffle" element={<ShufflePage />} />
        </Routes>
    </div>
  );
}

export default App;
