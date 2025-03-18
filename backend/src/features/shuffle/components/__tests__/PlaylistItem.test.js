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

        expect(screen.getAllByTestId("playlist-skeleton")).toHaveLength(4);
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

    test("displays shuffle button in shuffled state", () => {
        render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.SHUFFLED}
                playlistUri="https://open.spotify.com/playlist/123"
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const shuffleButton = screen.getByText(/open/i);
        expect(shuffleButton).toBeInTheDocument();
        expect(shuffleButton).toHaveAttribute("href", "https://open.spotify.com/playlist/123");
    });

    test("does not display shuffle button when not in shuffled state", () => {
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

    test("applies hover effects", async () => {
        const { container } = render(
            <PlaylistItem
                displayState={PLAYLIST_ITEM_DISPLAY_STATES.LOADED}
                playlist={mockPlaylist}
                setSelectedPlaylist={mockSetSelectedPlaylist}
            />
        );

        const card = container.querySelector(".MuiCard-root");
        expect(card).toHaveStyle("transition: transform 0.2s ease-in-out");

        // Hover in
        fireEvent.mouseOver(card);
        expect(card).toHaveStyle("transform: scale(1.05)");
    });

    test("handles missing playlist data gracefully", () => {
      render(
          <PlaylistItem
              displayState={PLAYLIST_ITEM_DISPLAY_STATES.LOADED}
              playlist={{}} // Empty playlist data
              setSelectedPlaylist={mockSetSelectedPlaylist}
          />
      );
      expect(screen.queryByText("My Playlist")).not.toBeInTheDocument();
      expect(screen.queryByText("User123")).not.toBeInTheDocument();
  });

});
