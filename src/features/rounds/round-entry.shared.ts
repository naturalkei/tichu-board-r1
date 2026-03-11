import { createDefaultTichuCalls } from '@/domain/defaults'
import type { Player, RoundInput, TeamId, TichuCall } from '@/domain/types'

export type RoundDraft = {
  firstOutPlayerId: Player['id']
  doubleVictoryTeamId: TeamId | ''
  cardPointsNorthSouth: string
  cardPointsEastWest: string
  tichuCalls: Record<Player['id'], TichuCall>
}

export function createDraft(players: Player[]): RoundDraft {
  return {
    firstOutPlayerId: players[0]?.id ?? 'player-1',
    doubleVictoryTeamId: '',
    cardPointsNorthSouth: '50',
    cardPointsEastWest: '50',
    tichuCalls: createDefaultTichuCalls(),
  }
}

export function createDraftFromRound(input: RoundInput): RoundDraft {
  return {
    firstOutPlayerId: input.firstOutPlayerId,
    doubleVictoryTeamId: input.doubleVictoryTeamId ?? '',
    cardPointsNorthSouth: input.cardPoints ? String(input.cardPoints['north-south']) : '50',
    cardPointsEastWest: input.cardPoints ? String(input.cardPoints['east-west']) : '50',
    tichuCalls: { ...input.tichuCalls },
  }
}

export function buildRoundInput(draft: RoundDraft): RoundInput {
  const doubleVictoryTeamId = draft.doubleVictoryTeamId || null

  return {
    firstOutPlayerId: draft.firstOutPlayerId,
    doubleVictoryTeamId,
    tichuCalls: { ...draft.tichuCalls },
    cardPoints: doubleVictoryTeamId
      ? null
      : {
          'north-south': Number(draft.cardPointsNorthSouth || 0),
          'east-west': Number(draft.cardPointsEastWest || 0),
        },
  }
}

export function formatElapsedMs(value: number) {
  const totalSeconds = Math.max(0, Math.floor(value / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}
