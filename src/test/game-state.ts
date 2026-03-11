import { createDefaultPlayers, createDefaultSettings } from '@/domain/defaults'
import { getHashForRoute, type AppRoute } from '@/shared/routes'
import { STORAGE_KEY } from '@/storage/game-storage'

export function seedStartedGameState(route: AppRoute = 'party') {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      hasStartedGame: true,
      players: createDefaultPlayers(),
      rounds: [],
      recentPlayerNames: [],
      settings: createDefaultSettings(),
    }),
  )

  window.location.hash = getHashForRoute(route)
}
