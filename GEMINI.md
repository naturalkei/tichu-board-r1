# Gemini Project Context — tichu-board-r1

Read `docs/project-context.md` first. It is the canonical project brief.

## Primary objectives
- Build a mobile-first Tichu score calculator as a SolidJS SPA
- Preserve clean architecture and explicit domain rules
- Keep UX fast for real gameplay use
- Maintain high-quality local persistence, i18n, dark mode, and accessible motion
- Support Codex as the lead implementation agent

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
- provide outputs that are easy for Codex to validate and integrate

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

## Gemini-specific collaboration role
Use Gemini primarily for:
- implementation review and edge-case pressure testing
- UX concept exploration before UI implementation
- English and Korean copy refinement
- test scenario expansion
- visual asset prompt design and image generation support

Codex remains responsible for:
- final architecture choices
- code integration
- repository mutations
- validation and completion decisions

## Gemini image generation guidance
When using Gemini image generation, including Nano Banana 2 style image workflows if available in the active Gemini environment, treat the output as a reusable product asset request, not just a one-off illustration.

For each requested asset, define:
- target surface: app UI, onboarding, empty state, documentation, social preview
- format goal: `svg`, `png`, or `webp`
- aspect ratio and minimum resolution
- whether text will be added later in-code or baked into the image
- light and dark theme compatibility
- whether the asset is decorative or instructional

Prompt guidance:
- keep the scene relevant to a four-player Tichu table context
- favor clean shapes and strong readability over ornate detail
- avoid tiny UI text embedded inside generated images
- request generous negative space when the asset may sit behind live UI
- prefer palette direction that can coexist with both English and Korean typography

Expected handoff to Codex:
- prompt used or prompt summary
- intended file name
- intended destination path
- usage note describing where the asset should appear
- any known issues such as cropped hands, unreadable cards, or theme mismatch
