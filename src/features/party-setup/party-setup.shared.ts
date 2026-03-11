import { getRandomPlayerName } from '@/domain/defaults'
import { teamColorOptions } from '@/domain/team-colors'
import type { Language, Player, PlayerId, Seat, TeamColor, TeamId } from '@/domain/types'

export { teamColorOptions }

export const teamColorClasses: Record<
  TeamColor,
  {
    chip: string
    ring: string
    surface: string
    glow: string
    solid: string
    solidText: string
    picker: string
    pickerEdge: string
    label: string
  }
> = {
  amber: {
    chip: 'bg-yellow-300 text-yellow-950',
    ring: 'ring-yellow-300/60',
    surface: 'bg-linear-to-br from-yellow-300/20 to-amber-100/6',
    glow: 'shadow-[0_0_0_1px_rgba(253,224,71,0.28),0_18px_50px_rgba(253,224,71,0.16)]',
    solid: 'bg-yellow-300',
    solidText: 'text-yellow-950',
    picker: 'bg-linear-to-br from-yellow-300 to-amber-400',
    pickerEdge: 'border-yellow-200/80',
    label: 'Solar',
  },
  emerald: {
    chip: 'bg-emerald-400 text-emerald-950',
    ring: 'ring-emerald-300/60',
    surface: 'bg-linear-to-br from-emerald-400/20 to-lime-200/5',
    glow: 'shadow-[0_0_0_1px_rgba(52,211,153,0.28),0_18px_50px_rgba(52,211,153,0.16)]',
    solid: 'bg-emerald-400',
    solidText: 'text-emerald-950',
    picker: 'bg-linear-to-br from-emerald-400 to-lime-300',
    pickerEdge: 'border-emerald-200/80',
    label: 'Emerald',
  },
  sky: {
    chip: 'bg-blue-400 text-blue-950',
    ring: 'ring-blue-300/60',
    surface: 'bg-linear-to-br from-blue-400/22 to-cyan-200/6',
    glow: 'shadow-[0_0_0_1px_rgba(96,165,250,0.28),0_18px_50px_rgba(96,165,250,0.16)]',
    solid: 'bg-blue-400',
    solidText: 'text-blue-950',
    picker: 'bg-linear-to-br from-blue-400 to-indigo-400',
    pickerEdge: 'border-blue-200/80',
    label: 'Royal',
  },
  rose: {
    chip: 'bg-rose-400 text-rose-950',
    ring: 'ring-rose-300/60',
    surface: 'bg-linear-to-br from-rose-400/22 to-red-200/6',
    glow: 'shadow-[0_0_0_1px_rgba(251,113,133,0.3),0_18px_50px_rgba(251,113,133,0.18)]',
    solid: 'bg-rose-400',
    solidText: 'text-rose-950',
    picker: 'bg-linear-to-br from-rose-400 to-red-400',
    pickerEdge: 'border-rose-200/80',
    label: 'Ruby',
  },
  violet: {
    chip: 'bg-fuchsia-400 text-fuchsia-950',
    ring: 'ring-fuchsia-300/60',
    surface: 'bg-linear-to-br from-fuchsia-400/22 to-violet-200/6',
    glow: 'shadow-[0_0_0_1px_rgba(232,121,249,0.3),0_18px_50px_rgba(232,121,249,0.18)]',
    solid: 'bg-fuchsia-400',
    solidText: 'text-fuchsia-950',
    picker: 'bg-linear-to-br from-fuchsia-400 to-violet-400',
    pickerEdge: 'border-fuchsia-200/80',
    label: 'Amethyst',
  },
  teal: {
    chip: 'bg-cyan-300 text-cyan-950',
    ring: 'ring-cyan-300/60',
    surface: 'bg-linear-to-br from-cyan-300/22 to-sky-200/6',
    glow: 'shadow-[0_0_0_1px_rgba(103,232,249,0.3),0_18px_50px_rgba(103,232,249,0.18)]',
    solid: 'bg-cyan-300',
    solidText: 'text-cyan-950',
    picker: 'bg-linear-to-br from-cyan-300 to-sky-400',
    pickerEdge: 'border-cyan-100/80',
    label: 'Cyan',
  },
  orange: {
    chip: 'bg-orange-400 text-orange-950',
    ring: 'ring-orange-300/60',
    surface: 'bg-linear-to-br from-orange-400/22 to-amber-200/6',
    glow: 'shadow-[0_0_0_1px_rgba(251,146,60,0.3),0_18px_50px_rgba(251,146,60,0.18)]',
    solid: 'bg-orange-400',
    solidText: 'text-orange-950',
    picker: 'bg-linear-to-br from-orange-400 to-amber-400',
    pickerEdge: 'border-orange-200/80',
    label: 'Orange',
  },
}

export const seatLayouts: { seat: Seat; className: string }[] = [
  { seat: 'north', className: 'col-start-2 row-start-1' },
  { seat: 'west', className: 'col-start-1 row-start-2' },
  { seat: 'east', className: 'col-start-3 row-start-2' },
  { seat: 'south', className: 'col-start-2 row-start-3' },
]

export const seatOverlayLabels: Record<Seat, string> = {
  north: 'N',
  west: 'W',
  east: 'E',
  south: 'S',
}

export type EditorDraft = {
  playerId: PlayerId
  name: string
}

export type TeamEditorDraft = {
  teamId: TeamId
  name: string
  color: TeamColor
}

export function getTeamId(seat: Seat): TeamId {
  return seat === 'north' || seat === 'south' ? 'north-south' : 'east-west'
}

export function getUniqueRandomName(players: Player[], language: Language, draft: EditorDraft) {
  let nextName = getRandomPlayerName(language, draft.name)
  let attempts = 0

  while (
    players.some(
      (player) => player.id !== draft.playerId && player.name.trim().toLowerCase() === nextName.toLowerCase(),
    ) &&
    attempts < 12
  ) {
    nextName = getRandomPlayerName(language, nextName)
    attempts += 1
  }

  return nextName
}
