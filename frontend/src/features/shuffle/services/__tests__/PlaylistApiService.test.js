import apiClient from "../../../../utils/apiClient";
import {
    fetchUserPlaylists,
    fetchRecentShuffles,
    queueShufflePlaylist,
    fetchShuffleState,
    createErrorFromResponse
} from "../PlaylistApiService";
import { OPERATION_TYPES } from "../../../../contexts/CorrelationIdContext";

jest.mock("../../../../utils/apiClient", () => ({
    __esModule: true,
    default: { get: jest.fn(), post: jest.fn() }
}));

describe("PlaylistApiService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("fetchUserPlaylists requests the playlists endpoint with stats", async () => {
        apiClient.get.mockResolvedValue({ data: {} });

        await fetchUserPlaylists();

        expect(apiClient.get).toHaveBeenCalledWith(
            expect.stringContaining("/api/playlist/me?include-stats=true"),
            { operationType: OPERATION_TYPES.GENERAL }
        );
    });

    test("fetchRecentShuffles requests the recent shuffles endpoint", async () => {
        apiClient.get.mockResolvedValue({ data: {} });

        await fetchRecentShuffles();

        expect(apiClient.get).toHaveBeenCalledWith(
            expect.stringContaining("/api/user/shuffle/recent"),
            { operationType: OPERATION_TYPES.GENERAL }
        );
    });

    test("queueShufflePlaylist posts the playlist data", async () => {
        apiClient.post.mockResolvedValue({ data: { shuffle_task_id: "abc" } });

        await queueShufflePlaylist({
            playlist_id: "id-1",
            playlist_name: "My Playlist",
            shuffle_type: "REUSE_EXISTING_PLAYLIST"
        });

        expect(apiClient.post).toHaveBeenCalledWith(
            expect.stringContaining("/api/playlist/shuffle"),
            {
                playlist_id: "id-1",
                playlist_name: "My Playlist",
                shuffle_type: "REUSE_EXISTING_PLAYLIST"
            },
            expect.objectContaining({
                headers: { "Content-Type": "application/json" },
                operationType: OPERATION_TYPES.SHUFFLE
            })
        );
    });

    test("fetchShuffleState requests the state endpoint for the task", async () => {
        apiClient.get.mockResolvedValue({ data: {} });

        await fetchShuffleState("task-123");

        expect(apiClient.get).toHaveBeenCalledWith(
            expect.stringContaining("/api/playlist/shuffle/state/task-123"),
            { operationType: OPERATION_TYPES.SHUFFLE }
        );
    });

    test("createErrorFromResponse maps 401 to an authentication error", () => {
        expect(createErrorFromResponse({ response: { status: 401 } })).toEqual({
            message: expect.stringMatching(/authenticate your account/i)
        });
    });

    test("createErrorFromResponse maps other errors to a connection error", () => {
        expect(createErrorFromResponse({ response: { status: 500 } })).toEqual({
            message: expect.stringMatching(/unable to connect to spotify/i)
        });
        expect(createErrorFromResponse(undefined)).toEqual({
            message: expect.stringMatching(/unable to connect to spotify/i)
        });
    });
});
