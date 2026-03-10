# tichu-board-r1 — Project Context

## 1. Project identity
- Repository name: `tichu-board-r1`
- Product: open-source score calculator for the board game **Tichu**
- Platform: static web app, deployed to GitHub Pages
- App type: **SolidJS SPA** only (no SSR, no backend)

## 2. Mission
Build a fast, mobile-first, animation-rich Tichu score calculator that is easy to use during real gameplay.

The app must feel lightweight, responsive, and practical at the table. It should support quick round entry, clear cumulative scoring, and resilient local persistence.

## 3. Non-negotiable constraints
- Use **Node.js v24**
- Use **SolidJS + Vite + TypeScript**
- Use **Vitest** for tests
- Use **ESLint 9**
- **No semicolons**
- Use **Tailwind CSS v4**
- Use **Stagehand** for browser automation / smoke tests
- Persist data locally using `localStorage` by default
- Use **Google Fonts** and **Lucide Icons** if needed
- Support **English** and **Korean** from the beginning
- Support **dark mode** from the beginning
- Optimize for **mobile first**
- Add **meaningful UI animations aggressively**, but keep them accessible
- Respect `prefers-reduced-motion`
- Versioning and releases must use **release-please**, not `standard-version`

## 4. Product scope
### 4.1 Party setup
- Exactly 4 players
- Generate default random names, but allow editing
- Show seats as a circle or clear 2x2 table layout
- Support drag-and-drop seat changes
- Teams are always **opposite seats**
- Show both teams clearly before game start

### 4.2 Round entry
For each round, the UI must support:
- per-player Tichu call:
  - `none`
  - `small`
  - `grand`
- select the **first-out player**
- select optional **double victory team**
- score input modes:
  - default MVP: **team score input**
  - optional later expansion: player-by-player score input
- per-round validation and clear feedback

### 4.3 Score summary
- Compute round total automatically
- Compute cumulative team totals automatically
- Show round history
- Allow edit / delete / duplicate round
- Recompute cumulative totals after any history change

### 4.4 End condition
- The game ends when a team reaches **1000 or more** at the end of a round
- If both teams pass 1000 in the same round, the higher score wins

## 5. Tichu rules to encode in scoring logic
Treat the scoring engine as a pure domain module. Keep UI concerns out of it.

Key rules to encode:
- Tichu calls are **per-player**, not per-team
- `small` succeeds only if the calling player goes out first (+100); otherwise, it fails (-100)
- `grand` succeeds only if the calling player goes out first (+200); otherwise, it fails (-200)
- Multiple players (including teammates) can call Tichu; score each independently
- In a **double victory**, the winning team gets `+200` and card points are ignored
- In a normal round, card-point totals should validate to **100 total across both teams**
- Card points distribution:
  - 1st out: takes trick points won
  - Last out (4th): gives remaining hand to the opponent team; gives won trick points to the 1st out player
- Permit negative team totals when needed
- UI should disable normal card-point entry when double victory is active
- **Tie-breaking**: If both teams pass 1000 in the same round with the exact same score, play one more round to determine the winner.

Use constants for rule values. Avoid magic numbers in UI components.

## 6. UX and UI requirements
### 6.1 Mobile-first
- Design for phone portrait mode first
- Major actions should be reachable with one hand
- Use large touch targets
- Prefer stacked cards over dense tables on mobile
- Use sticky score summary or sticky action bar where it helps round entry
- Avoid layout jumps when the keyboard opens
- Support safe-area insets

### 6.2 Animation and interaction
The app should feel alive and game-like.

Use animations for:
- initial screen / section entrance
- seat drag-and-drop feedback
- Tichu call selection feedback
- save success feedback
- score changes and cumulative total updates
- round history insert / remove transitions
- error / validation feedback
- winner banner and end-of-game state
- dark-mode transitions

Animation principles:
- fast and clear
- purposeful, not decorative noise
- preserve performance on mid-range mobile devices
- provide reduced-motion fallback
- prefer CSS / Tailwind transitions and small utilities over heavy animation libraries

### 6.3 Visual system
- Clean modern game utility UI
- Strong contrast in dark mode
- Keep typography readable on small screens
- Highlight leading team, successful Tichu calls, failed calls, and final winner

## 7. Technical architecture
### 7.1 App shape
- Single-page app
- Router optional; avoid complexity unless clearly useful
- No backend
- No auth
- No remote database

### 7.2 Suggested module boundaries
- `src/domain/` — scoring rules, validators, calculations
- `src/features/party-setup/`
- `src/features/rounds/`
- `src/features/scoreboard/`
- `src/features/settings/`
- `src/shared/` — UI primitives, utils, constants, i18n, theme
- `src/storage/` — persistence and migrations (e.g. `migrations.ts`)

Keep domain logic pure and testable.

### 7.3 State and persistence
- Default persistence: `localStorage`
- Use a versioned storage key, e.g. `tichu-board-r1:v1`
- Keep schema version in persisted data
- Support migration-friendly structure
- Provide reset capability
- Prefer derived values over storing redundant totals
- **State Management**: Use SolidJS `createStore` with Context API for global game state.
- **Internationalization**: Use `@solid-primitives/i18n` with dictionaries in `src/shared/i18n/`.

## 8. Code conventions
- Conventional Commits required
- Split changes into focused commits by concern
- Use `git` for commits
- Use `gh` CLI for repository creation, PR, release, and GitHub workflow operations when appropriate
- File naming:
  - general files and directories: `kebab-case`
  - components: `PascalCase`
