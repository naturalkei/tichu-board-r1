# Party Setup V2 Requirements

This document defines the next redesign pass for the party setup screen.

## Goals
- make the seat table feel like a tabletop with positions, not four frozen player cards
- keep only essential information on the table itself
- support faster reuse of recent players without opening the editor for every move
- improve readability and visual confidence on mobile

## Current Screen Inventory
### On-table elements currently visible
- seat chip
- team chip
- player name
- helper text
- center table panel

### Problems with the current composition
- too much text is still visible on the table at once
- the table still reads as occupied cards rather than seat targets
- bench and table are separated, but the table targets are still too verbose
- the editor popup still feels too translucent and not dominant enough

## Required Information Hierarchy
### Always visible on the table
- seat overlay: `N`, `W`, `E`, `S`
- player name
- team color cue

### Reduced or removed from the table
- remove long helper copy from each seat target
- avoid repeating both team direction text and other redundant labels on every seat
- keep the center table decorative and secondary

## Team Naming Requirements
- replace directional team labels as the primary team name with editable team names
- default team names:
  - English: `Team 1`, `Team 2`
  - Korean: `1팀`, `2팀`
- allow editing team names in party setup
- still show player-pair composition as a secondary reference where useful

## Player Bench Requirements
- show 4 active player chips
- show 2 recent inactive player chips in the same bench area
- active and inactive chips must be visually distinct
- inactive recent chips must still be assignable to seats
- drag from the bench to a seat should assign or swap
- tap a chip then tap a seat should remain the mobile fallback

## Team Color Requirements
- already selected opposite-team colors must appear disabled
- disabled colors must update immediately when the other team changes color
- the current team color selection must remain obvious

## Seat Table Requirements
- add large `N`, `W`, `E`, `S` overlays that work for both Korean and English
- overlays should read as seat markers in the background, not as primary badges
- seat targets should feel larger and simpler than the current card treatment
- the table center should stay lightweight and not compete with seats

## Editor Requirements
- mobile editor must open as a fixed fullscreen popup
- it must not be occluded by the bottom dock
- the surface opacity should be about 0.9 equivalent or stronger
- text fields and action buttons need stronger contrast than the current version

## Essential Comparison Process
Before implementing major visual changes:
1. capture the current screen structure from `src/features/party-setup/PartySetup.tsx`
2. summarize the mandatory and removable UI elements
3. share this document with Gemini for visual and interaction feedback
4. share a concise version with Cursor for implementation structure feedback
5. compare the proposals against the live UI source
6. apply only the parts that improve mobile clarity and do not violate the project context

## Gemini Review Ask
Ask Gemini to review:
- tabletop composition
- bold seat overlay treatment
- how little text should remain on each seat
- bench styling for active vs inactive recent players
- lightweight assets or SVG directions for the table layer

## Cursor Review Ask
Ask Cursor to review:
- component split between bench, seat target, and team settings
- state model for editable team names plus draggable chips
- test changes needed for the new hierarchy

## Validation Requirements
- team name editing persists
- disabled team colors update correctly
- active and inactive bench chips both render
- recent inactive chip can be assigned to a seat
- seat overlay labels render
- fullscreen editor opens and remains readable

## Agent Feedback Snapshot
### Gemini
- treat the seat map as physical targets with larger hit areas than the chips
- use large low-opacity `N`, `W`, `E`, `S` watermarks behind each seat
- make active bench chips saturated and elevated, while recent chips look muted and historical
- keep team names inline-editable and visually light, not heavy form controls
- use a premium fullscreen editor with stronger opacity and sticky confirmation

### Cursor
- split the screen into `SeatMapBoard`, `BenchPanel`, `TeamNameEditor`, and `FullscreenPartyEditor`
- add explicit team-name state and drag/hover UI state instead of overloading player state
- keep disabled color logic in pure functions and surface only disabled flags to the UI
- prioritize domain tests for invariants first, then UI tests for drag, disabled colors, and fullscreen editing

## Latest Review Notes
### Gemini follow-up
- simplify each seat to seat marker, player name, and one team cue only
- keep the table center decorative and mostly silent
- render recent bench names as muted ghosts with dashed borders
- raise editor opacity to a near-opaque surface and keep action buttons pinned to the bottom

### Cursor follow-up
- short implementation prompts timed out in this environment during the latest retry
- the previous Cursor guidance above remains the implementation baseline for component split and test focus

## Applied Decisions
- keep team naming editable as `Team 1` and `Team 2` defaults, with pair composition shown only as secondary metadata
- limit the seat cards to a large directional overlay, player name, and one small team-name pill
- keep exactly two recent inactive names visible on the bench
- use a fixed fullscreen editor on mobile with a sticky action bar so the bottom dock never occludes the save action
- validate disabled team colors with tests that re-check the opposite team's available colors after changes
