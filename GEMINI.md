# Gemini Project Context — tichu-board-r1

Read `docs/project-context.md` first. It is the canonical project brief.

## Primary objectives
- Build a mobile-first Tichu score calculator as a SolidJS SPA
- Preserve clean architecture and explicit domain rules
- Keep UX fast for real gameplay use
- Maintain high-quality local persistence, i18n, dark mode, and accessible motion

## Expected behavior
When proposing or making changes:
- prefer small, verifiable steps
- keep scoring logic in pure functions
- avoid mixing product rules into presentational components
- optimize for quick score entry on mobile
- favor practical UX over theoretical completeness
- preserve English and Korean support
- preserve dark mode support
- preserve reduced-motion support

## Technical requirements
- Node.js v24
- SolidJS SPA
- Vite
- Vitest
- TypeScript
- ESLint 9
- Tailwind CSS v4
- no semicolons
- Stagehand for browser automation / smoke tests
- `localStorage` default persistence
- `release-please` for release management

## Product rules to keep stable
- 4 players only
- teams are opposite seats
- drag-and-drop seat reassignment supported
- per-player Tichu declarations: none / small / grand
- first-out player determines Tichu success
- optional double victory team
- automatic round and cumulative scoring
- end game at 1000+

## UX rules to keep stable
- mobile-first layout
- sticky summary or sticky primary action where useful
- large touch targets
- card-based history on mobile
- substantial motion for major feedback moments
- reduced motion fallback

## Delivery rules
- Keep commits focused and Conventional Commit compliant
- Keep GitHub Pages deployment separate from release automation
- Keep `release` branch as build artifact mirror
- Prefer explicit documentation when introducing structure

## When creating helpers
If repeated workflows appear, prefer lightweight reusable project docs or commands, but keep the main source of truth in `docs/project-context.md`.
