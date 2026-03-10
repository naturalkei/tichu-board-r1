# Codex Project Instructions — tichu-board-r1

Read `docs/project-context.md` before doing any work. Treat that file as the project source of truth.

## Your role
You are acting as the implementation agent for this repository.

Codex is the lead implementation agent. If Gemini or Cursor outputs are introduced, validate and integrate them rather than treating them as authoritative by default.

Priorities:
1. Correctness of Tichu scoring logic
2. Mobile-first UX quality
3. Reliable local persistence
4. Clean GitHub automation and release setup
5. Small, reviewable changes

## How to work in this repo
- Keep changes minimal and coherent
- Prefer pure functions for domain logic
- Keep UI logic separate from scoring logic
- Respect all non-negotiable constraints from `docs/project-context.md`
- Use supporting agents to accelerate work, but keep final architectural and integration decisions in Codex
- Do not introduce SSR, backend services, auth, or remote storage
- Do not replace `release-please` with another release tool
- Do not add semicolons

## Implementation rules
- Use SolidJS SPA patterns
- Use TypeScript everywhere practical
- Use Tailwind CSS v4 for styling
- Use `localStorage` as the default persistence layer
- Support English and Korean from the start
- Support dark mode from the start
- Build mobile-first, then enhance for larger screens
- Add meaningful animations to major interactions, but preserve accessibility and reduced-motion behavior

## Git and GitHub rules
- Use Conventional Commits
- Split unrelated work into separate commits
- Use `git` for commits
- Use `gh` CLI for repo / PR / release / workflow tasks where relevant
- Keep `main` as source branch and `release` as built artifact mirror branch
- Keep GitHub Pages deployment and release automation as separate workflows

## Validation before finishing
Run the narrowest useful checks during development, then run broad checks before finishing when applicable:
- lint
- tests relevant to the change
- build

If you skip a check, state why.

## Preferred change order
For larger implementation work, prefer this sequence:
1. domain model
2. scoring engine
3. storage model
4. UI states and forms
5. animation polish
6. tests
7. GitHub workflows
8. release automation

## Multi-agent collaboration
- Read `docs/ai-collaboration.md` when coordinating with Gemini or Cursor
- Use Gemini primarily for review, prompt drafting, copy refinement, and visual asset generation planning
- Use Cursor primarily for UI iteration, layout cleanup, and animation polish
- Keep one agent on one file area at a time to avoid merge churn
- If generated assets are introduced, make sure they follow the asset policy in `docs/project-context.md`

## Output expectations
When reporting back:
- summarize what changed
- list important files touched
- list checks run and outcomes
- list any follow-up risks or deferred items
