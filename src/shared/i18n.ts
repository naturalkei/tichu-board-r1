import { flatten, resolveTemplate, translator } from '@solid-primitives/i18n'
import type { Language } from '../domain/types'

const dictionaries = {
  en: flatten({
    app: {
      badge: 'Tichu score tracker',
      title: 'TichuBoard',
      subtitle:
        'A fast, mobile-first score companion for live Tichu sessions with resilient local history.',
    },
    landing: {
      subtitle:
        'Start a new table-ready score session, keep round history locally, and switch language or theme any time.',
      start: 'Start scoring',
      caption: 'Your game stays in this browser until you reset it.',
      featureFastTitle: 'Fast round entry',
      featureFastBody: 'Track Tichu calls, first-out, and team card points without breaking table flow.',
      featureLocalTitle: 'Local persistence',
      featureLocalBody: 'Player names, seats, rounds, and preferences stay available after reloads.',
      featureBilingualTitle: 'Bilingual setup',
      featureBilingualBody: 'English and Korean are available from the first session with dark mode included.',
    },
    sections: {
      party: 'Party Setup',
      round: 'Round Entry',
      scoreboard: 'Scoreboard',
      settings: 'Settings',
    },
    seats: {
      north: 'North',
      east: 'East',
      south: 'South',
      west: 'West',
    },
    teams: {
      northSouth: 'North + South',
      eastWest: 'East + West',
    },
    party: {
      hint: 'Drag player cards onto another seat to swap positions.',
      nameLabel: '{{ seat }} player name',
      teamLabel: 'Team {{ team }}',
    },
    round: {
      firstOut: 'First Out',
      doubleVictory: 'Double Victory',
      noDoubleVictory: 'None',
      teamPoints: 'Team Card Points',
      tichu: 'Tichu',
      save: 'Save Round',
      update: 'Update Round',
      cancel: 'Cancel Edit',
      noCall: 'No Call',
      small: 'Small',
      grand: 'Grand',
      cardPointsHint: 'Normal rounds must total 100 points across both teams.',
      editing: 'Editing round {{ round }}',
    },
    scoreboard: {
      total: 'Total',
      rounds: 'Rounds',
      empty: 'No rounds yet. Enter the first round to start the scoreboard.',
      history: 'Round History',
      roundLabel: 'Round {{ round }}',
      edit: 'Edit',
      delete: 'Delete',
      duplicate: 'Duplicate',
      cardPoints: 'Card points',
      bonuses: 'Tichu bonuses',
      leading: 'Leading',
    },
    settings: {
      language: 'Language',
      theme: 'Theme',
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      reset: 'Reset Game',
      resetConfirm: 'Reset the saved game state?',
    },
    banners: {
      winner: '{{ team }} wins the game.',
      tieBreak: 'Both teams crossed 1000 with the same score. Play one more round.',
    },
    actions: {
      saveSuccess: 'Round saved.',
      updateSuccess: 'Round updated.',
    },
    language: {
      english: 'English',
      korean: 'Korean',
    },
  }),
  ko: flatten({
    app: {
      badge: '티츄 점수 트래커',
      title: 'TichuBoard',
      subtitle:
        '실전 플레이를 위한 모바일 중심 티츄 점수 동반 앱으로, 로컬 기록을 안정적으로 유지합니다.',
    },
    landing: {
      subtitle:
        '새 점수 세션을 시작하고, 라운드 기록을 로컬에 유지하며, 언어와 테마를 언제든 바꿀 수 있습니다.',
      start: '시작하기',
      caption: '게임 데이터는 초기화 전까지 이 브라우저에 유지됩니다.',
      featureFastTitle: '빠른 라운드 입력',
      featureFastBody: '티츄 콜, 첫 아웃, 팀 카드 점수를 끊김 없이 기록할 수 있습니다.',
      featureLocalTitle: '로컬 저장',
      featureLocalBody: '플레이어 이름, 자리, 라운드, 설정이 새로고침 후에도 유지됩니다.',
      featureBilingualTitle: '이중 언어 지원',
      featureBilingualBody: '첫 화면부터 영어와 한국어를 지원하고 다크 모드도 함께 제공합니다.',
    },
    sections: {
      party: '플레이어 설정',
      round: '라운드 입력',
      scoreboard: '점수판',
      settings: '설정',
    },
    seats: {
      north: '북',
      east: '동',
      south: '남',
      west: '서',
    },
    teams: {
      northSouth: '북 + 남',
      eastWest: '동 + 서',
    },
    party: {
      hint: '플레이어 카드를 다른 자리로 드래그하면 자리가 서로 바뀝니다.',
      nameLabel: '{{ seat }} 플레이어 이름',
      teamLabel: '{{ team }} 팀',
    },
    round: {
      firstOut: '첫 아웃',
      doubleVictory: '더블 빅토리',
      noDoubleVictory: '없음',
      teamPoints: '팀 카드 점수',
      tichu: '티츄',
      save: '라운드 저장',
      update: '라운드 수정',
      cancel: '수정 취소',
      noCall: '콜 없음',
      small: '스몰',
      grand: '그랜드',
      cardPointsHint: '일반 라운드에서는 양 팀 카드 점수 합이 100이어야 합니다.',
      editing: '{{ round }}라운드 수정 중',
    },
    scoreboard: {
      total: '총점',
      rounds: '라운드',
      empty: '아직 라운드가 없습니다. 첫 라운드를 입력해 주세요.',
      history: '라운드 기록',
      roundLabel: '{{ round }}라운드',
      edit: '수정',
      delete: '삭제',
      duplicate: '복제',
      cardPoints: '카드 점수',
      bonuses: '티츄 보너스',
      leading: '선두',
    },
    settings: {
      language: '언어',
      theme: '테마',
      system: '시스템',
      light: '라이트',
      dark: '다크',
      reset: '게임 초기화',
      resetConfirm: '저장된 게임 상태를 초기화할까요?',
    },
    banners: {
      winner: '{{ team }} 팀이 승리했습니다.',
      tieBreak: '양 팀이 같은 점수로 1000점을 넘었습니다. 한 라운드를 더 진행하세요.',
    },
    actions: {
      saveSuccess: '라운드가 저장되었습니다.',
      updateSuccess: '라운드가 수정되었습니다.',
    },
    language: {
      english: '영어',
      korean: '한국어',
    },
  }),
} as const

type Dictionary = (typeof dictionaries)['en']
export type TranslationKey = keyof Dictionary

export function createTranslator(language: Language) {
  const currentDictionary = dictionaries[language]
  const translate = translator(() => currentDictionary, resolveTemplate)

  return (key: TranslationKey, args?: Record<string, string | number | boolean>) => {
    const value = args ? translate(key, args) : translate(key)
    return typeof value === 'string' ? value : ''
  }
}
