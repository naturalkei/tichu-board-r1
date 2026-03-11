import type { TeamColor } from './types'

export const teamColorOptions: TeamColor[] = ['rose', 'sky', 'emerald', 'orange', 'violet', 'teal', 'amber']

export const incompatibleTeamColorPairs: Record<TeamColor, TeamColor[]> = {
  rose: ['orange'],
  sky: ['teal'],
  emerald: [],
  orange: ['rose', 'amber'],
  violet: ['amber'],
  teal: ['sky'],
  amber: ['orange', 'violet'],
}

export function areTeamColorsCompatible(firstColor: TeamColor, secondColor: TeamColor) {
  if (firstColor === secondColor) {
    return false
  }

  return !incompatibleTeamColorPairs[firstColor].includes(secondColor) && !incompatibleTeamColorPairs[secondColor].includes(firstColor)
}

export function isTeamColorSelectable(color: TeamColor, oppositeColor: TeamColor, selectedColor: TeamColor) {
  if (color === selectedColor) {
    return true
  }

  return areTeamColorsCompatible(color, oppositeColor)
}
