# Visual Asset Workflow

This document defines how to request, generate, review, and ship visual assets for `tichu-board-r1`.

`docs/project-context.md` remains the source of truth. This file narrows that guidance into a repeatable workflow.

## Goals
- keep the product usable without decorative imagery
- use generated visuals only where they improve comprehension or presentation
- make asset requests repeatable across Codex, Gemini, and Cursor
- keep mobile performance and dark-mode compatibility intact

## Ownership
- Codex owns final acceptance, file placement, and integration review
- Gemini is the preferred agent for prompt design and image generation requests, including Nano Banana 2 style workflows when available
- Cursor is the preferred agent for visual placement, spacing, and responsive composition after an asset is approved

## Asset request template
Use this before generating anything:

- Objective:
- Surface:
- Decorative or instructional:
- Audience moment:
- Aspect ratio:
- Minimum export size:
- Preferred format:
- Theme requirements:
- Safe text area needed:
- Motion relationship:
- File destination:

## Prompt template
Use this as a starting point for Gemini image generation requests.

```text
Create a visual asset for a mobile-first Tichu score calculator web app.

Objective: [describe the exact UI or documentation purpose]
Surface: [onboarding / empty state / social preview / docs / other]
Composition: [portrait / square / landscape] with clear negative space for UI overlays if needed
Scene: four-player Tichu table context, modern tabletop atmosphere, clean shapes, readable silhouette
Style: polished but practical, game-night energy, not fantasy splash art
Color: must remain legible in both light and dark UI surroundings
Text: avoid embedded small text unless explicitly requested
Output: optimized for product use, not poster detail
Avoid: clutter, illegible cards, crowded hands, fake UI text, muddy contrast
```

## Review checklist
Before an asset is accepted:
- it clearly supports a real product surface
- it does not replace interactive UI or readable live text
- it still looks correct when scaled for mobile
- it works in light and dark theme contexts
- it can be compressed to a reasonable payload size
- its provenance is clear enough to keep in the repo

## Naming and storage
- Use lowercase kebab-case names
- Prefer stable destinations under `public/` for static assets
- Use `src/assets/` only when import-based bundling is preferable
- Keep prompt notes near the feature docs or in the PR description if the asset is intended to be regenerated later

## Suggested deliverables from Gemini
Each handoff should include:
- final selected prompt or concise prompt summary
- recommended filename
- intended dimensions and format
- usage note
- known flaws or retouch needs

## Suggested deliverables from Cursor
Each integration handoff should include:
- files changed
- responsive behavior notes
- dark-mode behavior notes
- whether reduced-motion handling was affected
