import './App.css';
import { Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import { Helmet } from "react-helmet";

import Main from "./components/Main"
import ShufflePlaylistContainer from "./components/ShufflePlaylistContainer";
import ShufflePage from "./pages/ShufflePage";
import DeletePage from "./pages/DeletePage";
import AboutPage from "./pages/AboutPage";
import Header from "./components/Header";

function App() {
    const [loginUri, setLoginUri] = useState(process.env.REACT_APP_SPOTIFY_AUTH_URI);
    const [isAuth, setIsAuth] = useState(localStorage.getItem("accessToken") != null);

    const ShufflePages = (isAuth, setIsAuth) => {
        return (
            <div>
                <Helmet>
                    <title>Shuffle | True Shuffle</title>
                </Helmet>
                <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>Shuffle</Typography>
                <Routes>
                    <Route path="/" element={<ShufflePage isAuth={isAuth} setIsAuth={setIsAuth} />} />
                    <Route path="/playlist" element={<ShufflePlaylistContainer isAuth={isAuth} setIsAuth={setIsAuth} />} />
                </Routes>
            </div>
        )
    }

    return (
        <div className="App">
            <Header loginUri={loginUri} isAuth={isAuth} />
            <Routes>
                <Route path="/" element={<Main loginUri={loginUri} isAuth={isAuth} setIsAuth={setIsAuth} />} />
                <Route path="/shuffle/*" element={<ShufflePages isAuth={isAuth} setIsAuth={setIsAuth} />} />
                <Route path="/delete" element={<DeletePage isAuth={isAuth} />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </div>
    );
}

export default App;
