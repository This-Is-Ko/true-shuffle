# Mobile Shuffle Body Redesign — Plan

## Scope

Restructure the **body** of the Shuffle page (`/shuffle`) on mobile only, to match
the supplied mockup. The existing top `Header` (`Header.js` AppBar) is **out of
scope and unchanged**, as is the in-page `"Shuffle"` heading rendered by
`App.js`.

The mockup shows four body regions:

1. Two stat pills (playlists shuffled / tracks shuffled) — no section heading.
2. Search field with the playlist count embedded in the placeholder.
3. A 3-column grid of playlist tiles.
4. A bottom tab bar: **Shuffle** / **History** / **How To**.

Mobile = MUI `breakpoint.down('md')` (< 900px), matching the existing convention
in `ShufflePageSidebar.js` and `CounterTooltipChip.js`.

## Agreed decisions

| # | Decision |
| --- | --- |
| 1 | Keep the existing `"Shuffle"` heading (`App.js:37`). No "Shuffled" section label above the pills. |
| 2 | Pills show the user's current **playlists shuffled** and **tracks shuffled** (`user_shuffle_counter.playlist_count` / `track_count`), each rendered as icon + number + word (e.g. `≡ 396 playlists`, `♪ 644,477 tracks`). |
| 3 | History tab shows the same content as the current Recent Shuffles table (`RecentShufflesTable.js`). |
| 4 | Tiles are unchanged (`PlaylistItem.js` as-is); only the grid arrangement changes to 3 per row on mobile. |
| 5 | Mobile actions: hide Analyze Library and Share Library. Show only a **delete** `IconButton` (bin icon) to the right of the search bar — greyed out when there are no shuffled playlists, and requiring confirmation before deleting. |
| 6 | Remove the left-edge drawer/handle on mobile. `ShufflePageSidebar` becomes desktop-only (`md+`) and is unchanged on desktop. |
| 7 | The bottom bar has three items: **Shuffle**, **History**, **How To**. "How To" opens the existing `HowToModal` (reusing `HowToShuffleEntry`, already wired in `ShufflePage.js`). |
| 8 | Selecting **History** swaps the body content in place (local state in `ShufflePage`); no route/URL change. |
| 9 | Remove the "Select a playlist" title row on mobile (its How-To icon moves to the bottom bar). |

## Current implementation (relevant files)

| File | Role |
| --- | --- |
| `src/App.js` | Renders the `"Shuffle"` `Typography` heading + `/shuffle/*` route. |
| `src/pages/ShufflePage.js` | Composes `PlaylistContainer` (the body) + `Footer`. |
| `src/features/shuffle/components/PlaylistContainer.js` | Loads playlists/recents; renders `ShufflePageSidebar` + `PlaylistList`. Holds `userShuffleCounter` and `recentShuffles`. |
| `src/features/shuffle/components/ShufflePageSidebar.js` | Desktop sidebar + mobile drawer (green left-edge handle). |
| `src/features/shuffle/components/PlaylistList.js` | Card header (title + How-To), search + count, grid/selected-state layouts. Grid is `xs: repeat(2, 1fr)`. |
| `src/features/shuffle/components/PlaylistItem.js` | Playlist tile (image + name + owner). |
| `src/features/shuffle/components/SidebarStatistics.js` | "Playlists Shuffled" / "Tracks Shuffled" figures (in sidebar/drawer). |
| `src/features/shuffle/components/RecentShufflesTable.js` | Recent shuffles list (in sidebar/drawer). |
| `src/utils/NumberFormatter.js` | `formatNumberWithSpaces` (space thousands separator). |

## Changes required

### 1. Bottom tab bar — new `MobileBottomNav`
- New component rendering a MUI `BottomNavigation` fixed to the viewport bottom
  with three items: **Shuffle** (`Shuffle` icon), **History** (`History` icon),
  and **How To** (`HelpOutline` icon).
- "How To" opens the existing `HowToModal` (its open/close state already lives in
  `ShufflePage.js`) rather than acting as a content tab.
- "History" swaps the main body content in place (local state), and "Shuffle"
  swaps back — no URL/route change.
- Rendered only on the shuffle page and only at `down('md')`.
- Respect iOS safe area (`padding-bottom: env(safe-area-inset-bottom)`).
- Add matching bottom padding to the page so the bar never covers the last grid
  row or the `Footer`.

### 2. Stat pills — new `ShuffleStatsPills`
- Two chips fed from `userShuffleCounter` (already in scope in
  `PlaylistContainer.js`).
- Reuse the `CounterTooltipChip` pattern where possible.
- Handle the case where `user_shuffle_counter` is absent (backend only returns it
  when the user's `trackers_enabled` flag is true —
  `backend/app/services/playlist_service.py:118-131`): hide the pills or fall
  back to library totals.
- Number formatting: the mockup uses commas (`644,477`); the existing helper uses
  spaces. Add a comma formatter (or extend `NumberFormatter.js`).

### 3. Search field & header title (`PlaylistList.js`)
- Placeholder becomes `Search {allPlaylistsCount} playlists` using the total
  (unfiltered) count.
- On mobile, drop the separate count line + divider that currently sit below the
  field (`getPlaylistCountText`, `PlaylistList.js:287-297`).
- On mobile, remove the "Select a playlist" title row (`PlaylistList.js:176-224`,
  including the How-To `IconButton`, which moves to the bottom bar).
- Keep the state-specific titles ("Shuffling playlist" / "Playlist shuffled!")
  unless told otherwise, since they communicate progress in the selected state.

