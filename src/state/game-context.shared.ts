import { createDefaultPlayers, createDefaultTeamNames, mergeRecentPlayerNames } from '@/domain/defaults'
import { getTeamIdBySeat } from '@/domain/helpers'
import {
  calculateCumulativeScores,
  calculateRoundScore,
  getGameStatus,
  getLeadingTeamId,
} from '@/domain/scoring'
import type {
  PersistedGameState,
  Player,
  PlayerId,
  RoundInput,
  RoundRecord,
  Seat,
  TeamColor,
  TeamId,
  ThemeMode,
} from '@/domain/types'
import { createInitialGameState, loadGameState } from '@/storage/game-storage'
import type { TranslationKey } from '@/shared/i18n'

export type GameContextValue = {
  state: PersistedGameState
  cumulativeScores: () => ReturnType<typeof calculateCumulativeScores>
  gameStatus: () => ReturnType<typeof getGameStatus>
  leadingTeamId: () => ReturnType<typeof getLeadingTeamId>
  teamNames: () => Record<TeamId, string>
  teamLineups: () => Record<TeamId, string>
  systemTheme: () => Exclude<ThemeMode, 'system'>
  effectiveTheme: () => Exclude<ThemeMode, 'system'>
  t: (key: TranslationKey, args?: Record<string, string | number | boolean>) => string
  startGame: () => void
  updatePlayerName: (playerId: PlayerId, name: string) => void
  assignPlayerSeat: (playerId: PlayerId, seat: Seat) => void
  swapPlayerSeats: (sourcePlayerId: PlayerId, targetPlayerId: PlayerId) => void
  setTeamColor: (teamId: TeamId, color: TeamColor) => void
  setTeamName: (teamId: TeamId, name: string) => void
  setLanguage: (language: PersistedGameState['settings']['language']) => void
  setTheme: (theme: ThemeMode) => void
  addRound: (input: RoundInput) => void
  updateRound: (roundId: string, input: RoundInput) => void
  startRound: () => void
  cancelActiveRound: () => void
  deleteRound: (roundId: string) => void
  duplicateRound: (roundId: string) => void
  findRound: (roundId: string) => RoundRecord | undefined
  resetGame: () => void
}

export function loadInitialState() {
  if (typeof window === 'undefined') {
    return createInitialGameState()
  }

  return loadGameState(window.localStorage)
}

export function detectSystemTheme(): Exclude<ThemeMode, 'system'> {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function createRoundRecord(
  players: Player[],
  input: RoundInput,
  roundId = createRoundId(),
  startedAt = new Date().toISOString(),
  completedAt = new Date().toISOString(),
): RoundRecord {
  const elapsedMs = Math.max(0, new Date(completedAt).getTime() - new Date(startedAt).getTime())

  return {
    id: roundId,
    input,
    result: calculateRoundScore(players, input),
    timing: {
      startedAt,
      completedAt,
      elapsedMs,
    },
  }
}

export function createRoundId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `round-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createTeamLineups(players: Player[]) {
  const names = {
    'north-south': [] as string[],
    'east-west': [] as string[],
  }

  for (const player of players) {
    names[getTeamIdBySeat(player.seat)].push(player.name)
  }

  return {
    'north-south': names['north-south'].join(' / '),
    'east-west': names['east-west'].join(' / '),
  }
}

export function applyLanguageTeamNameDefaults(
  currentNames: Record<TeamId, string>,
  previousLanguage: PersistedGameState['settings']['language'],
  nextLanguage: PersistedGameState['settings']['language'],
) {
  const previousDefaults = createDefaultTeamNames(previousLanguage)
  const nextDefaults = createDefaultTeamNames(nextLanguage)

  return {
    'north-south':
      currentNames['north-south'] === previousDefaults['north-south']
        ? nextDefaults['north-south']
        : currentNames['north-south'],
    'east-west':
      currentNames['east-west'] === previousDefaults['east-west']
        ? nextDefaults['east-west']
        : currentNames['east-west'],
  }
}

export function createResetState(state: PersistedGameState) {
  const recentPlayerNames = mergeRecentPlayerNames(
    state.recentPlayerNames,
    state.players.map((player) => player.name.trim()).filter(Boolean),
  )

  return {
    ...createInitialGameState(),
    players: createDefaultPlayers(),
    activeRoundStartedAt: null,
    recentPlayerNames,
    settings: state.settings,
  }
}
