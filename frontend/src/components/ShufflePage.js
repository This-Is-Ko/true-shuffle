import React from "react";
import ShufflePlaylistContainer from "./ShufflePlaylistContainer";

class ShufflePage extends React.Component {

  state = {
    isLoading: false,
    isError: false
  };

  render() {
    const isError = this.state.isError;

    return (
      <div>
        <h1>Shuffle</h1>
        <ShufflePlaylistContainer/>
      </div>
    )
  }
}
export default ShufflePage