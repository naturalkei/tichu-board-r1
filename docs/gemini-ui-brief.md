# Gemini UI Briefs

This document packages the current UI redesign work into prompts and constraints that can be handed to Gemini for visual critique, interaction feedback, and lightweight asset direction.

## Shared Constraints
- Product: Tichu score calculator for 4-player tabletop sessions
- Platform: SolidJS SPA on GitHub Pages
- Layout priority: iPhone 12 width first, then larger screens
- Visual direction: mobile-first tabletop utility UI, high contrast, animation-aware, no decorative clutter
- Accessibility: preserve large touch targets and reduced-motion behavior
- Current source of truth: [project-context.md](./project-context.md)

## Brief A: Bottom Dock Redesign
### Problem
- The bottom dock still reads like a text tab bar instead of a strong icon-led control dock
- Icons are too small to scan quickly during live play
- Settings should stay visually isolated at the end of the dock

### What To Ask Gemini
Use this prompt:

```text
Review the bottom navigation of a mobile-first Tichu score app. The current dock has five actions: party setup, round entry, results, history, and settings. I need an icon-first dock that feels more like a compact game control bar than a standard tab bar.

Constraints:
- target width: iPhone 12 portrait (390px)
- icons should be visually dominant
- labels can be tiny secondary captions or omitted in the visual proposal, but accessibility labels still exist in code
- settings must remain at the far right as a utility action
- high contrast in both dark and light themes
- use a tabletop/game utility visual language, not generic SaaS tabs
- motion should be subtle and purposeful

Please provide:
1. visual critique of the current problem
2. 2-3 concrete layout directions for icon size, spacing, active-state treatment, and dock silhouette
3. recommendations for any simple decorative resource, glyph treatment, or background plate that could be generated as an SVG or lightweight asset
```

### Desired Output
- icon scale guidance
- active/inactive visual hierarchy
- spacing and safe-area recommendations
- any optional SVG plate or badge direction

## Brief B: Party Setup Redesign
### Problem
- The current party setup still feels crowded at 390px width
- HTML drag-and-drop alone is not reliable enough for touch-first usage
- Team identity is not visually strong enough
- Team colors must never overlap

### What To Ask Gemini
Use this prompt:

```text
Review a mobile-first party setup screen for a 4-player Tichu score app. The screen places four seats around a virtual board-game table and lets users rename players, swap seats, reuse recent player names, and confirm opposite-seat teams.

Problems to solve:
- current layout is still too dense on iPhone 12 width
- editing actions should move into a compact popup sheet
- seat cards should only show the minimum information needed during setup
- team identity should be obvious through distinct colors and a clearer tabletop center
- seat swapping needs a touch-friendly visual model, with drag feedback or a tap-to-move fallback
- recent player names should be easy to reuse

Constraints:
- exactly 4 players
- teams are always opposite seats
- duplicate player names are not allowed
- team color choices must remain distinct
- keep the mood practical, tactile, and game-like

Please provide:
1. critique of the information density
2. a compact layout direction for the table and seat cards
3. a visual interaction model for touch-friendly seat moving
4. suggestions for the tabletop center plate, team color chips, and recent-player tray
```

### Desired Output
- reduced-density layout proposal
- stronger team identity treatment
- touch-first seat movement guidance
- low-cost asset ideas for tabletop polish
