import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

    test("hides the 'Select a playlist' title in the grid view", () => {
        render(<PlaylistList {...gridProps} />);

        expect(screen.queryByText("Select a playlist")).not.toBeInTheDocument();
    });

    test("hides the 'Select a playlist' title in the grid view on mobile", () => {
        window.matchMedia = createMatchMedia(true);
        render(<PlaylistList {...gridProps} />);

        expect(screen.queryByText("Select a playlist")).not.toBeInTheDocument();
    });

    test("shows the How To button next to the search bar on desktop", () => {
        render(<PlaylistList {...gridProps} />);

        expect(screen.getByRole("button", { name: /how to use/i })).toBeInTheDocument();
    });

    test("does not show the How To button on mobile (it lives in the bottom nav)", () => {
        window.matchMedia = createMatchMedia(true);
        render(<PlaylistList {...gridProps} />);

        expect(screen.queryByRole("button", { name: /how to use/i })).not.toBeInTheDocument();
    });

    test("shows the shuffle status message and spinner while shuffling on mobile", () => {
        window.matchMedia = createMatchMedia(true);
        render(
            <PlaylistList
                {...baseProps}
                shuffleState="PROGRESS"
                shuffleStateMessage="Shuffling 3545 tracks..."
                playlistUri={null}
            />
        );

        expect(screen.getByText("Shuffling 3545 tracks...")).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("shows a 'Back to playlists' button when the shuffle has finished", () => {
        render(<PlaylistList {...baseProps} />);

        expect(screen.getByRole("button", { name: /back to playlists/i })).toBeInTheDocument();
    });

    test("shows a 'Back to playlists' button when the shuffle has errored", () => {
        render(
            <PlaylistList
                {...baseProps}
                shuffleState="FAILURE"
                shuffleError={{ message: "Something went wrong" }}
            />
        );

        expect(screen.getByRole("button", { name: /back to playlists/i })).toBeInTheDocument();
    });

    test("does not show a 'Back to playlists' button while shuffling", () => {
        render(
            <PlaylistList
                {...baseProps}
                shuffleState="PROGRESS"
                shuffleStateMessage="Shuffling 3545 tracks..."
            />
        );

        expect(screen.queryByRole("button", { name: /back to playlists/i })).not.toBeInTheDocument();
    });

    test("shows an Open link with the playlist URI in the shuffled state", () => {
        render(<PlaylistList {...baseProps} />);

        const openLink = screen.getByRole("link", { name: /open/i });
        expect(openLink).toHaveAttribute("href", "https://open.spotify.com/playlist/123");
        expect(openLink).toHaveAttribute("target", "_blank");
    });

    test("calls setSearchTerm when the search field changes", () => {
        const setSearchTerm = jest.fn();
        render(<PlaylistList {...gridProps} setSearchTerm={setSearchTerm} />);

        fireEvent.change(screen.getByPlaceholderText("Search playlists..."), {
            target: { value: "jazz" }
        });

        expect(setSearchTerm).toHaveBeenCalledWith("jazz");
    });

    test("clears the search term when the clear button is clicked", () => {
        const setSearchTerm = jest.fn();
        render(<PlaylistList {...gridProps} searchTerm="my" setSearchTerm={setSearchTerm} />);

        fireEvent.click(screen.getByRole("button", { name: /clear search/i }));

        expect(setSearchTerm).toHaveBeenCalledWith("");
    });

    test("shows 'No playlists found' when there are no playlists", () => {
        render(
            <PlaylistList
                {...gridProps}
                playlists={[]}
                allPlaylistsCount={0}
            />
        );

        expect(screen.getByText("No playlists found")).toBeInTheDocument();
    });

    test("uses the singular 'playlist' for a single playlist", () => {
        render(
            <PlaylistList
                {...gridProps}
                playlists={[gridProps.playlists[0]]}
                allPlaylistsCount={1}
            />
        );

        expect(screen.getByText("1 playlist")).toBeInTheDocument();
    });

    test("shows loading skeletons while playlists are loading", () => {
        render(<PlaylistList loading={true} onHowToClick={jest.fn()} />);

        expect(screen.getAllByTestId("playlist-skeleton").length).toBeGreaterThan(0);
    });

    test("selects a playlist when its tile is clicked", () => {
        const setSelectedPlaylist = jest.fn();
        render(
            <PlaylistList {...gridProps} setSelectedPlaylist={setSelectedPlaylist} />
        );

        fireEvent.click(screen.getByRole("img"));

        expect(setSelectedPlaylist).toHaveBeenCalledWith(gridProps.playlists[0]);
    });

    test("returns to the grid when 'Back to playlists' is clicked", () => {
        const onRefreshData = jest.fn();
        const setSelectedPlaylist = jest.fn();
        render(
            <PlaylistList
                {...baseProps}
                onRefreshData={onRefreshData}
                setSelectedPlaylist={setSelectedPlaylist}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /back to playlists/i }));

        expect(setSelectedPlaylist).toHaveBeenCalledWith(null);
        expect(onRefreshData).toHaveBeenCalledTimes(1);
    });
});
