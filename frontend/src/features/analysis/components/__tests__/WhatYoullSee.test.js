import React from "react";
import { render, screen, within } from "@testing-library/react";
import WhatYoullSee from "../WhatYoullSee";
import "@testing-library/jest-dom";

const EXPECTED_FEATURES = [
    { title: "Library overview", description: "Key statistics about your music library" },
    { title: "Top artists", description: "The artists you save the most" },
    { title: "Top albums", description: "The albums that appear most in your library" },
    { title: "And more", description: "More insights about the music you enjoy" }
];

describe("WhatYoullSee Component", () => {
    test("renders the section heading", () => {
        render(<WhatYoullSee />);

        expect(screen.getByRole("heading", { name: /what you'll see/i })).toBeInTheDocument();
    });

    test("renders each feature with its title and description", () => {
        render(<WhatYoullSee />);

        EXPECTED_FEATURES.forEach(({ title, description }) => {
            const titleNode = screen.getByText(title);
            expect(titleNode).toBeInTheDocument();
            expect(within(titleNode.parentElement).getByText(description)).toBeInTheDocument();
        });
    });
});
