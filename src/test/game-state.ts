import { createDefaultPlayers, createDefaultSettings } from '../domain/defaults'
import { STORAGE_KEY } from '../storage/game-storage'

export function seedStartedGameState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      hasStartedGame: true,
      players: createDefaultPlayers(),
      rounds: [],
      settings: createDefaultSettings(),
    }),
  )
}
