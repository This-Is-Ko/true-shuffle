import React from "react";
import { render, screen } from "@testing-library/react";
import SidebarCard from "../SidebarCard";
import "@testing-library/jest-dom";

describe("SidebarCard Component", () => {
    test("renders its children", () => {
        render(
            <SidebarCard>
                <span>Card content</span>
            </SidebarCard>
        );

        expect(screen.getByText("Card content")).toBeInTheDocument();
    });
});
