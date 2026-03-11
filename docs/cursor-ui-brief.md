# Cursor UI Briefs

This document packages the current UI redesign work into implementation-focused briefs that can be handed to Cursor for code review or collaboration.

## Shared Constraints
- Keep `main` as the source branch and make small reviewable changes
- Follow [project-context.md](./project-context.md)
- Preserve English and Korean support
- Preserve light, dark, and system themes
- Keep mobile-first layouts and safe-area handling
- Do not add backend services or remote persistence

## Brief A: Bottom Dock Refactor
### Goal
Refactor the bottom dock into an icon-led mobile control bar without regressing route switching or accessibility.

### Review Focus
- icon button sizing at phone widths
- active route contrast in light and dark themes
- settings action placement at the far edge
- label strategy: tiny caption vs visually hidden text with `aria-label`
- safe-area bottom padding and keyboard overlap behavior
- avoid excessive class-string duplication

### Expected Code Outcomes
- clearer dock button primitives or shared class groups
- route highlighting that is visually strong without relying on text
- reduced visual clutter while preserving semantics

## Brief B: Party Setup Rework
### Goal
Rebuild the party setup interaction so seat arrangement is reliable on touch devices and the layout is readable at 390px width.

### Review Focus
- touch-friendly seat swapping, not just desktop HTML drag-and-drop
- compact seat cards with popup-sheet editing
- recent player replacement flow
- duplicate-name prevention
- distinct team color enforcement
- team labels that derive from current player names
- clean state transitions when editing names, seats, and recent-name replacement

### Expected Code Outcomes
- a more explicit interaction state for seat moving
- tests that cover seat swap and duplicate-name protection
- team color assignment logic that prevents collisions
- UI copy and visual grouping aligned with tabletop play
