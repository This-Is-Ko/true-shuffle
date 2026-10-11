import React from "react";
import { render, screen } from "@testing-library/react";
import UserShuffleCounterContainer from "../UserShuffleCounterContainer";
import "@testing-library/jest-dom";

describe("UserShuffleCounterContainer Component", () => {
    test("renders the playlist and track counts with space formatting", () => {
        render(
            <UserShuffleCounterContainer
                userShuffleCounter={{ playlist_count: 396, track_count: 1000 }}
            />
        );

        expect(screen.getByText("396")).toBeInTheDocument();
        expect(screen.getByText("1 000")).toBeInTheDocument();
    });
});
