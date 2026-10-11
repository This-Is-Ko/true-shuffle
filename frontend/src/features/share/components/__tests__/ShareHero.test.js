import React from "react";
import { render, screen } from "@testing-library/react";
import ShareHero from "../ShareHero";
import "@testing-library/jest-dom";

describe("ShareHero Component", () => {
    test("renders the title, description and children", () => {
        render(
            <ShareHero title="Share your liked songs" description="Some description">
                <button>Start</button>
            </ShareHero>
        );

        expect(screen.getByRole("heading", { name: /share your liked songs/i })).toBeInTheDocument();
        expect(screen.getByText("Some description")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    });

    test("renders the provided icon", () => {
        render(
            <ShareHero title="Only title" icon={<span data-testid="hero-icon" />} />
        );

        expect(screen.getByTestId("hero-icon")).toBeInTheDocument();
    });

    test("omits the description when not provided", () => {
        render(<ShareHero title="Only title" />);

        expect(screen.getByRole("heading", { name: /only title/i })).toBeInTheDocument();
    });
});
