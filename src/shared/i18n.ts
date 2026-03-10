import { flatten, resolveTemplate, translator } from '@solid-primitives/i18n'
import type { Language } from '../domain/types'

const dictionaries = {
  en: flatten({
    app: {
      badge: 'Tichu score tracker',
      title: 'TichuBoard',
      controlSubtitle: 'Compact round control for live table sessions',
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
    pages: {
      partyTitle: 'Party Setup',
      partySubtitle: 'Arrange seats, reroll player names, and lock in the team layout before the first round.',
      roundTitle: 'Round Entry',
      roundSubtitle: 'Capture Tichu calls, first-out, and card points with a round-focused input screen.',
      resultsTitle: 'Game Results',
      resultsSubtitle: 'Check current leaders, winner state, and cumulative team totals at a glance.',
      historyTitle: 'Round History',
      historySubtitle: 'Review, edit, duplicate, or delete previous rounds without losing the running score.',
    },
    nav: {
      label: 'Game navigation',
      party: 'Party',
      round: 'Round',
      results: 'Results',
      history: 'History',
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
      hint: 'Drag cards or use the seat picker to keep names fixed while swapping chairs.',
      nameLabel: '{{ seat }} player name',
      rerollName: 'Reroll random name',
      seatPicker: 'Seat picker for {{ seat }}',
      seatPickerLabel: 'Move {{ seat }} player',
      tableLabel: 'Table overview',
      tableCenter: 'Tabletop setup',
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
      open: 'Open settings',
      close: 'Close settings',
      panelTitle: 'Table settings',
      panelSubtitle: 'Adjust language, theme, and saved game controls without leaving the score view.',
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
      controlSubtitle: '실전 테이블 진행에 맞춘 컴팩트 점수 컨트롤',
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
    pages: {
      partyTitle: '파티 편성',
      partySubtitle: '첫 라운드 전에 좌석을 정리하고, 이름을 다시 뽑고, 팀 구성을 확정합니다.',
      roundTitle: '게임 라운드',
      roundSubtitle: '티츄 콜, 첫 아웃, 카드 점수를 라운드 입력 흐름에 맞춰 빠르게 기록합니다.',
      resultsTitle: '게임 결과',
      resultsSubtitle: '현재 선두, 승리 상태, 누적 팀 점수를 한눈에 확인합니다.',
      historyTitle: '히스토리',
      historySubtitle: '이전 라운드를 검토하고 수정, 복제, 삭제하면서 누적 점수를 유지합니다.',
    },
    nav: {
      label: '게임 내비게이션',
      party: '파티',
      round: '라운드',
      results: '결과',
      history: '히스토리',
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
      hint: '카드를 드래그하거나 자리 선택기를 사용해 이름을 유지한 채 좌석을 바꿀 수 있습니다.',
      nameLabel: '{{ seat }} 플레이어 이름',
      rerollName: '랜덤 이름 다시 뽑기',
      seatPicker: '{{ seat }} 자리 선택기',
      seatPickerLabel: '{{ seat }} 플레이어 자리 변경',
      tableLabel: '테이블 개요',
      tableCenter: '테이블탑 배치',
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
      open: '설정 열기',
      close: '설정 닫기',
      panelTitle: '테이블 설정',
      panelSubtitle: '점수 화면을 벗어나지 않고 언어, 테마, 저장된 게임 제어를 조정합니다.',
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
