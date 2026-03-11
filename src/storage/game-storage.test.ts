import { createDefaultPlayers, createDefaultSettings } from '@/domain/defaults'
import type { PersistedGameState } from '@/domain/types'
import {
  clearGameState,
  createInitialGameState,
  deserializeGameState,
  loadGameState,
  loadSettings,
  normalizeSettings,
  saveGameState,
  saveSettings,
  SETTINGS_STORAGE_KEY,
  STORAGE_KEY,
} from '@/storage/game-storage'

function createMockState(): PersistedGameState {
  return {
    schemaVersion: 1,
    hasStartedGame: true,
    players: createDefaultPlayers(),
    rounds: [],
    activeRoundStartedAt: null,
    recentPlayerNames: ['Avery'],
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

  it('hydrates older payloads without recent names or team colors', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        hasStartedGame: true,
        players: createDefaultPlayers(),
        rounds: [],
        activeRoundStartedAt: null,
        settings: {
          language: 'en',
          theme: 'system',
        },
      }),
    )

    expect(loadGameState(localStorage)).toEqual({
      ...createInitialGameState(),
      hasStartedGame: true,
    })
  })

  it('can clear the saved game state', () => {
    saveGameState(localStorage, createMockState())

    clearGameState(localStorage)

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('loads standalone persisted settings when game state is missing', () => {
    saveSettings(localStorage, {
      ...createDefaultSettings(),
      language: 'ko',
      theme: 'light',
    })

    expect(loadGameState(localStorage).settings).toEqual({
      ...createDefaultSettings(),
      language: 'ko',
      theme: 'light',
    })
  })

  it('keeps standalone persisted settings when the game state payload is invalid', () => {
    localStorage.setItem(STORAGE_KEY, '{"schemaVersion":99}')
    saveSettings(localStorage, {
      ...createDefaultSettings(),
      language: 'ko',
      theme: 'dark',
    })

    expect(loadGameState(localStorage).settings).toEqual({
      ...createDefaultSettings(),
      language: 'ko',
      theme: 'dark',
    })
  })

  it('serializes and hydrates settings separately', () => {
    const settings = {
      ...createDefaultSettings(),
      language: 'ko' as const,
      theme: 'light' as const,
    }

    saveSettings(localStorage, settings)

    expect(loadSettings(localStorage)).toEqual(settings)
  })

  it('falls back to defaults for malformed settings payloads', () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, '{not-json')

    expect(loadSettings(localStorage)).toEqual(createDefaultSettings())
  })

  it('normalizes partial settings payloads', () => {
    expect(
      normalizeSettings({
        language: 'ko',
        theme: 'dark',
      }),
    ).toEqual({
      ...createDefaultSettings(),
      language: 'ko',
      theme: 'dark',
    })
  })

  it('normalizes an invalid recent player history limit back to default', () => {
    expect(
      normalizeSettings({
        language: 'en',
        theme: 'system',
        recentPlayerHistoryLimit: 99,
      }),
    ).toEqual({
      ...createDefaultSettings(),
    })
  })

  it('trims recent player names using the persisted history limit', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        hasStartedGame: true,
        players: createDefaultPlayers(),
        rounds: [],
        activeRoundStartedAt: null,
        recentPlayerNames: ['Morgan', 'Nova', 'Riley', 'Jordan', 'Casey', 'Taylor'],
        settings: {
          ...createDefaultSettings(),
          recentPlayerHistoryLimit: 3,
        },
      }),
    )

    expect(loadGameState(localStorage).recentPlayerNames).toEqual(['Morgan', 'Nova', 'Riley'])
  })
})
