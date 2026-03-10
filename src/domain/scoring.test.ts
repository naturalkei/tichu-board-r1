import { createDefaultPlayers, createDefaultTichuCalls } from './defaults'
import {
  calculateCumulativeScores,
  calculateRoundScore,
  getGameStatus,
  validateRoundInput,
} from './scoring'

describe('scoring', () => {
  it('scores a successful small tichu for the first-out player', () => {
    const players = createDefaultPlayers()
    const calls = createDefaultTichuCalls()
    calls['player-1'] = 'small'

    const result = calculateRoundScore(players, {
      tichuCalls: calls,
      firstOutPlayerId: 'player-1',
      doubleVictoryTeamId: null,
      cardPoints: {
        'north-south': 60,
        'east-west': 40,
      },
    })

    expect(result.tichuBonuses['north-south']).toBe(100)
    expect(result.roundTotals['north-south']).toBe(160)
    expect(result.roundTotals['east-west']).toBe(40)
    expect(result.callResults[0]?.succeeded).toBe(true)
  })

  it('scores a failed grand tichu against the caller team', () => {
    const players = createDefaultPlayers()
    const calls = createDefaultTichuCalls()
    calls['player-2'] = 'grand'

    const result = calculateRoundScore(players, {
      tichuCalls: calls,
      firstOutPlayerId: 'player-1',
      doubleVictoryTeamId: null,
      cardPoints: {
        'north-south': 55,
        'east-west': 45,
      },
    })

    expect(result.tichuBonuses['east-west']).toBe(-200)
    expect(result.roundTotals['east-west']).toBe(-155)
    expect(result.callResults[0]?.succeeded).toBe(false)
  })

  it('uses the double victory score and ignores card points', () => {
    const players = createDefaultPlayers()

    const result = calculateRoundScore(players, {
      tichuCalls: createDefaultTichuCalls(),
      firstOutPlayerId: 'player-1',
      doubleVictoryTeamId: 'east-west',
      cardPoints: null,
    })

    expect(result.cardPoints).toEqual({
      'north-south': 0,
      'east-west': 200,
    })
    expect(result.roundTotals['east-west']).toBe(200)
  })

  it('calculates cumulative totals across rounds', () => {
    const players = createDefaultPlayers()

    const firstRound = calculateRoundScore(players, {
      tichuCalls: createDefaultTichuCalls(),
      firstOutPlayerId: 'player-1',
      doubleVictoryTeamId: null,
      cardPoints: {
        'north-south': 70,
        'east-west': 30,
      },
    })

    const secondRound = calculateRoundScore(players, {
      tichuCalls: createDefaultTichuCalls(),
      firstOutPlayerId: 'player-2',
      doubleVictoryTeamId: 'east-west',
      cardPoints: null,
    })

    expect(calculateCumulativeScores([firstRound, secondRound])).toEqual({
      'north-south': 70,
      'east-west': 230,
    })
  })

  it('requires another round when both teams tie above 1000', () => {
    expect(
      getGameStatus({
        'north-south': 1020,
        'east-west': 1020,
      }),
    ).toEqual({
      isGameOver: false,
      winnerTeamId: null,
      tieBreakRequired: true,
    })
  })

  it('validates that normal round card points total 100', () => {
    const validation = validateRoundInput(createDefaultPlayers(), {
      tichuCalls: createDefaultTichuCalls(),
      firstOutPlayerId: 'player-1',
      doubleVictoryTeamId: null,
      cardPoints: {
        'north-south': 80,
        'east-west': 50,
      },
    })

    expect(validation.ok).toBe(false)
  })
})
