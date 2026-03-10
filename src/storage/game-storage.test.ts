import { createDefaultPlayers, createDefaultSettings } from '../domain/defaults'
import type { PersistedGameState } from '../domain/types'
import {
  clearGameState,
  createInitialGameState,
  deserializeGameState,
  loadGameState,
  saveGameState,
  STORAGE_KEY,
} from './game-storage'

function createMockState(): PersistedGameState {
  return {
    schemaVersion: 1,
    hasStartedGame: true,
    players: createDefaultPlayers(),
    rounds: [],
    settings: createDefaultSettings(),
  }
}

describe('game storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('serializes and hydrates stored state', () => {
    const state = createMockState()

    saveGameState(localStorage, state)

    expect(loadGameState(localStorage)).toEqual(state)
  })

  it('falls back to an initial state when the saved payload is invalid', () => {
    localStorage.setItem(STORAGE_KEY, '{"schemaVersion":99}')

    expect(loadGameState(localStorage)).toEqual(createInitialGameState())
  })

  it('returns null for malformed serialized input', () => {
    expect(deserializeGameState('{not-json')).toBeNull()
  })

  it('hydrates older payloads without hasStartedGame by inferring from rounds', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        players: createDefaultPlayers(),
        rounds: [],
        settings: createDefaultSettings(),
      }),
    )

    expect(loadGameState(localStorage)).toEqual(createInitialGameState())
  })

  it('can clear the saved game state', () => {
    saveGameState(localStorage, createMockState())

    clearGameState(localStorage)

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
