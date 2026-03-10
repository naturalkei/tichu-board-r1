import {
  DOUBLE_VICTORY_SCORE,
  GRAND_TICHU_BONUS,
  NORMAL_ROUND_TOTAL_POINTS,
  SMALL_TICHU_BONUS,
  TARGET_SCORE,
} from './constants'
import { createEmptyTeamScoreMap, getPlayerById, getTeamIdBySeat } from './helpers'
import type {
  GameStatus,
  Player,
  RoundInput,
  RoundScoreBreakdown,
  RoundValidationError,
  RoundValidationResult,
  TeamId,
  TeamScoreMap,
  TichuCallResult,
} from './types'

export function validateRoundInput(players: Player[], input: RoundInput): RoundValidationResult {
  const errors: RoundValidationError[] = []

  if (players.length !== 4) {
    errors.push({
      field: 'players',
      message: 'Exactly four players are required.',
    })
  }

  const firstOutPlayer = getPlayerById(players, input.firstOutPlayerId)

  if (!firstOutPlayer) {
    errors.push({
      field: 'first-out',
      message: 'The first-out player must exist in the current party.',
    })
  }

  if (input.doubleVictoryTeamId) {
    if (input.cardPoints !== null) {
      errors.push({
        field: 'double-victory',
        message: 'Card points must be empty when double victory is active.',
      })
    }
  } else {
    if (!input.cardPoints) {
      errors.push({
        field: 'card-points',
        message: 'Card points are required for a normal round.',
      })
    } else if (
      input.cardPoints['north-south'] + input.cardPoints['east-west'] !==
      NORMAL_ROUND_TOTAL_POINTS
    ) {
      errors.push({
        field: 'card-points',
        message: 'Card points must total 100 in a normal round.',
      })
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true }
}

export function calculateRoundScore(players: Player[], input: RoundInput): RoundScoreBreakdown {
  const validation = validateRoundInput(players, input)

  if (!validation.ok) {
    throw new Error(validation.errors.map((error) => error.message).join(' '))
  }

  const cardPoints = createCardPointTotals(input)
  const tichuBonuses = createEmptyTeamScoreMap()
  const callResults: TichuCallResult[] = []
  const firstOutPlayer = getPlayerById(players, input.firstOutPlayerId)

  if (!firstOutPlayer) {
    throw new Error('The first-out player could not be resolved.')
  }

  for (const player of players) {
    const call = input.tichuCalls[player.id]

    if (call === 'none') {
      continue
    }

    const scoreValue = call === 'small' ? SMALL_TICHU_BONUS : GRAND_TICHU_BONUS
    const succeeded = player.id === firstOutPlayer.id
    const scoreDelta = succeeded ? scoreValue : -scoreValue
    const teamId = getTeamIdBySeat(player.seat)

    tichuBonuses[teamId] += scoreDelta
    callResults.push({
      playerId: player.id,
      teamId,
      call,
      succeeded,
      scoreDelta,
    })
  }

  return {
    cardPoints,
    tichuBonuses,
    roundTotals: addTeamScores(cardPoints, tichuBonuses),
    callResults,
  }
}

export function calculateCumulativeScores(rounds: RoundScoreBreakdown[]): TeamScoreMap {
  return rounds.reduce(
    (totals, round) => addTeamScores(totals, round.roundTotals),
    createEmptyTeamScoreMap(),
  )
}

export function getGameStatus(teamScores: TeamScoreMap): GameStatus {
  const northSouthReached = teamScores['north-south'] >= TARGET_SCORE
  const eastWestReached = teamScores['east-west'] >= TARGET_SCORE

  if (!northSouthReached && !eastWestReached) {
    return {
      isGameOver: false,
      winnerTeamId: null,
      tieBreakRequired: false,
    }
  }

  if (northSouthReached && eastWestReached) {
    if (teamScores['north-south'] === teamScores['east-west']) {
      return {
        isGameOver: false,
        winnerTeamId: null,
        tieBreakRequired: true,
      }
    }

    return {
      isGameOver: true,
      winnerTeamId:
        teamScores['north-south'] > teamScores['east-west'] ? 'north-south' : 'east-west',
      tieBreakRequired: false,
    }
  }

  return {
    isGameOver: true,
    winnerTeamId: northSouthReached ? 'north-south' : 'east-west',
    tieBreakRequired: false,
  }
}

function createCardPointTotals(input: RoundInput): TeamScoreMap {
  if (input.doubleVictoryTeamId) {
    return {
      'north-south': input.doubleVictoryTeamId === 'north-south' ? DOUBLE_VICTORY_SCORE : 0,
      'east-west': input.doubleVictoryTeamId === 'east-west' ? DOUBLE_VICTORY_SCORE : 0,
    }
  }

  if (!input.cardPoints) {
    throw new Error('Card points are required when double victory is not active.')
  }

  return {
    'north-south': input.cardPoints['north-south'],
    'east-west': input.cardPoints['east-west'],
  }
}

function addTeamScores(left: TeamScoreMap, right: TeamScoreMap): TeamScoreMap {
  return {
    'north-south': left['north-south'] + right['north-south'],
    'east-west': left['east-west'] + right['east-west'],
  }
}

export function getLeadingTeamId(teamScores: TeamScoreMap): TeamId | null {
  if (teamScores['north-south'] === teamScores['east-west']) {
    return null
  }

  return teamScores['north-south'] > teamScores['east-west'] ? 'north-south' : 'east-west'
}
