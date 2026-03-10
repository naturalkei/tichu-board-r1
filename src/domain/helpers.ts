import { TEAM_IDS } from './constants'
import type { Player, PlayerId, Seat, TeamId, TeamScoreMap } from './types'

export function getTeamIdBySeat(seat: Seat): TeamId {
  return seat === 'north' || seat === 'south' ? TEAM_IDS[0] : TEAM_IDS[1]
}

export function createEmptyTeamScoreMap(): TeamScoreMap {
  return {
    'north-south': 0,
    'east-west': 0,
  }
}

export function getPlayerById(players: Player[], playerId: PlayerId): Player | undefined {
  return players.find((player) => player.id === playerId)
}
