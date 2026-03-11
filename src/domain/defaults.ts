import { PLAYER_IDS, SEATS } from './constants'
import type {
  GameSettings,
  Language,
  Player,
  PlayerTichuCallMap,
  RecentPlayerHistoryLimit,
  TeamColor,
  TeamId,
} from './types'

export const DEFAULT_RECENT_PLAYER_HISTORY_LIMIT = 5 as const
export const RECENT_PLAYER_HISTORY_LIMIT_OPTIONS = [3, 5, 10, 15] as const

const ENGLISH_PLAYER_NAMES = [
  'Avery',
  'Bennett',
  'Cameron',
  'Dakota',
  'Ellis',
  'Finley',
  'Gray',
  'Harper',
  'Indigo',
  'Jules',
  'Kai',
  'Logan',
  'Marlowe',
  'Nova',
  'Oakley',
  'Parker',
  'Quinn',
  'Reese',
  'Sawyer',
  'Tatum',
  'Uma',
  'Vale',
  'Wren',
  'Xen',
  'Yael',
  'Zuri',
  'Arden',
  'Blake',
  'Cleo',
  'Drew',
  'Emery',
  'Flynn',
  'Gale',
  'Hollis',
  'Ira',
  'Jordan',
  'Kendall',
  'Lane',
  'Morgan',
  'Nico',
  'Onyx',
  'Peyton',
  'River',
  'Sage',
  'Teagan',
  'Urban',
  'Vesper',
  'Winter',
  'Zephyr',
  'Atlas',
] as const

const KOREAN_PLAYER_NAMES = [
  '민준',
  '서준',
  '도윤',
  '예준',
  '시우',
  '주원',
  '지호',
  '하준',
  '유준',
  '준우',
  '서연',
  '서윤',
  '지우',
  '하은',
  '하윤',
  '민서',
  '지유',
  '채원',
  '수아',
  '예은',
  '도현',
  '지환',
  '은우',
  '현우',
  '건우',
  '우진',
  '윤호',
  '정우',
  '시윤',
  '태윤',
  '소율',
  '예린',
  '지원',
  '윤서',
  '시아',
  '가은',
  '다은',
  '채아',
  '서아',
  '유나',
  '준영',
  '민재',
  '태민',
  '현서',
  '하람',
  '도연',
  '주아',
  '나윤',
  '로아',
  '이안',
] as const

export function createDefaultPlayers(): Player[] {
  const initialNames = ENGLISH_PLAYER_NAMES.slice(0, PLAYER_IDS.length)

  return PLAYER_IDS.map((id, index) => ({
    id,
    name: initialNames[index]!,
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
    recentPlayerHistoryLimit: DEFAULT_RECENT_PLAYER_HISTORY_LIMIT,
    teamColors: createDefaultTeamColors(),
    teamNames: createDefaultTeamNames('en'),
  }
}

export function createDefaultTeamColors(): Record<TeamId, TeamColor> {
  return {
    'north-south': 'rose',
    'east-west': 'emerald',
  }
}

export function createDefaultTeamNames(language: Language): Record<TeamId, string> {
  return language === 'ko'
    ? {
        'north-south': '1팀',
        'east-west': '2팀',
      }
    : {
        'north-south': 'Team 1',
        'east-west': 'Team 2',
      }
}

export function isRecentPlayerHistoryLimit(value: unknown): value is RecentPlayerHistoryLimit {
  return RECENT_PLAYER_HISTORY_LIMIT_OPTIONS.some((option) => option === value)
}

export function mergeRecentPlayerNames(
  existingNames: string[],
  nextNames: string[],
  limit: RecentPlayerHistoryLimit = DEFAULT_RECENT_PLAYER_HISTORY_LIMIT,
) {
  const merged = [...nextNames, ...existingNames]
  const uniqueNames = merged.filter((name, index) => merged.indexOf(name) === index)

  return uniqueNames.slice(0, limit)
}

export function getRandomPlayerName(language: Language, currentName?: string) {
  const pool = language === 'ko' ? KOREAN_PLAYER_NAMES : ENGLISH_PLAYER_NAMES
  const availableNames = pool.filter((name) => name !== currentName)

  if (availableNames.length === 0) {
    return currentName ?? pool[0]
  }

  return availableNames[Math.floor(Math.random() * availableNames.length)]!
}
