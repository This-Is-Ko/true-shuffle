import { Link } from "react-router-dom";
import React from "react";
import {getAccessTokenCall} from "../utils/SpotifyAuthService";
import Header from "./Header";

class Home extends React.Component {

  useQuery= () => {
    return new URLSearchParams(window.location.search);
  }

  componentDidMount() {
    getAccessTokenCall(this.useQuery().get('code'));
  }

  render() {
    return (
      <>
        <main>
          <h2>Home</h2>
        </main>
        <nav>
          <Link to="/playlists">Playlists</Link>
        </nav>
      </>
    );
  }
}

export default Home;
