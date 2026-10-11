import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SidebarActionButtonsCard from "../SidebarActionButtonsCard";
import "@testing-library/jest-dom";

const renderCard = (existingShuffledPlaylistCount) =>
    render(
        <MemoryRouter>
            <SidebarActionButtonsCard
                existingShuffledPlaylistCount={existingShuffledPlaylistCount}
                onDeleteSuccess={jest.fn()}
            />
        </MemoryRouter>
    );

describe("SidebarActionButtonsCard Component", () => {
    test("renders the analyse and share links", () => {
        renderCard(0);

        expect(
            screen.getByRole("link", { name: /analyse library/i })
        ).toHaveAttribute("href", "/analysis");
        expect(
            screen.getByRole("link", { name: /share library/i })
        ).toHaveAttribute("href", "/share");
    });

    test("hides the delete button when there are no shuffled playlists", () => {
        renderCard(0);

        expect(
            screen.queryByRole("button", { name: /delete/i })
        ).not.toBeInTheDocument();
    });

    test("shows the delete button when shuffled playlists exist", () => {
        renderCard(3);

        expect(
            screen.getByRole("button", { name: /delete 3 shuffled playlists/i })
        ).toBeInTheDocument();
    });
});
