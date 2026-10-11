import React from "react";
import { render, screen } from "@testing-library/react";
import SidebarStatsCard from "../SidebarStatsCard";
import "@testing-library/jest-dom";

const recentShuffles = [
    {
        playlist_name: "Focus Mix",
        playlist_image_url: null,
        shuffled_at: "2026-09-26T10:00:00Z",
        tracks_shuffled: 12
    }
];

describe("SidebarStatsCard Component", () => {
    test("renders overview stats and recent shuffles", () => {
        render(
            <SidebarStatsCard
                userShuffleCounter={{ playlist_count: 5, track_count: 100 }}
                recentShuffles={recentShuffles}
            />
        );

        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(screen.getByText("Recent Shuffles")).toBeInTheDocument();
        expect(screen.getByText("Focus Mix")).toBeInTheDocument();
    });

    test("renders recent shuffles when the counter is absent", () => {
        render(
            <SidebarStatsCard
                userShuffleCounter={false}
                recentShuffles={recentShuffles}
            />
        );

        expect(screen.queryByText("Overview")).not.toBeInTheDocument();
        expect(screen.getByText("Recent Shuffles")).toBeInTheDocument();
    });

    test("renders overview stats when there are no recent shuffles", () => {
        render(
            <SidebarStatsCard
                userShuffleCounter={{ playlist_count: 5, track_count: 100 }}
                recentShuffles={[]}
            />
        );

        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(screen.queryByText("Recent Shuffles")).not.toBeInTheDocument();
    });

    test("renders the filter shuffle section when the feature flag is enabled", () => {
        const previous = process.env.REACT_APP_ENABLE_FILTER_SHUFFLE;
        process.env.REACT_APP_ENABLE_FILTER_SHUFFLE = "true";

        try {
            render(
                <SidebarStatsCard
                    userShuffleCounter={{ playlist_count: 5, track_count: 100 }}
                    recentShuffles={[]}
                />
            );

            expect(screen.getByText("Filter & Shuffle")).toBeInTheDocument();
        } finally {
            if (previous === undefined) {
                delete process.env.REACT_APP_ENABLE_FILTER_SHUFFLE;
            } else {
                process.env.REACT_APP_ENABLE_FILTER_SHUFFLE = previous;
            }
        }
    });
});
