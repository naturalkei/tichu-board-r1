import historyIcon from '@/assets/tab-icons/history.svg'
import partyIcon from '@/assets/tab-icons/party.svg'
import resultsIcon from '@/assets/tab-icons/results.svg'
import roundIcon from '@/assets/tab-icons/round.svg'
import settingsIcon from '@/assets/tab-icons/settings.svg'
import type { InGameRoute } from '@/shared/routes'

export const gameTabIcons: Record<InGameRoute | 'settings', string> = {
  party: partyIcon,
  round: roundIcon,
  results: resultsIcon,
  history: historyIcon,
  settings: settingsIcon,
}
