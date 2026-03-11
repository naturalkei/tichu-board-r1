# Team Editor Color Redesign

## Summary
- Scope: party setup team editor dialog
- Goal: make team color selection more vivid, more readable, and harder to confuse across opposing teams

## Problems
- The line under the dialog description repeats the team name and adds noise
- Color swatches are too small for quick mobile selection
- Current palette is not vivid enough on dark UI
- Opposing team colors can still end up visually too similar
- The close button does not reinforce the currently selected team color

## Requirements
- Remove the extra team-name line under the dialog description
- Redesign the color picker as large rounded cards sized for thumb interaction
- Keep exactly 7 selectable team colors
- Use high-chroma colors that stay clear against dark surfaces
- Prevent selecting colors that are too similar to the other team's chosen color
- Apply the selected team color to the bottom close button with readable foreground contrast

## Gemini Feedback Summary
- Use a 2x4 grid of large rounded swatches with at least 64px touch targets
- Reflect the selected color across the dialog surface, not only on the active swatch
- Keep vivid hue families: red, blue, green, orange, purple, pink, cyan
- Ban visually colliding pairs like red/orange, blue/cyan, and purple/pink
- Make the close button a solid fill of the selected color with luminance-aware text
- Avoid muddy or desaturated tones on dark mobile UI

## Implementation Notes
- Keep persisted `TeamColor` keys stable to avoid storage migration work
- Update palette tokens behind the existing keys
- Enforce incompatible color pairs in both UI disabled state and state actions
