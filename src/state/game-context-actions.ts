import { reconcile, unwrap, type SetStoreFunction, type Store } from 'solid-js/store'
import { mergeRecentPlayerNames } from '@/domain/defaults'
import { areTeamColorsCompatible } from '@/domain/team-colors'
import type {
  PersistedGameState,
  Player,
  PlayerId,
} from '@/domain/types'
import { clearGameState } from '@/storage/game-storage'
import {
  applyLanguageTeamNameDefaults,
  createResetState,
  createRoundRecord,
  type GameContextValue,
} from './game-context.shared'

type CreateGameActionsOptions = {
  state: Store<PersistedGameState>
  setState: SetStoreFunction<PersistedGameState>
}

export function createGameActions(options: CreateGameActionsOptions): Pick<
  GameContextValue,
  | 'startGame'
  | 'updatePlayerName'
  | 'assignPlayerSeat'
  | 'swapPlayerSeats'
  | 'setTeamColor'
  | 'setTeamName'
  | 'setLanguage'
  | 'setTheme'
  | 'startRound'
  | 'cancelActiveRound'
  | 'addRound'
  | 'updateRound'
  | 'deleteRound'
  | 'duplicateRound'
  | 'findRound'
  | 'resetGame'
> {
  const { state, setState } = options

  return {
    startGame: () => setState('hasStartedGame', true),
    updatePlayerName: (playerId, name) => {
      const trimmedName = name.trimStart().slice(0, 24)
      const previousName = state.players.find((player) => player.id === playerId)?.name

      setState('players', (player) => player.id === playerId, 'name', (currentName) => trimmedName || currentName)

      if (previousName && trimmedName && previousName !== trimmedName) {
        setState('recentPlayerNames', (names) => mergeRecentPlayerNames(names, [previousName]))
      }
    },
    assignPlayerSeat: (playerId, seat) => {
      const sourcePlayer = state.players.find((player) => player.id === playerId)
      const targetPlayer = state.players.find((player) => player.seat === seat)

      if (!sourcePlayer || !targetPlayer || sourcePlayer.seat === seat) {
        return
      }

      setState('players', mapPlayersBySeatSwap(state.players, sourcePlayer.id, targetPlayer.id))
    },
    swapPlayerSeats: (sourcePlayerId, targetPlayerId) => {
      if (sourcePlayerId === targetPlayerId) {
        return
      }

      const sourcePlayer = state.players.find((player) => player.id === sourcePlayerId)
      const targetPlayer = state.players.find((player) => player.id === targetPlayerId)

      if (!sourcePlayer || !targetPlayer) {
        return
      }

      setState('players', mapPlayersBySeatSwap(state.players, sourcePlayer.id, targetPlayer.id))
    },
    setTeamColor: (teamId, color) => {
      const oppositeTeamId = teamId === 'north-south' ? 'east-west' : 'north-south'

      if (!areTeamColorsCompatible(color, state.settings.teamColors[oppositeTeamId])) {
        return
      }

      setState('settings', 'teamColors', teamId, color)
    },
    setTeamName: (teamId, name) =>
      setState('settings', 'teamNames', teamId, name.trim().slice(0, 24) || state.settings.teamNames[teamId]),
    setLanguage: (language) =>
      setState('settings', (current) => ({
        ...current,
        language,
        teamNames: applyLanguageTeamNameDefaults(current.teamNames, state.settings.language, language),
      })),
    setTheme: (theme) => setState('settings', 'theme', theme),
    startRound: () => {
      if (!state.activeRoundStartedAt) {
        setState('activeRoundStartedAt', new Date().toISOString())
      }
    },
    cancelActiveRound: () => setState('activeRoundStartedAt', null),
    addRound: (input) => {
      const round = createRoundRecord(state.players, input, undefined, state.activeRoundStartedAt ?? undefined)
      setState('rounds', (rounds) => [...rounds, round])
      setState('activeRoundStartedAt', null)
    },
    updateRound: (roundId, input) => {
      const existingRound = state.rounds.find((item) => item.id === roundId)

      if (!existingRound) {
        return
      }

      const round = createRoundRecord(
        state.players,
        input,
        roundId,
        existingRound.timing.startedAt,
        existingRound.timing.completedAt,
      )

      setState('rounds', state.rounds.map((item) => (item.id === roundId ? round : item)))
    },
    deleteRound: (roundId) => setState('rounds', state.rounds.filter((round) => round.id !== roundId)),
    duplicateRound: (roundId) => {
      const round = state.rounds.find((item) => item.id === roundId)

      if (round) {
        setState('rounds', (rounds) => [...rounds, createRoundRecord(state.players, round.input)])
      }
    },
    findRound: (roundId) => state.rounds.find((round) => round.id === roundId),
    resetGame: () => {
      clearGameState(window.localStorage)
      setState(reconcile(createResetState(unwrap(state))))
    },
  }
}

function mapPlayersBySeatSwap(players: Player[], sourcePlayerId: PlayerId, targetPlayerId: PlayerId) {
  const sourcePlayer = players.find((player) => player.id === sourcePlayerId)
  const targetPlayer = players.find((player) => player.id === targetPlayerId)

  if (!sourcePlayer || !targetPlayer) {
    return players
  }

  return players.map((player) => {
    if (player.id === sourcePlayerId) {
      return { ...player, seat: targetPlayer.seat }
    }

    if (player.id === targetPlayerId) {
      return { ...player, seat: sourcePlayer.seat }
    }

    return player
  })
}
