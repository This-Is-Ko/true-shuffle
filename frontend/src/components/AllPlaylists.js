import React from "react";
import Header from "./Header";
import PlaylistContainer from "./PlaylistContainer";

class AllPlaylists extends React.Component {
    render() {
        return (
            <div>
                <h1>Select a playlist</h1>
                <PlaylistContainer />
            </div>
        )
    }
}
export default AllPlaylists