### 4. Grid (`PlaylistList.js`)
- Change the playlist grid from `xs: repeat(2, 1fr)` to `xs: repeat(3, 1fr)`
  (`PlaylistList.js:319-323`); reduce `xs` gap to suit the narrower tiles.

### 5. Delete button — mobile search bar
- Place an icon-only delete button (bin) at the right of the search field on
  mobile.
- Reuse the confirmation flow in `DeleteShuffledPlaylists.js` (currently a
  full-width button + confirmation `Dialog`). Cleanest approach: generalize it to
  render either the existing full-width button (desktop/sidebar) **or** an
  `IconButton` variant (mobile), sharing one `Dialog`; expose a `disabled` state
  driven by `existingShuffledPlaylistCount`.
- Greyed/disabled when `existingShuffledPlaylistCount` is `null` or `0`. Note the
  current code only renders the button when count > 0
  (`SidebarActionButtonsCard.js:68`) — mobile needs it always visible but
  disabled.
- Needs `existingShuffledPlaylistCount` passed into `PlaylistList` (today it is
  only passed to `ShufflePageSidebar`).

### 6. Drawer removal on mobile (`ShufflePageSidebar.js`)
- Remove the green left-edge handle and the mobile `Drawer`; render the sidebar
  only at `md+` (desktop unchanged).
- On mobile this also removes the drawer's stats (now the pills), recent shuffles
  (now the History tab), and Analyze/Share/Delete (now hidden or the search-bar
  delete).

### 7. History tab — new `MobileHistoryView`
- Full-width mobile view that reuses `RecentShufflesTable` content.
- Shown by swapping the body content in place via local tab state in
  `ShufflePage.js` (no route change).

### 8. Wiring (`PlaylistContainer.js`, `ShufflePage.js`)
- Pass `userShuffleCounter`, `recentShuffles`, and
  `existingShuffledPlaylistCount` through to the new mobile components.
- Add bottom padding for the fixed nav.

### 9. Tests
- Update `PlaylistList.test.js` for the new search placeholder/count behaviour.
- Add tests for `ShuffleStatsPills`, `MobileBottomNav`, `MobileHistoryView`.
- `PlaylistItem.test.js` should be unaffected.

## Open questions / discrepancies

None — all resolved. Ready to implement per the phasing below.

## UX issues / risks

- **Pill semantics.** "396 playlists" next to a search showing "27 playlists"
  reads inconsistently — one is cumulative shuffles, the other is library size.
  Consider wording/tooltip to disambiguate.
- **Absent counters.** `user_shuffle_counter` is not always returned, so pills can
  be empty for some users without a fallback.
- **Delete discoverability.** A bin icon in the search bar is less discoverable
  than the current labelled button; ensure the disabled state and confirmation
  copy are clear, and that it can't be mistaken for "clear search".
- **Tile truncation.** 3 columns at ~360px yields ~100px tiles; names will
  truncate aggressively (owner names too).
- **Layout overlap.** Fixed bottom nav vs. `Footer` and page bottom padding; iOS
  safe-area inset.
- **Empty History.** Ensure a sensible empty state when there are no recent
  shuffles.
- **Accessibility.** Tab semantics/roles, pill labels, and contrast of the
  inactive (grey) tab icon.

## Phasing

1. Grid + search changes (smallest, isolated: `PlaylistList.js`, formatter).
2. Stat pills + bottom nav shell (`PlaylistContainer.js`, new components).
3. Search-bar delete button (generalize `DeleteShuffledPlaylists.js`).
4. Remove the mobile drawer/handle; make `ShufflePageSidebar` desktop-only.
5. History view wiring.
6. Tests + docs.

## Implementation status

All phases implemented on branch `mobile-shuffle-body-redesign`.

**New components**
- `ShuffleStatsPills.js` — stats pills (icon + count + noun, comma-formatted).
- `MobileBottomNav.js` — fixed bottom nav (Shuffle / History / How To).
- `MobileHistoryView.js` — recent shuffles for the History tab, with empty state.

**Edited**
- `PlaylistList.js` — centred pills on mobile; search placeholder unchanged, with
  the playlist count shown underneath (updating to "Showing x of y" while
  searching); title row hidden on mobile grid view; 3-across grid; mobile delete
  `IconButton` beside the search field.
- `PlaylistContainer.js` — mobile `activeTab` state; renders `MobileBottomNav`
  + `MobileHistoryView`; passes stats/delete props through; full width on mobile.
- `ShufflePageSidebar.js` — desktop-only (mobile drawer/handle removed).
- `DeleteShuffledPlaylists.js` — `variant` (`button` | `icon`) + `disabled` props.
- `ShufflePage.js` — bottom padding clears the fixed nav.
- `NumberFormatter.js` — added `formatNumberWithCommas`.
- `setupTests.js` — added a `matchMedia` polyfill for `useMediaQuery` in tests.

**Follow-up styling (not in the original plan)**
- The middle container (`PlaylistList` `Card`) is now transparent on mobile
  (`backgroundColor: { xs: 'transparent', md: '#181818' }`) with padding reduced
  to `xs: 0.5`, and the container width is `100%` on mobile (`PlaylistContainer`),
  so the grid uses most of the page width. Desktop is unchanged.

**Tests**
- `PlaylistList.test.js` — mobile placeholder, title visibility, delete
  enable/disable.
- `ShuffleStatsPills.test.js`, `MobileBottomNav.test.js` — new.
- `PlaylistItem.test.js` retains 2 pre-existing failures unrelated to this work
  (the component does not render an "Open" button; the parent does).

**Tooling note:** `node_modules` was reinstalled to repair a corrupted
`@mui/material` install (not part of the change; `node_modules` is gitignored).
