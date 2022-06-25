import React from "react";
import Header from "./Header";
import PlaylistContainer from "./PlaylistContainer";

class AllPlaylists extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <PlaylistContainer />
            </div>
        )
    }
}
export default AllPlaylists