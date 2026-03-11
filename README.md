# TichuBoard

TichuBoard is a mobile-first Tichu score calculator for 4-player tabletop sessions. It helps players set up seats, track Tichu calls, enter round results quickly, and keep cumulative team scores stable across reloads.

## What The App Does
- Starts with a simple landing screen when no game is in progress
- Lets players arrange the 4 seats around a tabletop-style layout
- Supports drag-and-drop seat swaps and seat picker reassignment
- Generates random English or Korean player names with reroll actions
- Records round-by-round Tichu scoring
- Shows cumulative totals and round history
- Keeps game state, language, and theme settings in browser storage
- Supports English and Korean
- Supports light, dark, and system theme modes

## Core Scoring Scope
- 4-player Tichu only
- Small Tichu and Grand Tichu calls
- First-out selection
- Double victory handling
- Team card point entry for normal rounds
- Automatic cumulative score calculation
- End-of-game tracking for the 1000-point threshold

## Product Principles
- Mobile-first before desktop enhancement
- Fast table-side interaction
- Local-first persistence
- Clear score visibility
- Minimal friction between rounds

## Running Locally
### Requirements
- Node.js 24
- pnpm

### Install
```bash
pnpm install
```

### Start Development Server
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
```

## Useful Commands
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm smoke`
- `pnpm preview`

## Tech Stack
- SolidJS
- Vite
- TypeScript
- Tailwind CSS v4
- Vitest
- ESLint 9
- Stagehand

## Project Structure
- `src/domain` scoring logic and shared game rules
- `src/features/party-setup` player seat and name setup UI
- `src/features/rounds` round entry flow
- `src/features/scoreboard` totals and history UI
- `src/features/settings` in-app settings dialog
- `src/storage` browser persistence
- `src/shared` branding, i18n, and shared helpers

## Deployment And Release
- `main` is the source branch
- `release` is the deployment-oriented branch
- GitHub Pages is deployed through GitHub Actions
- release-please manages changelog and release PR flow

## Documentation
- [project context](docs/project-context.md)
- [AI collaboration guide](docs/ai-collaboration.md)
- [Gemini UI briefs](docs/gemini-ui-brief.md)
- [Cursor UI briefs](docs/cursor-ui-brief.md)
- [party setup requirements](docs/party-setup-requirements.md)
- [visual asset workflow](docs/visual-asset-workflow.md)
- [implementation readiness](docs/implementation-readiness.md)

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE).

## Disclaimer
- TichuBoard is an independent open-source score calculator and is not an official Tichu product.
- This application is intended to assist score tracking only. Players remain responsible for applying the game rules correctly.
- Saved data is stored locally in the browser by default. Resetting the app or clearing browser storage can remove saved game data.
- The software is provided as-is, without warranty of any kind.
