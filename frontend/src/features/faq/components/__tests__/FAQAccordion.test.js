import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FAQAccordion from "../FAQAccordion";
import "@testing-library/jest-dom";

describe("FAQAccordion Component", () => {
    test("renders the question and answer", () => {
        render(
            <FAQAccordion
                question="What is True Shuffle for Spotify?"
                answer="A truly random Spotify playlist shuffler."
            />
        );

        expect(screen.getByText("What is True Shuffle for Spotify?")).toBeInTheDocument();
        expect(screen.getByText("A truly random Spotify playlist shuffler.")).toBeInTheDocument();
    });

    test("expands the answer when the question is clicked", () => {
        render(
            <FAQAccordion
                question="Can I shuffle my Liked Songs?"
                answer="Yes, simply select 'Liked Songs' on the shuffle page."
            />
        );

        const summary = screen.getByRole("button", { name: /can i shuffle my liked songs/i });
        expect(summary).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(summary);

        expect(summary).toHaveAttribute("aria-expanded", "true");
    });

    test("renders multi-line answers as separate paragraphs", () => {
        render(
            <FAQAccordion
                question="How do I use it?"
                answer={"First line.\nSecond line."}
            />
        );

        expect(screen.getByText("First line.")).toBeInTheDocument();
        expect(screen.getByText("Second line.")).toBeInTheDocument();
    });
});
