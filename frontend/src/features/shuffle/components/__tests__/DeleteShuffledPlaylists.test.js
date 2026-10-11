import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import DeleteShuffledPlaylistsButton from "../DeleteShuffledPlaylists";
import apiClient from "../../../../utils/apiClient";

jest.mock("../../../../utils/apiClient", () => ({
    __esModule: true,
    default: { delete: jest.fn() }
}));

describe("DeleteShuffledPlaylistsButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("icon variant is disabled when there is nothing to delete", () => {
        render(
            <DeleteShuffledPlaylistsButton
                variant="icon"
                playlistCount={0}
                disabled
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        ).toBeDisabled();
    });

    test("icon variant is enabled when shuffled playlists exist", () => {
        render(
            <DeleteShuffledPlaylistsButton
                variant="icon"
                playlistCount={3}
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        ).toBeEnabled();
    });

    test("button variant shows the playlist count with plural wording", () => {
        render(
            <DeleteShuffledPlaylistsButton
                playlistCount={2}
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(
            screen.getByRole("button", { name: /delete 2 shuffled playlists/i })
        ).toBeInTheDocument();
    });

    test("button variant uses singular wording for one playlist", () => {
        render(
            <DeleteShuffledPlaylistsButton
                playlistCount={1}
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(
            screen.getByRole("button", { name: /delete 1 shuffled playlist$/i })
        ).toBeInTheDocument();
    });

    test("opens a confirmation dialog when clicked", () => {
        render(
            <DeleteShuffledPlaylistsButton
                variant="icon"
                playlistCount={2}
                onDeleteSuccess={jest.fn()}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        );

        expect(screen.getByText("Delete 2 Shuffled Playlists")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /^delete$/i })).toBeInTheDocument();
    });

    test("does not delete when the dialog is cancelled", () => {
        render(
            <DeleteShuffledPlaylistsButton
                variant="icon"
                playlistCount={2}
                onDeleteSuccess={jest.fn()}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        );
        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

        expect(apiClient.delete).not.toHaveBeenCalled();
    });

    test("deletes shuffled playlists and calls onDeleteSuccess", async () => {
        const onDeleteSuccess = jest.fn();
        apiClient.delete.mockResolvedValue({});

        render(
            <DeleteShuffledPlaylistsButton
                variant="icon"
                playlistCount={2}
                onDeleteSuccess={onDeleteSuccess}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        );
        fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

        await waitFor(() => {
            expect(apiClient.delete).toHaveBeenCalledWith(
                expect.stringContaining("/api/playlist/delete"),
                expect.objectContaining({ operationType: "DELETE" })
            );
        });
        await waitFor(() => expect(onDeleteSuccess).toHaveBeenCalledTimes(1));
        expect(
            await screen.findByText(/successfully deleted 2 shuffled playlists/i)
        ).toBeInTheDocument();
    });

    test("shows an error message when deletion fails", async () => {
        apiClient.delete.mockRejectedValue(new Error("network error"));

        render(
            <DeleteShuffledPlaylistsButton
                variant="icon"
                playlistCount={2}
                onDeleteSuccess={jest.fn()}
            />
        );

        fireEvent.click(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        );
        fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

        expect(
            await screen.findByText(/unable to connect to spotify/i)
        ).toBeInTheDocument();
    });
});
