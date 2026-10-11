import React from "react";
import { render, screen } from "@testing-library/react";
import MobileHistoryView from "../MobileHistoryView";
import "@testing-library/jest-dom";

// Intentionally unsorted (oldest first) to verify sorting in the component.
const baseShuffles = [
    {
        playlist_name: "Liked Tracks",
        playlist_image_url: null,
        shuffled_at: "2026-09-21T10:00:00Z",
        tracks_shuffled: 12345
    },
    {
        playlist_name: "test",
        playlist_image_url: "https://example.com/image.jpg",
        shuffled_at: "2026-09-26T10:00:00Z",
        tracks_shuffled: 5
    }
];

describe("MobileHistoryView Component", () => {
    test("renders the header and shuffle rows", () => {
        render(
            <MobileHistoryView
                recentShuffles={baseShuffles}
                existingShuffledPlaylistCount={2}
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(screen.getByText("Shuffle history")).toBeInTheDocument();
        expect(screen.getByText("test")).toBeInTheDocument();
        expect(screen.getByText("Liked Tracks")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("12,345")).toBeInTheDocument();
    });

    test("sorts shuffles most recent first", () => {
        const { container } = render(
            <MobileHistoryView
                recentShuffles={baseShuffles}
                existingShuffledPlaylistCount={2}
                onDeleteSuccess={jest.fn()}
            />
        );

        const names = screen.getAllByText(/^(test|Liked Tracks)$/);
        expect(names[0]).toHaveTextContent("test");
        expect(names[1]).toHaveTextContent("Liked Tracks");
        expect(container).toBeInTheDocument();
    });

    test("shows an empty state when there are no shuffles", () => {
        render(
            <MobileHistoryView
                recentShuffles={[]}
                existingShuffledPlaylistCount={0}
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(screen.getByText("Shuffle history")).toBeInTheDocument();
        expect(screen.getByText(/no recent shuffles yet/i)).toBeInTheDocument();
    });

    test("delete button is disabled when there is nothing to delete", () => {
        render(
            <MobileHistoryView
                recentShuffles={[]}
                existingShuffledPlaylistCount={0}
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        ).toBeDisabled();
    });

    test("delete button is enabled when shuffled playlists exist", () => {
        render(
            <MobileHistoryView
                recentShuffles={baseShuffles}
                existingShuffledPlaylistCount={2}
                onDeleteSuccess={jest.fn()}
            />
        );

        expect(
            screen.getByRole("button", { name: /delete shuffled playlists/i })
        ).toBeEnabled();
    });

    test("formats today's shuffle with a Today prefix", () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-09-26T12:00:00"));

        try {
            render(
                <MobileHistoryView
                    recentShuffles={[
                        {
                            playlist_name: "Today Mix",
                            playlist_image_url: null,
                            shuffled_at: "2026-09-26T09:30:00",
                            tracks_shuffled: 3
                        }
                    ]}
                    existingShuffledPlaylistCount={1}
                    onDeleteSuccess={jest.fn()}
                />
            );

            expect(screen.getByText(/^Today,/)).toBeInTheDocument();
        } finally {
            jest.useRealTimers();
        }
    });

    test("formats yesterday's shuffle with a Yesterday prefix", () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-09-26T12:00:00"));

        try {
            render(
                <MobileHistoryView
                    recentShuffles={[
                        {
                            playlist_name: "Yesterday Mix",
                            playlist_image_url: null,
                            shuffled_at: "2026-09-25T09:30:00",
                            tracks_shuffled: 3
                        }
                    ]}
                    existingShuffledPlaylistCount={1}
                    onDeleteSuccess={jest.fn()}
                />
            );

            expect(screen.getByText(/^Yesterday,/)).toBeInTheDocument();
        } finally {
            jest.useRealTimers();
        }
    });

    test("formats older shuffles as d/m/yyyy", () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-09-26T12:00:00"));

        try {
            render(
                <MobileHistoryView
                    recentShuffles={[
                        {
                            playlist_name: "Old Mix",
                            playlist_image_url: null,
                            shuffled_at: "2026-09-10T09:30:00",
                            tracks_shuffled: 3
                        }
                    ]}
                    existingShuffledPlaylistCount={1}
                    onDeleteSuccess={jest.fn()}
                />
            );

            expect(screen.getByText("10/9/2026")).toBeInTheDocument();
        } finally {
            jest.useRealTimers();
        }
    });
});
