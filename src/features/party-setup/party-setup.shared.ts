import { getRandomPlayerName } from '@/domain/defaults'
import type { Language, Player, PlayerId, Seat, TeamColor, TeamId } from '@/domain/types'

export const teamColorClasses: Record<TeamColor, { chip: string; ring: string; surface: string; glow: string }> = {
  amber: {
    chip: 'bg-amber-300 text-amber-950',
    ring: 'ring-amber-300/55',
    surface: 'from-amber-300/18 to-amber-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(252,211,77,0.24),0_18px_50px_rgba(252,211,77,0.14)]',
  },
  emerald: {
    chip: 'bg-emerald-300 text-emerald-950',
    ring: 'ring-emerald-300/55',
    surface: 'from-emerald-300/18 to-emerald-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(110,231,183,0.24),0_18px_50px_rgba(110,231,183,0.14)]',
  },
  sky: {
    chip: 'bg-sky-300 text-sky-950',
    ring: 'ring-sky-300/55',
    surface: 'from-sky-300/18 to-sky-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(125,211,252,0.24),0_18px_50px_rgba(125,211,252,0.14)]',
  },
  rose: {
    chip: 'bg-rose-300 text-rose-950',
    ring: 'ring-rose-300/55',
    surface: 'from-rose-300/18 to-rose-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(253,164,175,0.24),0_18px_50px_rgba(253,164,175,0.14)]',
  },
  violet: {
    chip: 'bg-violet-300 text-violet-950',
    ring: 'ring-violet-300/55',
    surface: 'from-violet-300/18 to-violet-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(196,181,253,0.24),0_18px_50px_rgba(196,181,253,0.14)]',
  },
  teal: {
    chip: 'bg-teal-300 text-teal-950',
    ring: 'ring-teal-300/55',
    surface: 'from-teal-300/18 to-teal-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(94,234,212,0.24),0_18px_50px_rgba(94,234,212,0.14)]',
  },
  orange: {
    chip: 'bg-orange-300 text-orange-950',
    ring: 'ring-orange-300/55',
    surface: 'from-orange-300/18 to-orange-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(253,186,116,0.24),0_18px_50px_rgba(253,186,116,0.14)]',
  },
}

export const teamColorOptions: TeamColor[] = ['amber', 'sky', 'emerald', 'rose', 'violet', 'teal', 'orange']

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
