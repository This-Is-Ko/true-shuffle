import React from "react";
import SpotifyLogin from "./SpotifyLogin";
import Header from "./Header";
import {Link} from "react-router-dom";

const Main = () => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);

  return (
    <>
      <main>
        <h2>Main</h2>
      </main>
      <nav>
        {auth ?
          <Link to="/playlists">Playlists</Link>
        :
          <div></div>
        }
      </nav>
    </>
  );
}

export default Main;
