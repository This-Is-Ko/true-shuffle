import './App.css';
import { Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import { Helmet } from "react-helmet";

import Main from "./components/Main"
import ShufflePlaylistContainer from "./components/ShufflePlaylistContainer";
import ShufflePage from "./pages/ShufflePage";
import DeletePage from "./pages/DeletePage";
import ShareLikedTracksPage from "./pages/ShareLikedTracksPage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import Header from "./components/Header";

function App() {
    const [loginUri, setLoginUri] = useState(process.env.REACT_APP_SPOTIFY_AUTH_URI);
    const [isAuth, setIsAuth] = useState(localStorage.getItem("accessToken") != null);
    const [showGlobalMessage, setShowGlobalMessage] = useState(process.env.REACT_APP_SHOW_GLOBAL_MESSAGE);
    const [globalMessageContent, setGlobalMessageContent] = useState(process.env.REACT_APP_GLOBAL_MESSAGE_CONTENT);

    const ShufflePages = (isAuth, setIsAuth) => {
        return (
            <div>
                <Helmet>
                    <title>Shuffle | True Shuffle for Spotify</title>
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
            {/* Set a global message to display on all pages of the site */}
            {showGlobalMessage === "true" &&
                <div className='globalMessage'>
                    <Typography variant='caption' component="div" sx={{ paddingTop: "3px", color: "red" }}>{globalMessageContent}</Typography>
                </div>
            }
            <Header loginUri={loginUri} isAuth={isAuth} />
            <Routes>
                <Route path="/" element={<Main loginUri={loginUri} isAuth={isAuth} setIsAuth={setIsAuth} />} />
                <Route path="/shuffle/*" element={<ShufflePages isAuth={isAuth} setIsAuth={setIsAuth} />} />
                <Route path="/delete" element={<DeletePage isAuth={isAuth} />} />
                <Route path="/share" element={<ShareLikedTracksPage isAuth={isAuth} />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </div>
    );
}

export default App;
