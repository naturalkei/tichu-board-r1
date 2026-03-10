import { PLAYER_IDS, SEATS } from './constants'
import type { GameSettings, Player, PlayerTichuCallMap } from './types'

const DEFAULT_PLAYER_NAMES = ['Phoenix', 'Dragon', 'Pagoda', 'Jade'] as const

export function createDefaultPlayers(): Player[] {
  return PLAYER_IDS.map((id, index) => ({
    id,
    name: DEFAULT_PLAYER_NAMES[index],
    seat: SEATS[index],
  }))
}

export function createDefaultTichuCalls(): PlayerTichuCallMap {
  return {
    'player-1': 'none',
    'player-2': 'none',
    'player-3': 'none',
    'player-4': 'none',
  }
}

export function createDefaultSettings(): GameSettings {
  return {
    language: 'en',
    theme: 'system',
  }
}
