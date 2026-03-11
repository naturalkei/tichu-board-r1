import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type ParentComponent,
} from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'
import { createDefaultPlayers, mergeRecentPlayerNames } from '@/domain/defaults'
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
import {
  clearGameState,
  createInitialGameState,
  loadGameState,
  saveGameState,
} from '@/storage/game-storage'
import { createTranslator, type TranslationKey } from '@/shared/i18n'

type GameContextValue = {
  state: PersistedGameState
  cumulativeScores: () => ReturnType<typeof calculateCumulativeScores>
  gameStatus: () => ReturnType<typeof getGameStatus>
  leadingTeamId: () => ReturnType<typeof getLeadingTeamId>
  teamNames: () => Record<TeamId, string>
  systemTheme: () => Exclude<ThemeMode, 'system'>
  effectiveTheme: () => Exclude<ThemeMode, 'system'>
  t: (key: TranslationKey, args?: Record<string, string | number | boolean>) => string
  startGame: () => void
  updatePlayerName: (playerId: PlayerId, name: string) => void
  assignPlayerSeat: (playerId: PlayerId, seat: Seat) => void
  swapPlayerSeats: (sourcePlayerId: PlayerId, targetPlayerId: PlayerId) => void
  setTeamColor: (teamId: TeamId, color: TeamColor) => void
  setLanguage: (language: PersistedGameState['settings']['language']) => void
  setTheme: (theme: ThemeMode) => void
  addRound: (input: RoundInput) => void
  updateRound: (roundId: string, input: RoundInput) => void
  deleteRound: (roundId: string) => void
  duplicateRound: (roundId: string) => void
  findRound: (roundId: string) => RoundRecord | undefined
  resetGame: () => void
}

const GameContext = createContext<GameContextValue>()

export const GameProvider: ParentComponent = (props) => {
  const [systemTheme, setSystemTheme] = createSignal<Exclude<ThemeMode, 'system'>>(detectSystemTheme())
  const [state, setState] = createStore<PersistedGameState>(loadInitialState())

  const translate = createMemo(() => createTranslator(state.settings.language))
  const cumulativeScores = createMemo(() =>
    calculateCumulativeScores(state.rounds.map((round) => round.result)),
  )
  const gameStatus = createMemo(() => getGameStatus(cumulativeScores()))
  const leadingTeamId = createMemo(() => getLeadingTeamId(cumulativeScores()))
  const teamNames = createMemo(() => {
    const names = {
      'north-south': [] as string[],
      'east-west': [] as string[],
    }

    for (const player of state.players) {
      names[getTeamIdBySeat(player.seat)].push(player.name)
    }

    return {
      'north-south': names['north-south'].join(' / '),
      'east-west': names['east-west'].join(' / '),
    }
  })
  const effectiveTheme = createMemo<Exclude<ThemeMode, 'system'>>(() =>
    state.settings.theme === 'system' ? systemTheme() : state.settings.theme,
  )

  const mediaQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null

  if (mediaQuery) {
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)
    onCleanup(() => mediaQuery.removeEventListener('change', handleChange))
  }

  createEffect(() => {
    saveGameState(window.localStorage, unwrap(state))
  })

  createEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme()
    document.documentElement.lang = state.settings.language
  })

  const value: GameContextValue = {
    state,
    cumulativeScores,
    gameStatus,
    leadingTeamId,
    teamNames,
    systemTheme,
    effectiveTheme,
    t: (key, args) => translate()(key, args),
    startGame: () => setState('hasStartedGame', true),
    updatePlayerName: (playerId, name) => {
      const trimmedName = name.trimStart().slice(0, 24)
      const previousName = state.players.find((player) => player.id === playerId)?.name

      setState(
        'players',
        (player) => player.id === playerId,
        'name',
        (currentName) => trimmedName || currentName,
      )

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

      setState(
        'players',
        state.players.map((player) => {
          if (player.id === playerId) {
            return { ...player, seat }
          }

          if (player.id === targetPlayer.id) {
            return { ...player, seat: sourcePlayer.seat }
          }

          return player
        }),
      )
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

      setState(
        'players',
        state.players.map((player) => {
          if (player.id === sourcePlayerId) {
            return { ...player, seat: targetPlayer.seat }
          }

          if (player.id === targetPlayerId) {
            return { ...player, seat: sourcePlayer.seat }
          }

          return player
        }),
      )
    },
    setTeamColor: (teamId, color) => setState('settings', 'teamColors', teamId, color),
    setLanguage: (language) => setState('settings', 'language', language),
    setTheme: (theme) => setState('settings', 'theme', theme),
    addRound: (input) => {
      const round = createRoundRecord(state.players, input)
      setState('rounds', (rounds) => [...rounds, round])
    },
    updateRound: (roundId, input) => {
      const round = createRoundRecord(state.players, input, roundId)
      setState(
        'rounds',
        state.rounds.map((item) => (item.id === roundId ? round : item)),
      )
    },
    deleteRound: (roundId) => {
      setState(
        'rounds',
        state.rounds.filter((round) => round.id !== roundId),
      )
    },
    duplicateRound: (roundId) => {
      const round = state.rounds.find((item) => item.id === roundId)

      if (!round) {
        return
      }

      setState('rounds', (rounds) => [
        ...rounds,
        createRoundRecord(state.players, round.input),
      ])
    },
    findRound: (roundId) => state.rounds.find((round) => round.id === roundId),
    resetGame: () => {
      const recentPlayerNames = mergeRecentPlayerNames(
        state.recentPlayerNames,
        state.players.map((player) => player.name.trim()).filter(Boolean),
      )
      const nextSettings = unwrap(state.settings)

      clearGameState(window.localStorage)
      setState(
        reconcile({
          ...createInitialGameState(),
          players: createDefaultPlayers(),
          recentPlayerNames,
          settings: nextSettings,
        }),
      )
    },
  }

  return <GameContext.Provider value={value}>{props.children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }

  return context
}

function loadInitialState() {
  if (typeof window === 'undefined') {
    return createInitialGameState()
  }

  return loadGameState(window.localStorage)
}

function detectSystemTheme(): Exclude<ThemeMode, 'system'> {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function createRoundRecord(players: Player[], input: RoundInput, roundId = createRoundId()): RoundRecord {
  return {
    id: roundId,
    input,
    result: calculateRoundScore(players, input),
  }
}

function createRoundId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `round-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
