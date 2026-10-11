import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ShufflePageSidebar from "../ShufflePageSidebar";
import "@testing-library/jest-dom";

describe("ShufflePageSidebar Component", () => {
    test("renders the stats card and action buttons", () => {
        render(
            <MemoryRouter>
                <ShufflePageSidebar
                    userShuffleCounter={{ playlist_count: 2, track_count: 3 }}
                    recentShuffles={[]}
                    onDeleteSuccess={jest.fn()}
                    existingShuffledPlaylistCount={0}
                />
            </MemoryRouter>
        );

        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /analyse library/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /share library/i })
        ).toBeInTheDocument();
    });

    test("shows the delete action when shuffled playlists exist", () => {
        render(
            <MemoryRouter>
                <ShufflePageSidebar
                    userShuffleCounter={false}
                    recentShuffles={[]}
                    onDeleteSuccess={jest.fn()}
                    existingShuffledPlaylistCount={4}
                />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("button", { name: /delete 4 shuffled playlists/i })
        ).toBeInTheDocument();
    });
});
