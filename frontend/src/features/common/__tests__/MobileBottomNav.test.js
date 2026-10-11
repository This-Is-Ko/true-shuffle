import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileBottomNav from "../MobileBottomNav";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "@testing-library/jest-dom";

const shuffleItems = [
    { label: "Shuffle", value: "shuffle", icon: <ShuffleIcon /> },
    { label: "How To", value: "howto", icon: <HelpOutlineIcon /> }
];

describe("MobileBottomNav Component", () => {
    test("renders the provided items", () => {
        render(<MobileBottomNav items={shuffleItems} value="shuffle" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: /shuffle/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /how to/i })).toBeInTheDocument();
    });

    test("selecting an item calls onChange with its value", () => {
        const onChange = jest.fn();
        render(<MobileBottomNav items={shuffleItems} value="shuffle" onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: /how to/i }));

        expect(onChange).toHaveBeenCalledWith("howto");
    });

    test("supports a single action (share page usage)", () => {
        const onChange = jest.fn();
        render(
            <MobileBottomNav
                items={[{ label: "How To", value: "howto", icon: <HelpOutlineIcon /> }]}
                value={null}
                onChange={onChange}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /how to/i }));

        expect(onChange).toHaveBeenCalledWith("howto");
    });

    test("does not throw when selecting without an onChange handler", () => {
        render(<MobileBottomNav items={shuffleItems} value="shuffle" />);

        expect(() =>
            fireEvent.click(screen.getByRole("button", { name: /how to/i }))
        ).not.toThrow();
    });
});
