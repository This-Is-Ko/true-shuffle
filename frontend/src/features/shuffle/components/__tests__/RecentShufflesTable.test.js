import React from "react";
import { render, screen } from "@testing-library/react";
import RecentShufflesTable from "../RecentShufflesTable";
import "@testing-library/jest-dom";

const shuffleAt = (iso) => ({
    playlist_name: iso,
    playlist_image_url: null,
    shuffled_at: iso,
    tracks_shuffled: 3
});

describe("RecentShufflesTable Component", () => {
    test("renders nothing when there are no shuffles", () => {
        const { container } = render(<RecentShufflesTable recentShuffles={[]} />);

        expect(container).toBeEmptyDOMElement();
    });

    test("sorts shuffles most recent first", () => {
        render(
            <RecentShufflesTable
                recentShuffles={[
                    shuffleAt("2026-09-20T10:00:00Z"),
                    shuffleAt("2026-09-25T10:00:00Z")
                ]}
            />
        );

        expect(screen.getByText("Recent Shuffles")).toBeInTheDocument();
        const names = screen.getAllByText(
            /^(2026-09-20T10:00:00Z|2026-09-25T10:00:00Z)$/
        );
        expect(names[0]).toHaveTextContent("2026-09-25T10:00:00Z");
        expect(names[1]).toHaveTextContent("2026-09-20T10:00:00Z");
    });

    test("formats today's shuffle as just the time", () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-09-26T12:00:00"));
        try {
            render(
                <RecentShufflesTable
                    recentShuffles={[shuffleAt("2026-09-26T09:30:00")]}
                />
            );

            expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument();
        } finally {
            jest.useRealTimers();
        }
    });

    test("formats yesterday's shuffle with a Yesterday prefix", () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-09-26T12:00:00"));
        try {
            render(
                <RecentShufflesTable
                    recentShuffles={[shuffleAt("2026-09-25T09:30:00")]}
                />
            );

            expect(screen.getByText(/^Yesterday,/)).toBeInTheDocument();
        } finally {
            jest.useRealTimers();
        }
    });

    test("formats shuffles within the last week as 'N days ago'", () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-09-26T12:00:00"));
        try {
            render(
                <RecentShufflesTable
                    recentShuffles={[shuffleAt("2026-09-23T09:30:00")]}
                />
            );

            expect(screen.getByText("3 days ago")).toBeInTheDocument();
        } finally {
            jest.useRealTimers();
        }
    });

    test("formats older shuffles as d/m/yyyy", () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-09-26T12:00:00"));
        try {
            render(
                <RecentShufflesTable
                    recentShuffles={[shuffleAt("2026-09-10T09:30:00")]}
                />
            );

            expect(screen.getByText("10/9/2026")).toBeInTheDocument();
        } finally {
            jest.useRealTimers();
        }
    });

    test("renders the playlist artwork when an image is available", () => {
        render(
            <RecentShufflesTable
                recentShuffles={[
                    {
                        playlist_name: "Cover Mix",
                        playlist_image_url: "https://example.com/cover.jpg",
                        shuffled_at: "2026-09-26T10:00:00Z",
                        tracks_shuffled: 1
                    }
                ]}
            />
        );

        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            "https://example.com/cover.jpg"
        );
    });
});
