import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilteredLikedSongsShuffle from "../FilteredLikedSongsShuffle";
import "@testing-library/jest-dom";

const expandAccordion = () => {
    fireEvent.click(screen.getByRole("button", { name: /filter & shuffle/i }));
};

describe("FilteredLikedSongsShuffle Component", () => {
    test("renders the collapsible filter section", () => {
        render(<FilteredLikedSongsShuffle />);

        expect(screen.getByText("Filter & Shuffle")).toBeInTheDocument();
    });

    test("shuffle button is disabled until a filter is entered", async () => {
        render(<FilteredLikedSongsShuffle />);
        expandAccordion();

        const button = await screen.findByRole("button", {
            name: /shuffle filtered liked songs/i
        });
        expect(button).toBeDisabled();

        fireEvent.change(screen.getByLabelText("Artist"), {
            target: { value: "Radiohead" }
        });

        expect(button).toBeEnabled();
    });

    test("alerts that the feature is coming soon when shuffling with filters", async () => {
        window.alert = jest.fn();
        render(<FilteredLikedSongsShuffle />);
        expandAccordion();

        fireEvent.change(screen.getByLabelText("Genre"), {
            target: { value: "Rock" }
        });
        fireEvent.click(
            await screen.findByRole("button", {
                name: /shuffle filtered liked songs/i
            })
        );

        expect(window.alert).toHaveBeenCalledWith(
            "Filtered shuffle feature coming soon!"
        );
    });
});
