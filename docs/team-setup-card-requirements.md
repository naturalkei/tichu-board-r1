# Team Setup Card Redesign Requirements

## Context
- Screen: `Party Setup`
- Components in scope:
  - `src/features/party-setup/TeamSetupCard.tsx`
  - `src/features/party-setup/TeamEditorDialog.tsx`
  - `src/features/party-setup/PartyDialogPrimitives.tsx`
- Device target: mobile-first, especially iPhone 12 width (390px)

## Current problems
- The team card uses space inefficiently:
  - team name, lineup, colors, and edit affordance do not form a strong visual hierarchy
  - the lower color row feels detached from the main identity of the card
- The close icon in the team editor is technically larger than before, but the icon glyph still reads too small
- Team color changes apply immediately, but the dialog itself does not communicate the selected color strongly enough

## Required outcomes
1. Team cards should feel like compact identity cards for each team.
2. The selected team color should define the card visually, not just appear as a small accent.
3. The card should show:
   - team name as the primary label
   - lineup as the secondary label
   - all 7 selectable colors in a compact but readable way
   - a clear edit affordance
4. The editor close affordance must be easy to hit with one thumb.
5. The editor should visibly react to color selection at the dialog-chrome level, not only at the button level.

## Layout guidance
- Prefer a 2-zone team card:
  - top: team identity and edit affordance
  - bottom: condensed color palette plus active-color summary
- Avoid wasting horizontal space with isolated tiny labels
- Keep the card readable even when team names are customized
- Preserve dark-mode contrast

## Editor interaction guidance
- Team name changes should remain immediate while typing
- Team color selection should remain immediate on tap
- The dialog background, border, accent strip, or header chip should visibly change with the current color
- The footer should remain minimal:
  - only one close action button

## Non-goals
- No change to scoring logic
- No change to overall party setup flow
- No change to how opposite-team color disabling works

## Gemini feedback applied
- Use a strong identity zone:
  - larger team title
  - quieter lineup text
  - color row anchored as a separate lower zone
- Show all 7 colors in one compact row with a clearer active ring
- Make the selected color affect the full card identity:
  - left accent border
  - light surface tint
- Make the team editor react at the chrome level:
  - selected color should tint the dialog header area immediately
- Make the close affordance larger:
  - 48px touch target minimum
  - visibly larger icon glyph
- Avoid using saturated team colors as primary text colors in dark mode
