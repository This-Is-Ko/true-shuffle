import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CounterTooltipChip from "../CounterTooltipChip";
import "@testing-library/jest-dom";

const createMatchMedia = (matches) => (query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
});

describe("CounterTooltipChip Component", () => {
    test("formats the label with spaces", () => {
        window.matchMedia = createMatchMedia(false);

        render(
            <CounterTooltipChip icon={<span />} label={1000} tooltipTitle="Tracks" />
        );

        expect(screen.getByText("1 000")).toBeInTheDocument();
    });

    test("toggles the tooltip on click on mobile", async () => {
        window.matchMedia = createMatchMedia(true);

        render(
            <CounterTooltipChip icon={<span />} label={5} tooltipTitle="Tracks" />
        );

        fireEvent.click(screen.getByText("5"));

        expect(await screen.findByRole("tooltip")).toHaveTextContent("Tracks");
    });

    test("handles mouse and touch interactions without errors", async () => {
        window.matchMedia = createMatchMedia(true);

        render(
            <CounterTooltipChip icon={<span />} label={5} tooltipTitle="Tracks" />
        );

        const chip = screen.getByText("5");
        expect(() => {
            fireEvent.mouseEnter(chip);
            fireEvent.mouseLeave(chip);
            // Provide touch coordinates so MUI can compute a finite ripple size.
            fireEvent.touchStart(chip, { touches: [{ clientX: 12, clientY: 12 }] });
            fireEvent.touchEnd(chip, { touches: [{ clientX: 12, clientY: 12 }] });
        }).not.toThrow();

        // MUI's touch ripple schedules follow-up state updates on a timer; flush
        // them inside act(...) so they don't leak outside the test.
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
    });

    test("shows the tooltip on hover on desktop", async () => {
        window.matchMedia = createMatchMedia(false);

        render(
            <CounterTooltipChip icon={<span />} label={7} tooltipTitle="Tracks" />
        );

        const chip = screen.getByText("7");
        fireEvent.mouseEnter(chip);

        expect(await screen.findByRole("tooltip")).toHaveTextContent("Tracks");

        fireEvent.mouseLeave(chip);
    });
});
