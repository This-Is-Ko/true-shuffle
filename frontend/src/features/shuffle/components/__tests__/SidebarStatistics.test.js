import React from "react";
import { render, screen } from "@testing-library/react";
import SidebarStatistics from "../SidebarStatistics";
import "@testing-library/jest-dom";

describe("SidebarStatistics Component", () => {
    test("renders the overview heading and both counts", () => {
        render(
            <SidebarStatistics
                userShuffleCounter={{ playlist_count: 396, track_count: 644477 }}
            />
        );

        expect(screen.getByText("Overview")).toBeInTheDocument();
        expect(screen.getByText("Playlists Shuffled")).toBeInTheDocument();
        expect(screen.getByText("396")).toBeInTheDocument();
        expect(screen.getByText("Tracks Shuffled")).toBeInTheDocument();
        expect(screen.getByText("644 477")).toBeInTheDocument();
    });

    test("renders nothing when the counter is absent", () => {
        const { container } = render(
            <SidebarStatistics userShuffleCounter={false} />
        );

        expect(container).toBeEmptyDOMElement();
    });
});
