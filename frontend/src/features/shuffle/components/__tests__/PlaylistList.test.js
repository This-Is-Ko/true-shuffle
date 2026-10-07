import React from "react";
import { render, screen } from "@testing-library/react";
import PlaylistList from "../PlaylistList";
import "@testing-library/jest-dom";

const mockSelectedPlaylist = {
    id: "playlist_id_0",
    name: "My Playlist",
    owner: { display_name: "User123" },
    images: { url: "https://example.com/image.jpg" }
};

const baseProps = {
    playlists: [],
    allPlaylistsCount: 0,
    searchTerm: "",
    setSearchTerm: jest.fn(),
    selectPlaylist: jest.fn(),
    setSelectedPlaylist: jest.fn(),
    selectedPlaylist: mockSelectedPlaylist,
    shuffleState: "SUCCESS",
    shuffleStateMessage: "",
    shuffleError: false,
    playlistUri: "https://open.spotify.com/playlist/123",
    loading: false,
    onHowToClick: jest.fn(),
    onRefreshData: jest.fn()
};

describe("PlaylistList Component", () => {
    test("shows 10,000 track limit message when playlist was trimmed", () => {
        render(<PlaylistList {...baseProps} playlistTrimmed={true} />);

        expect(screen.getByText(/only the first 10,000 were added/i)).toBeInTheDocument();
    });

    test("does not show 10,000 track limit message when playlist was not trimmed", () => {
        render(<PlaylistList {...baseProps} playlistTrimmed={false} />);

        expect(screen.queryByText(/only the first 10,000 were added/i)).not.toBeInTheDocument();
    });
});
