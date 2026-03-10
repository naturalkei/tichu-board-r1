# AI Collaboration Playbook — tichu-board-r1

## Source of truth
All agents must treat `docs/project-context.md` as the primary project brief.

Wrapper files exist for tool-specific loading behavior:
- `AGENTS.md` for Codex
- `.cursor/rules/*.mdc` for Cursor
- `GEMINI.md` for Gemini

If instructions conflict, resolve them in this order:
1. `docs/project-context.md`
2. tool-specific wrapper for the current agent
3. current task prompt

## Recommended role split
### Codex
Best fit for:
- repository bootstrap
- CLI-driven setup
- GitHub Actions
- release-please setup
- scoring engine implementation
- test scaffolding
- storage and migration logic
- final integration and acceptance

### Cursor
Best fit for:
- component ergonomics
- UI structure iteration
- interaction polish
- animation refinement
- responsive layout cleanup
- repeated in-editor refactors
- integrating approved visual assets into the UI

### Gemini
Best fit for:
- architecture review
- implementation planning
- QA scenario design
- docs and explanatory content
- i18n copy review
- cross-checking release or workflow design
- image prompt creation and visual asset generation

## Codex-led operating model
- Codex owns the executable plan, merge-ready edits, and final verification
- Cursor and Gemini should work as bounded contributors with explicit deliverables
- If another agent proposes structural changes, Codex should reconcile them against `docs/project-context.md` before adoption
- Keep collaboration additive: proposals first, repository mutation second

## Asset generation workflow
Use Gemini image generation when custom visuals materially improve product clarity or presentation.

### Good use cases
- onboarding illustrations
- empty-state artwork
- social preview graphics
- store-like mockup visuals for docs
- lightweight thematic graphics that reinforce the table-game feel

### Bad use cases
- text-heavy score panels
- critical controls
- anything that replaces readable live UI with rasterized text
- large unoptimized background images on score-entry screens

### Required handoff for generated assets
- asset objective
- prompt or prompt summary
- output dimensions and format
- intended path in the repo
- light/dark compatibility note
- whether additional editing or compression is still required

### Integration flow
1. Gemini drafts the prompt and generates candidate assets
2. Codex or the user selects the asset worth shipping
3. Cursor may place and tune the asset in the UI
4. Codex verifies payload size, accessibility impact, and final integration

## Handoff protocol
Every handoff note should include:
- objective completed
- files changed
- commands run
- results of lint / test / build if run
- known risks
- exact next recommended step

## Concurrency rules
- Avoid having multiple agents edit the same file at the same time
- Prefer one branch or one feature area per agent at a time
- Re-read the latest source-of-truth docs after pulling new changes
- Re-run relevant checks after resolving merge conflicts
- Prefer handing generated assets to Codex before UI integration so naming and placement stay consistent

## Suggested phased workflow
### Phase 1 — bootstrap
Use Codex for:
- repo init
- stack setup
- lint/test/build baseline
- release-please and Pages workflows

### Phase 2 — product implementation
Use Codex or Cursor for:
- domain logic
- round flow
- persistence
- scoreboard

Use Cursor heavily for:
- mobile layout refinement
- drag-and-drop polish
- motion tuning
- asset placement and responsive art direction

### Phase 3 — quality and docs
Use Gemini for:
- scenario review
- docs cleanup
- edge-case checklist
- bilingual UX copy review
- image prompt iteration and resource generation

Then use Codex or Cursor to apply concrete fixes.

## Shared quality bar
No agent should consider work complete unless the change still satisfies:
- mobile usability
- correct scoring logic
- no-semi rule
- i18n safety
- dark mode safety
- reduced-motion safety
- Conventional Commit readiness

## Immediate next docs
- Use `docs/implementation-readiness.md` as the first execution checklist before starting app scaffolding or asset production
