import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import AllPlaylistsContainer from "../PlaylistContainer";
import {
    fetchUserPlaylists,
    fetchRecentShuffles,
    queueShufflePlaylist,
    fetchShuffleState,
    createErrorFromResponse
} from "../../services/PlaylistApiService";
import { SHUFFLE_TYPE } from "../../constants/ShuffleConstants";

jest.mock("../../services/PlaylistApiService", () => ({
    fetchUserPlaylists: jest.fn(),
    fetchRecentShuffles: jest.fn(),
    queueShufflePlaylist: jest.fn(),
    fetchShuffleState: jest.fn(),
    createErrorFromResponse: jest.fn(() => ({
        message: "Unable to connect to Spotify, please try again later"
    }))
}));

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

const playlist = {
    id: "playlist_id_1",
    name: "Road Trip",
    owner: { display_name: "User123" },
    images: { url: "https://example.com/image.jpg" }
};

const defaultProps = {
    selectPlaylist: jest.fn(),
    setSelectedPlaylist: jest.fn(),
    selectedPlaylist: null,
    onHowToClick: jest.fn(),
    onDeleteSuccess: jest.fn()
};

const renderContainer = (props, { selectedPlaylist = null } = {}) =>
    render(
        <MemoryRouter>
            <AllPlaylistsContainer {...defaultProps} {...props} selectedPlaylist={selectedPlaylist} />
        </MemoryRouter>
    );

describe("AllPlaylistsContainer (shuffle page body)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default to a desktop viewport; individual tests override for mobile.
        window.matchMedia = createMatchMedia(false);
        window.scrollTo = jest.fn();

        fetchUserPlaylists.mockResolvedValue({
            data: {
                all_playlists: [playlist],
                user_shuffle_counter: { playlist_count: 5, track_count: 100 },
                existing_shuffled_playlist_count: 2
            }
        });
        fetchRecentShuffles.mockResolvedValue({ data: { recent_shuffles: [] } });
        queueShufflePlaylist.mockResolvedValue({ data: { shuffle_task_id: "task-1" } });
        // Default: never resolve, so a stray polling timer cannot crash the suite.
        fetchShuffleState.mockReturnValue(new Promise(() => {}));
        createErrorFromResponse.mockReturnValue({
            message: "Unable to connect to Spotify, please try again later"
        });
    });

    test("loads and displays the user's playlists and overview stats", async () => {
        renderContainer();

        expect(await screen.findByText("Road Trip")).toBeInTheDocument();
        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(screen.getByText("Playlists Shuffled")).toBeInTheDocument();
    });

    test("shows loading skeletons before playlists resolve", () => {
        fetchUserPlaylists.mockReturnValue(new Promise(() => {}));
        fetchRecentShuffles.mockReturnValue(new Promise(() => {}));

        renderContainer();

        expect(screen.getAllByTestId("playlist-skeleton").length).toBeGreaterThan(0);
    });

    test("shows a connection error and hides the sidebar when loading fails", async () => {
        fetchUserPlaylists.mockRejectedValue({ response: { status: 500 } });

        renderContainer();

        expect(await screen.findByText("Service Unavailable")).toBeInTheDocument();
        // Sidebar is hidden for Spotify connection errors
        expect(screen.queryByText("Overview")).not.toBeInTheDocument();
    });

    test("keeps the sidebar visible for non-connection errors", async () => {
        createErrorFromResponse.mockReturnValue({ message: "Something else went wrong" });
        fetchUserPlaylists.mockRejectedValue({ response: { status: 400 } });

        renderContainer();

        expect(await screen.findByText("Something else went wrong")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /analyse library/i })
        ).toBeInTheDocument();
    });

    test("queues a shuffle when a playlist is selected", async () => {
        renderContainer({}, { selectedPlaylist: playlist });

        await waitFor(() => {
            expect(queueShufflePlaylist).toHaveBeenCalledWith({
                playlist_id: "playlist_id_1",
                playlist_name: "Road Trip",
                shuffle_type: SHUFFLE_TYPE.REUSE_EXISTING_PLAYLIST
            });
        });
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    test("does not queue a shuffle when no playlist is selected", async () => {
        renderContainer();

        await screen.findByText("Road Trip");
        expect(queueShufflePlaylist).not.toHaveBeenCalled();
    });

    test("polls the shuffle state and shows the open link on success", async () => {
        fetchShuffleState.mockResolvedValue({
            data: {
                state: "SUCCESS",
                result: {
                    playlist_uri: "https://open.spotify.com/playlist/shuffled",
                    playlist_trimmed: false
                }
            }
        });

        renderContainer({}, { selectedPlaylist: playlist });

        const openLink = await screen.findByRole(
            "link",
            { name: /open/i },
            { timeout: 4000 }
        );
        expect(openLink).toHaveAttribute(
            "href",
            "https://open.spotify.com/playlist/shuffled"
        );
    });

    test("shows progress messages while the shuffle is running", async () => {
        fetchShuffleState.mockResolvedValue({
            data: {
                state: "PROGRESS",
                progress: { state: "Shuffling 10 tracks...", playlist_uri: null }
            }
        });

        renderContainer({}, { selectedPlaylist: playlist });

        expect(
            await screen.findByText("Shuffling 10 tracks...", {}, { timeout: 4000 })
        ).toBeInTheDocument();
    });

    test("shows the mobile bottom nav and switches to the history view", async () => {
        window.matchMedia = createMatchMedia(true);
        fetchRecentShuffles.mockResolvedValue({
            data: {
                recent_shuffles: [
                    {
                        playlist_name: "Beach Day",
                        playlist_image_url: null,
                        shuffled_at: "2026-09-26T10:00:00Z",
                        tracks_shuffled: 42
                    }
                ]
            }
        });

        renderContainer();

        await screen.findByText("Road Trip");

        fireEvent.click(screen.getByRole("button", { name: /history/i }));

        expect(await screen.findByText("Shuffle history")).toBeInTheDocument();
        expect(screen.getAllByText("Beach Day").length).toBeGreaterThan(0);
    });
});
