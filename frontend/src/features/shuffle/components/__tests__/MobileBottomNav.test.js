import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileBottomNav from "../MobileBottomNav";
import "@testing-library/jest-dom";

describe("MobileBottomNav Component", () => {
    test("renders the Shuffle, History and How To actions", () => {
        render(
            <MobileBottomNav
                activeTab="shuffle"
                onTabChange={jest.fn()}
                onHowToClick={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: /shuffle/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /history/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /how to/i })).toBeInTheDocument();
    });

    test("selecting History switches the active tab", () => {
        const onTabChange = jest.fn();
        render(
            <MobileBottomNav
                activeTab="shuffle"
                onTabChange={onTabChange}
                onHowToClick={jest.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /history/i }));

        expect(onTabChange).toHaveBeenCalledWith("history");
    });

    test("selecting How To opens the modal and does not switch the tab", () => {
        const onTabChange = jest.fn();
        const onHowToClick = jest.fn();
        render(
            <MobileBottomNav
                activeTab="shuffle"
                onTabChange={onTabChange}
                onHowToClick={onHowToClick}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /how to/i }));

        expect(onHowToClick).toHaveBeenCalledTimes(1);
        expect(onTabChange).not.toHaveBeenCalled();
    });
});
