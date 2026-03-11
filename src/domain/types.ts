import type { NORMAL_ROUND_TOTAL_POINTS, PLAYER_IDS, SEATS, TEAM_IDS } from './constants'

export type Seat = (typeof SEATS)[number]
export type PlayerId = (typeof PLAYER_IDS)[number]
export type TeamId = (typeof TEAM_IDS)[number]
export type TichuCall = 'none' | 'small' | 'grand'
export type Language = 'en' | 'ko'
export type ThemeMode = 'system' | 'light' | 'dark'
export type TeamColor = 'amber' | 'emerald' | 'sky' | 'rose'

export type Player = {
  id: PlayerId
  name: string
  seat: Seat
}

export type TeamScoreMap = Record<TeamId, number>
export type PlayerTichuCallMap = Record<PlayerId, TichuCall>

export type RoundInput = {
  tichuCalls: PlayerTichuCallMap
  firstOutPlayerId: PlayerId
  doubleVictoryTeamId: TeamId | null
  cardPoints: TeamScoreMap | null
}

export type TichuCallResult = {
  playerId: PlayerId
  teamId: TeamId
  call: Exclude<TichuCall, 'none'>
  succeeded: boolean
  scoreDelta: number
}

export type RoundScoreBreakdown = {
  cardPoints: TeamScoreMap
  tichuBonuses: TeamScoreMap
  roundTotals: TeamScoreMap
  callResults: TichuCallResult[]
}

export type RoundValidationError = {
  field: 'players' | 'first-out' | 'double-victory' | 'card-points'
  message: string
}

export type RoundValidationResult =
  | { ok: true }
  | {
      ok: false
      errors: RoundValidationError[]
    }

export type RoundRecord = {
  id: string
  input: RoundInput
  result: RoundScoreBreakdown
  timing: {
    startedAt: string
    completedAt: string
    elapsedMs: number
  }
}

export type GameStatus =
  | {
      isGameOver: false
      winnerTeamId: null
      tieBreakRequired: boolean
    }
  | {
      isGameOver: true
      winnerTeamId: TeamId
      tieBreakRequired: false
    }

export type GameSettings = {
  language: Language
  theme: ThemeMode
  teamColors: Record<TeamId, TeamColor>
  teamNames: Record<TeamId, string>
}

export type PersistedGameState = {
  schemaVersion: 1
  hasStartedGame: boolean
  players: Player[]
  rounds: RoundRecord[]
  activeRoundStartedAt: string | null
  recentPlayerNames: string[]
  settings: GameSettings
}

export type NormalRoundTotal = typeof NORMAL_ROUND_TOTAL_POINTS
