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

const createMatchMedia = (matches) => (query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
});

// Props for the all-playlists (grid) view used by the mobile tests.
const gridProps = {
    ...baseProps,
    selectedPlaylist: null,
    shuffleState: "",
    playlistUri: null,
    playlistTrimmed: false,
    searchTerm: "",
    playlists: [
        {
            id: "playlist_id_1",
            name: "My Playlist",
            owner: { display_name: "User123" },
            images: { url: "https://example.com/image.jpg" }
        }
    ],
    allPlaylistsCount: 27
};

describe("PlaylistList Component", () => {
    beforeEach(() => {
        // Default to a desktop viewport; individual tests override for mobile.
        window.matchMedia = createMatchMedia(false);
    });

    test("shows 10,000 track limit message when playlist was trimmed", () => {
        render(<PlaylistList {...baseProps} playlistTrimmed={true} />);

        expect(screen.getByText(/only the first 10,000 were added/i)).toBeInTheDocument();
    });

    test("does not show 10,000 track limit message when playlist was not trimmed", () => {
        render(<PlaylistList {...baseProps} playlistTrimmed={false} />);

        expect(screen.queryByText(/only the first 10,000 were added/i)).not.toBeInTheDocument();
    });

    test("shows the playlist count underneath the search bar on mobile", () => {
        window.matchMedia = createMatchMedia(true);
        render(<PlaylistList {...gridProps} />);

        expect(screen.getByPlaceholderText("Search playlists...")).toBeInTheDocument();
        expect(screen.getByText("27 playlists")).toBeInTheDocument();
    });

    test("shows 'Showing x of y' while searching", () => {
        render(<PlaylistList {...gridProps} searchTerm="my" />);

        expect(screen.getByText("Showing 1 of 27")).toBeInTheDocument();
    });

    test("hides the 'Select a playlist' title on mobile in the grid view", () => {
        window.matchMedia = createMatchMedia(true);
        render(<PlaylistList {...gridProps} />);

        expect(screen.queryByText("Select a playlist")).not.toBeInTheDocument();
    });

    test("shows the 'Select a playlist' title on desktop", () => {
        render(<PlaylistList {...gridProps} />);

        expect(screen.getByText("Select a playlist")).toBeInTheDocument();
    });

    test("disables the delete button on mobile when there are no shuffled playlists", () => {
        window.matchMedia = createMatchMedia(true);
        render(<PlaylistList {...gridProps} existingShuffledPlaylistCount={0} />);

        expect(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        ).toBeDisabled();
    });

    test("enables the delete button on mobile when shuffled playlists exist", () => {
        window.matchMedia = createMatchMedia(true);
        render(<PlaylistList {...gridProps} existingShuffledPlaylistCount={3} />);

        expect(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        ).toBeEnabled();
    });
});
