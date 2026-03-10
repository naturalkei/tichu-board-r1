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

### Cursor
Best fit for:
- component ergonomics
- UI structure iteration
- interaction polish
- animation refinement
- responsive layout cleanup
- repeated in-editor refactors

### Gemini
Best fit for:
- architecture review
- implementation planning
- QA scenario design
- docs and explanatory content
- i18n copy review
- cross-checking release or workflow design

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

### Phase 3 — quality and docs
Use Gemini for:
- scenario review
- docs cleanup
- edge-case checklist
- bilingual UX copy review

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