- Prefer small components and small pure functions
- Avoid hidden coupling between components and scoring logic
- Avoid hardcoded display strings; use i18n dictionaries

## 9. GitHub and release workflow
### 9.1 Repository bootstrap
- Create the GitHub repository with `gh` CLI
- Repository name must be `tichu-board-r1`
- The project is public and open source

### 9.2 Branch strategy
- `main`: source of truth for code
- `release`: built static artifacts mirror branch

### 9.3 GitHub Pages
- Deploy with GitHub Actions
- Also sync built output to `release` branch
- Configure Vite base path for project pages

### 9.4 Release automation
Use **release-please**.

Requirements:
- Conventional Commits are mandatory
- release-please manages version bumps, changelog, tags, and GitHub releases
- Use manifest-based config files:
  - `release-please-config.json`
  - `.release-please-manifest.json`
- Keep Pages deployment workflow separate from release automation workflow

## 10. Testing requirements
### 10.1 Unit tests
Must cover:
- Tichu call success / failure
- double victory handling
- round total calculation
- cumulative total calculation
- end-game detection
- storage serialization / hydration / migration behavior

### 10.2 Component tests
Must cover:
- party setup
- round entry form
- scoreboard / cumulative totals
- settings toggles
- i18n rendering changes
- dark mode toggles

### 10.3 Stagehand smoke tests
Must cover:
- start a new game
- edit player names
- rearrange seats
- enter a normal round
- enter a double victory round
- verify cumulative score updates
- reload and confirm local persistence
- switch language
- switch dark mode
- validate mobile viewport flows

## 11. Accessibility and resilience
- Honor `prefers-reduced-motion`
- Keep keyboard access reasonable even though mobile-first is primary
- Use semantic HTML where practical
- Keep focus states visible
- Prevent destructive actions without clear intent
- Make error messages specific and actionable

## 12. Definition of done
A task is not done unless applicable checks pass.

Minimum done criteria for implementation work:
- lint passes
- relevant tests pass
- build passes
- changes respect no-semi rule
- i18n and dark mode are not broken
- mobile layout remains usable
- animations do not block core interaction
- commit messages follow Conventional Commits

## 13. Working style expected from the coding agent
When implementing:
1. Read this file first
2. Make a short plan
3. Change the smallest coherent set of files
4. Run only the necessary checks, then broader checks before finishing
5. Keep commits focused
6. Leave clear notes if anything is intentionally deferred

When making product decisions, prefer:
- simple over clever
- explicit over implicit
- fast data entry over visual flourish
- accessible animation over flashy animation
- maintainable structure over premature abstraction

## 14. Multi-agent execution model
This repository may use multiple coding agents, but execution ownership stays clear.

### 14.1 Lead agent model
- Codex is the implementation lead and final integrator
- Gemini and Cursor should be used as supporting agents, not competing sources of truth
- Any agent-specific guidance must remain consistent with this file
- When outputs conflict, keep this priority:
  1. `docs/project-context.md`
  2. implementation already merged into the repository
  3. agent-specific wrapper docs
  4. task-local prompts or drafts

### 14.2 Recommended agent split
- Codex:
  - planning final task breakdown
  - domain model and scoring engine decisions
  - storage model and migrations
  - repository setup, CI, GitHub Actions, release-please
  - final code integration, verification, and commit preparation
- Cursor:
  - component structure iteration
  - layout cleanup
  - interaction and animation polish
  - low-risk refactors within already approved architecture
- Gemini:
  - implementation review
  - UI concept exploration
  - bilingual copy review
  - test scenario expansion
  - visual asset prompt drafting and image generation support

### 14.3 Collaboration guardrails
- Avoid parallel edits to the same file
- Keep one agent responsible for one feature slice at a time
- Re-read this file after pulling or merging significant changes
- Treat agent output as a proposal until it is validated in-repo
- Record handoff notes with changed files, checks run, risks, and next step

## 15. Visual asset generation policy
Generated visual resources may be used, but they must stay subordinate to app usability.

### 15.1 Asset principles
- Core gameplay flows must work without decorative images
- Prefer lightweight assets that do not slow mobile rendering
- Generated assets should support atmosphere, onboarding, empty states, social previews, and documentation
- Do not make score readability or interaction depend on image-heavy UI
- Preserve strong contrast in light and dark themes

### 15.2 Gemini image workflow
- Use Gemini image generation when custom visuals are needed and a reusable local asset is justified
- Default use case: themed illustrations, simple table-scene imagery, onboarding art, Open Graph images, and store-like preview assets
- Keep prompts grounded in this product:
  - mobile-first Tichu scorekeeping
  - four-player table context
  - clean modern game utility UI
  - English and Korean support
  - dark-mode-compatible color decisions
- Before generating images, define:
  - target surface
  - aspect ratio
  - safe text area
  - whether the output is decorative or instructional

### 15.3 Asset delivery constraints
- Save source prompts or prompt summaries in project docs when the asset is expected to be reused
- Prefer `webp`, `png`, or `svg` depending on the asset type
- Use descriptive lowercase kebab-case filenames
- Store shipped assets under a stable app-owned path such as `public/` or `src/assets/`
- Optimize exported assets for mobile payload size before merging
- Do not commit assets with unclear licensing or provenance
