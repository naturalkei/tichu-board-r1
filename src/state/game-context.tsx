import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type ParentComponent,
} from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import { calculateCumulativeScores, getGameStatus, getLeadingTeamId } from '@/domain/scoring'
import { saveGameState, saveSettings } from '@/storage/game-storage'
import { createTranslator } from '@/shared/i18n'
import { createGameActions } from './game-context-actions'
import {
  createTeamLineups,
  detectSystemTheme,
  type GameContextValue,
  loadInitialState,
} from './game-context.shared'

const GameContext = createContext<GameContextValue>()

export const GameProvider: ParentComponent = (props) => {
  const [systemTheme, setSystemTheme] = createSignal(detectSystemTheme())
  const [state, setState] = createStore(loadInitialState())

  const translate = createMemo(() => createTranslator(state.settings.language))
  const cumulativeScores = createMemo(() => calculateCumulativeScores(state.rounds.map((round) => round.result)))
  const gameStatus = createMemo(() => getGameStatus(cumulativeScores()))
  const leadingTeamId = createMemo(() => getLeadingTeamId(cumulativeScores()))
  const teamLineups = createMemo(() => createTeamLineups(state.players))
  const teamNames = createMemo(() => state.settings.teamNames)
  const persistedSettings = createMemo(() => ({
    language: state.settings.language,
    theme: state.settings.theme,
    teamColors: {
      'north-south': state.settings.teamColors['north-south'],
      'east-west': state.settings.teamColors['east-west'],
    },
    teamNames: {
      'north-south': state.settings.teamNames['north-south'],
      'east-west': state.settings.teamNames['east-west'],
    },
  }))
  const effectiveTheme = createMemo(() => (state.settings.theme === 'system' ? systemTheme() : state.settings.theme))

  const mediaQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null

  if (mediaQuery) {
    const handleChange = (event: MediaQueryListEvent) => setSystemTheme(event.matches ? 'dark' : 'light')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)
    onCleanup(() => mediaQuery.removeEventListener('change', handleChange))
  }

  createEffect(() => {
    saveGameState(window.localStorage, unwrap(state))
  })

  createEffect(() => {
    saveSettings(window.localStorage, persistedSettings())
  })

  createEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme()
    document.documentElement.lang = state.settings.language
  })

  const actions = createGameActions({ state, setState })

  const value: GameContextValue = {
    state,
    cumulativeScores,
    gameStatus,
    leadingTeamId,
    teamNames,
    teamLineups,
    systemTheme,
    effectiveTheme,
    t: (key, args) => translate()(key, args),
    ...actions,
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
