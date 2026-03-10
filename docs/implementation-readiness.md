# Implementation Readiness

This document closes the immediate gaps between the current context bundle and actual project execution.

Use it before starting scaffold, feature work, or generated asset integration.

## Current project state
- Collaboration and source-of-truth docs are in place
- Agent role boundaries are defined
- Visual asset generation workflow is defined
- The application scaffold and runtime code are not yet present in the repository

## Immediate risks to resolve next
- No SolidJS + Vite + TypeScript app scaffold exists yet
- No package manifest or toolchain config is present yet
- No domain model or scoring engine exists yet
- No local persistence schema exists yet
- No i18n dictionaries or theme system exists yet
- No CI workflows, release-please config, or Pages deployment files exist yet
- No Stagehand or Vitest baseline exists yet

## Recommended execution order
1. Scaffold the SolidJS SPA with Node.js v24-compatible tooling
2. Add lint, test, build, Tailwind v4, and basic app shell
3. Create domain types and pure scoring engine with unit tests
4. Create storage schema, migrations, and hydration tests
5. Build party setup and round entry flows
6. Add scoreboard, history editing, and end-game state
7. Add i18n, dark mode, and reduced-motion support across the UI
8. Add Stagehand smoke coverage for core mobile flows
9. Add GitHub Actions, Pages deployment, and release-please
10. Introduce generated visual assets only after core flows are stable

## Visual asset hold points
Do not prioritize generated imagery until all of the following are true:
- core mobile round entry flow exists
- score readability is validated without decorative art
- theme tokens for light and dark mode are in place
- asset destination path is decided
- payload budget for images is defined

## Definition of ready for Gemini asset generation
- the target UI surface exists or is at least wireframed
- exact aspect ratio is known
- the asset is decorative or instructional by explicit decision
- text overlay responsibility is clear
- Codex has named the expected destination file and path

## Definition of ready for Cursor UI polish
- base interaction flow is already implemented
- content hierarchy is stable enough to refine
- motion goals are tied to concrete user actions
- reduced-motion fallback behavior is known

## Suggested first implementation slice
- app scaffold
- shared layout shell
- domain scoring constants and types
- one normal round calculator path with tests

This is the smallest slice that reduces the highest project risk while preserving the Codex-led workflow.
