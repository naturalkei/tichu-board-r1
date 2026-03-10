import { createDefaultPlayers, createDefaultSettings } from '../domain/defaults'
import type { PersistedGameState } from '../domain/types'

export const STORAGE_KEY = 'tichu-board-r1:v1'
export const CURRENT_SCHEMA_VERSION = 1 as const

export function createInitialGameState(): PersistedGameState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    players: createDefaultPlayers(),
    rounds: [],
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

  return value as PersistedGameState
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

  if (!savedValue) {
    return createInitialGameState()
  }

  return deserializeGameState(savedValue) ?? createInitialGameState()
}

export function saveGameState(storage: Storage, state: PersistedGameState): void {
  storage.setItem(STORAGE_KEY, serializeGameState(state))
}

export function clearGameState(storage: Storage): void {
  storage.removeItem(STORAGE_KEY)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
