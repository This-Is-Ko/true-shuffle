import React from "react";
import { render, screen } from "@testing-library/react";
import ShuffleStatsPills from "../ShuffleStatsPills";
import "@testing-library/jest-dom";

describe("ShuffleStatsPills Component", () => {
    test("renders playlist and track counts with words and comma formatting", () => {
        render(
            <ShuffleStatsPills
                userShuffleCounter={{ playlist_count: 396, track_count: 644477 }}
            />
        );

        expect(screen.getByText("396 playlists")).toBeInTheDocument();
        expect(screen.getByText("644,477 tracks")).toBeInTheDocument();
    });

    test("uses singular nouns for a count of 1", () => {
        render(
            <ShuffleStatsPills
                userShuffleCounter={{ playlist_count: 1, track_count: 1 }}
            />
        );

        expect(screen.getByText("1 playlist")).toBeInTheDocument();
        expect(screen.getByText("1 track")).toBeInTheDocument();
    });

    test("renders nothing when the counter is absent", () => {
        const { container } = render(
            <ShuffleStatsPills userShuffleCounter={false} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    test("renders nothing when both counts are missing", () => {
        const { container } = render(
            <ShuffleStatsPills userShuffleCounter={{}} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    test("renders only the available count when one is missing", () => {
        render(
            <ShuffleStatsPills userShuffleCounter={{ playlist_count: 5 }} />
        );

        expect(screen.getByText("5 playlists")).toBeInTheDocument();
        expect(screen.queryByText(/tracks?$/)).not.toBeInTheDocument();
    });
});
