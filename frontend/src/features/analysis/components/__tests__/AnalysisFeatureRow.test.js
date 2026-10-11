import React from "react";
import { render, screen } from "@testing-library/react";
import AnalysisFeatureRow from "../AnalysisFeatureRow";
import "@testing-library/jest-dom";

describe("AnalysisFeatureRow Component", () => {
    test("renders the icon, title and description", () => {
        render(
            <AnalysisFeatureRow
                icon={<span data-testid="row-icon" />}
                title="Library overview"
                description="Key statistics about your music library"
            />
        );

        expect(screen.getByTestId("row-icon")).toBeInTheDocument();
        expect(screen.getByText("Library overview")).toBeInTheDocument();
        expect(screen.getByText("Key statistics about your music library")).toBeInTheDocument();
    });
});
