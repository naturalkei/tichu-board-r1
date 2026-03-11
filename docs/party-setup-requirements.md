# Party Setup Requirements

This document defines the current redesign requirements for the party setup screen.

## Purpose
- make party setup comfortable on narrow mobile screens
- make the seat table feel like a real tabletop layout
- separate player tokens from seat targets
- preserve fast setup for repeated local games

## Current Problems
- team color controls allow the user to target a color that is already active on the other team
- the screen reads like fixed player cards arranged in a grid, not like a table with seats
- the current seat interaction does not feel like dragging names onto seats
- the player editor sheet has too much transparency and blur, which hurts readability

## Non-Negotiable Constraints
- exactly 4 players
- opposite seats always define teams
- player names must stay unique
- English and Korean must remain supported
- dark mode must remain supported
- mobile-first layout is required
- reduced-motion behavior must remain respected

## Mobile-First Layout Requirements
- primary design target is iPhone 12 portrait width
- the table must be visible as seat targets first, not as player cards first
- player roster and seat table must be visually separate layers
- the screen should avoid showing too many secondary controls at once
- team identity must remain obvious even when the center table area is compact

## Interaction Model Requirements
### Seat Table
- show four seat targets for north, east, south, and west
- seat targets should feel like distinct positions on a tabletop
- a seat target may be empty-looking or occupied-looking, but still represent the seat itself first

### Player Roster
- show the active four player names as draggable tokens separate from the seat table
- dragging a player token onto a seat should assign that player to the seat
- dropping onto an occupied seat should swap the players
- the roster must also support a tap fallback for touch-first flows:
  - tap a player token to arm it
  - tap a seat target to place or swap it

### Recent Players
- keep recent player names available as a quick replacement bench
- recent names should also support seat-target assignment with drag or tap fallback

### Editing
- tapping an occupied player or seat must still allow name editing and reroll
- moving a player and editing a player must not feel like the same action by accident
- quick actions must remain accessible from the editor, but the editor should not be required for all seat moves

## Team Color Requirements
- the color already used by the opposite team should be visibly disabled
- disabled colors must not be clickable
- team colors must stay distinct at all times
- team color selection should remain easy to scan on mobile

## Readability Requirements
- the editor sheet must use a more opaque surface
- foreground text contrast must stay high in light and dark themes
- blur and transparency should not reduce legibility of form fields or buttons

## Visual Direction
- the layout should feel like a compact game utility surface, not a generic settings form
- the table should have a clear center or table texture, but it must not dominate the mobile view
- motion should emphasize pick-up, placement, swap, and success states
- keep assets lightweight: SVG, gradients, and CSS effects are preferred

## Testing Requirements
- cover player rename flow
- cover seat reassignment via tap fallback
- cover drag-style reassignment behavior where supported by tests
- cover duplicate-name rejection
- cover disabled opposite-team color state
- cover recent-player assignment to a seat

## Agent Review Request
Share this requirements document with Gemini and Cursor before implementing major layout changes.

Ask Gemini for:
- mobile-first visual critique
- tabletop composition guidance
- drag and placement affordance ideas
- low-cost resource suggestions

Ask Cursor for:
- implementation structure
- state model simplification
- component boundaries
- test changes and edge cases

## Agent Feedback Snapshot
### Gemini
- use a diamond-shaped table with a separate player bench
- treat the table as seat targets and the bench as the source tray
- use an armed-state model so drag and tap fallback share the same mental model
- keep the center lightweight and more symbolic than structural on mobile
- consider merging active and recent players into one bench if vertical space stays tight

### Cursor
- attempted multiple CLI reviews against this requirements doc
- the agent launched successfully after workspace trust approval, but repeated non-interactive requests timed out in this environment before returning usable feedback
- implementation will proceed with the Gemini review, local codebase constraints, and follow-up room for a later Cursor pass
