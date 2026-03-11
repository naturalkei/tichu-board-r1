import {
  createDefaultPlayers,
  createDefaultSettings,
  DEFAULT_RECENT_PLAYER_HISTORY_LIMIT,
  isRecentPlayerHistoryLimit,
} from '@/domain/defaults'
import type { GameSettings, PersistedGameState } from '@/domain/types'

export const STORAGE_KEY = 'tichu-board-r1:v1'
export const SETTINGS_STORAGE_KEY = 'tichu-board-r1:settings:v1'
export const CURRENT_SCHEMA_VERSION = 1 as const

export function createInitialGameState(): PersistedGameState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    hasStartedGame: false,
    players: createDefaultPlayers(),
    rounds: [],
    activeRoundStartedAt: null,
    recentPlayerNames: [],
    settings: createDefaultSettings(),
  }
}

export function migratePersistedState(value: unknown): PersistedGameState | null {
  if (!isRecord(value)) {
    return null
  }

  if (value.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return null
  }

  if (!Array.isArray(value.players) || !Array.isArray(value.rounds) || !isRecord(value.settings)) {
    return null
  }

  return {
    ...(value as Omit<PersistedGameState, 'hasStartedGame'>),
    hasStartedGame:
      typeof value.hasStartedGame === 'boolean' ? value.hasStartedGame : value.rounds.length > 0,
    activeRoundStartedAt:
      typeof value.activeRoundStartedAt === 'string' || value.activeRoundStartedAt === null
        ? value.activeRoundStartedAt
        : null,
    recentPlayerNames: Array.isArray(value.recentPlayerNames)
      ? value.recentPlayerNames
          .filter((name): name is string => typeof name === 'string')
          .slice(0, normalizeSettings(value.settings).recentPlayerHistoryLimit)
      : [],
    settings: {
      ...normalizeSettings(value.settings),
    },
  }
}

export function normalizeSettings(value: unknown): GameSettings {
  const defaults = createDefaultSettings()

  if (!isRecord(value)) {
    return defaults
  }

  return {
    ...defaults,
    ...(value as GameSettings),
    recentPlayerHistoryLimit: isRecentPlayerHistoryLimit((value as GameSettings).recentPlayerHistoryLimit)
      ? (value as GameSettings).recentPlayerHistoryLimit
      : DEFAULT_RECENT_PLAYER_HISTORY_LIMIT,
    teamColors: {
      ...defaults.teamColors,
      ...(isRecord((value as GameSettings).teamColors)
        ? ((value as GameSettings).teamColors as GameSettings['teamColors'])
        : {}),
    },
    teamNames: {
      ...defaults.teamNames,
      ...(isRecord((value as GameSettings).teamNames)
        ? ((value as GameSettings).teamNames as GameSettings['teamNames'])
        : {}),
    },
  }
}

export function deserializeGameState(value: string): PersistedGameState | null {
  try {
    return migratePersistedState(JSON.parse(value))
  } catch {
    return null
  }
}

export function serializeGameState(state: PersistedGameState): string {
  return JSON.stringify(state)
}

export function loadGameState(storage: Storage): PersistedGameState {
  const savedValue = storage.getItem(STORAGE_KEY)
  const persistedSettings = loadSettings(storage)

  if (!savedValue) {
    return {
      ...createInitialGameState(),
      settings: persistedSettings,
    }
  }

  const state = deserializeGameState(savedValue)

  if (!state) {
    return {
      ...createInitialGameState(),
      settings: persistedSettings,
    }
  }

  return {
    ...state,
    settings: persistedSettings,
  }
}

export function saveGameState(storage: Storage, state: PersistedGameState): void {
  storage.setItem(STORAGE_KEY, serializeGameState(state))
}

export function loadSettings(storage: Storage): GameSettings {
  const savedValue = storage.getItem(SETTINGS_STORAGE_KEY)

  if (!savedValue) {
    return createDefaultSettings()
  }

  try {
    return normalizeSettings(JSON.parse(savedValue))
  } catch {
    return createDefaultSettings()
  }
}

export function saveSettings(storage: Storage, settings: GameSettings): void {
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export function clearGameState(storage: Storage): void {
  storage.removeItem(STORAGE_KEY)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
