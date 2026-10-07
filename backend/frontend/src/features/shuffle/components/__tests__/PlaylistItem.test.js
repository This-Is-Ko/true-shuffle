import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PlaylistItem from "../PlaylistItem";
import PLAYLIST_ITEM_DISPLAY_STATES from "../../state/PlaylistItemDisplayStates";
import "@testing-library/jest-dom";

const mockPlaylist = {
    name: "My Playlist",
    owner: { display_name: "User123" },
    images: { url: "https://example.com/image.jpg" },
};

const mockSetSelectedPlaylist = jest.fn();

describe("PlaylistItem Component", () => {
    test("renders skeleton while loading", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.LOADING}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        expect(screen.getAllByTestId("playlist-skeleton")).toHaveLength(3);
    });

    test("displays playlist name and owner when loaded", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        expect(screen.getByText("My Playlist")).toBeInTheDocument();
        expect(screen.getByText("User123")).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/image.jpg");
        expect(screen.queryByTestId("playlist-skeleton")).toBeNull();
    });

    test("does not display shuffle button in shuffled state (button rendered outside card)", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                playlistUri="https://open.spotify.com/playlist/123"
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        // Button should not be in the card when in SHUFFLED state
        // (it's rendered outside by the parent component)
        expect(screen.queryByText(/open/i)).not.toBeInTheDocument();
    });

    test("displays open button when playlistUri is provided and not in shuffled/shuffling state", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlistUri="https://open.spotify.com/playlist/123"
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const openButton = screen.getByText(/open/i);
        expect(openButton).toBeInTheDocument();
        expect(openButton.closest("a") || openButton).toHaveAttribute("href", "https://open.spotify.com/playlist/123");
    });

    test("does not display open button when playlistUri is not provided", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        expect(screen.queryByRole("button", { name: /open/i })).not.toBeInTheDocument();
    });

    test("clicking the card updates selected playlist", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        fireEvent.click(screen.getByRole("img")); // Clicking anywhere in the card
        expect(mockSetSelectedPlaylist).toHaveBeenCalledWith(mockPlaylist);
    });

    test("applies hover effects in selection state", async () => {
        const { container } = render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = container.querySelector(".MuiCard-root");
        expect(card).toBeInTheDocument();
        
        // Material-UI applies its own transition styles, so we check for cursor pointer instead
        expect(card).toHaveStyle("cursor: pointer");

        // Hover in
        fireEvent.mouseOver(card);
        await waitFor(() => {
            expect(card).toHaveStyle("transform: scale(1.05)");
        });
    });

    test("handles missing playlist data gracefully", () => {
      render(
          <PlaylistItem
              displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
              playlist={{}} // Empty playlist data
              setSelectedPlaylist={mockSetSelectedPlaylist}
          />
      );
      expect(screen.queryByText("My Playlist")).not.toBeInTheDocument();
      expect(screen.queryByText("User123")).not.toBeInTheDocument();
    });

    test("handles missing playlist name gracefully", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={{
                    owner: { display_name: "User123" },
                    images: { url: "https://example.com/image.jpg" }
                }}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );
        expect(screen.queryByText("My Playlist")).not.toBeInTheDocument();
        expect(screen.queryByText("User123")).not.toBeInTheDocument();
    });

    test("handles missing playlist images gracefully", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={{
                    name: "My Playlist",
                    owner: { display_name: "User123" }
                }}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );
        expect(screen.queryByText("My Playlist")).not.toBeInTheDocument();
        expect(screen.queryByText("User123")).not.toBeInTheDocument();
    });

    test("does not call setSelectedPlaylist when clicking in SHUFFLED state", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = screen.getByRole("img").closest(".MuiCard-root");
        fireEvent.click(card);
        expect(mockSetSelectedPlaylist).not.toHaveBeenCalled();
    });

    test("does not call setSelectedPlaylist when clicking in SHUFFLING state", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = screen.getByRole("img").closest(".MuiCard-root");
        fireEvent.click(card);
        expect(mockSetSelectedPlaylist).not.toHaveBeenCalled();
    });

    test("does not call setSelectedPlaylist when setSelectedPlaylist is not provided", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={mockPlaylist}
            />
        );

        const card = screen.getByRole("img").closest(".MuiCard-root");
        fireEvent.click(card);
        // Should not throw error
        expect(card).toBeInTheDocument();
    });

    test("applies different styling in SHUFFLED state", () => {
        const { container } = render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = container.querySelector(".MuiCard-root");
        expect(card).toHaveStyle("background: rgb(35, 35, 35)"); // #232323
    });

    test("applies different styling in SHUFFLING state", () => {
        const { container } = render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = container.querySelector(".MuiCard-root");
        expect(card).toHaveStyle("background: rgb(35, 35, 35)"); // #232323
    });

    test("does not display open button in SHUFFLING state", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING}
                playlistUri="https://open.spotify.com/playlist/123"
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        expect(screen.queryByText(/open/i)).not.toBeInTheDocument();
    });

    test("renders SHUFFLING state with playlist content", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLING}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        expect(screen.getByText("My Playlist")).toBeInTheDocument();
        expect(screen.getByText("User123")).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    test("open button has correct attributes", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlistUri="https://open.spotify.com/playlist/123"
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const openButton = screen.getByText(/open/i).closest("a");
        expect(openButton).toHaveAttribute("href", "https://open.spotify.com/playlist/123");
        expect(openButton).toHaveAttribute("target", "_blank");
    });

    test("image has correct alt text", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const image = screen.getByRole("img");
        expect(image).toHaveAttribute("alt", "My Playlist");
    });

    test("handles touch events in SELECTION state", () => {
        const { container } = render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SELECTION}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = container.querySelector(".MuiCard-root");
        
        // Simulate touch start
        fireEvent.touchStart(card);
        expect(card).toHaveStyle("background: rgb(35, 35, 35)"); // #232323
        expect(card).toHaveStyle("transform: scale(1.05)");
        
        // Simulate touch end
        fireEvent.touchEnd(card);
        expect(card).toHaveStyle("background: rgb(24, 24, 24)"); // #181818
        expect(card).toHaveStyle("transform: scale(1)");
    });

    test("does not handle touch events in non-SELECTION state", () => {
        const { container } = render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = container.querySelector(".MuiCard-root");
        const initialBackground = card.style.background;
        
        // Simulate touch start
        fireEvent.touchStart(card);
        // Style should not change in SHUFFLED state
        expect(card.style.background).toBe(initialBackground);
    });

});
