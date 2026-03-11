import { Match, Switch } from 'solid-js'
import { PartySetup } from '@/features/party-setup/PartySetup'
import { RoundEntry } from '@/features/rounds/RoundEntry'
import { HistoryPanel, ResultsSummary } from '@/features/scoreboard/Scoreboard'
import { useGame } from '@/state/game-context'
import { PageSection } from './PageSection'

type GameplayPagesProps = {
  route: 'party' | 'round' | 'results' | 'history'
  editingRoundId: string | null
  onEditRound: (roundId: string) => void
  onEditingRoundIdChange: (roundId: string | null) => void
}

export function GameplayPages(props: GameplayPagesProps) {
  const { t } = useGame()

  return (
    <Switch>
      <Match when={props.route === 'party'}>
        <PageSection title={t('pages.partyTitle')} subtitle={t('pages.partySubtitle')}>
          <PartySetup />
        </PageSection>
      </Match>
      <Match when={props.route === 'round'}>
        <PageSection title={t('pages.roundTitle')} subtitle={t('pages.roundSubtitle')}>
          <RoundEntry
            editingRoundId={props.editingRoundId}
            onEditingRoundIdChange={props.onEditingRoundIdChange}
          />
        </PageSection>
      </Match>
      <Match when={props.route === 'results'}>
        <PageSection title={t('pages.resultsTitle')} subtitle={t('pages.resultsSubtitle')}>
          <ResultsSummary />
        </PageSection>
      </Match>
      <Match when={true}>
        <PageSection title={t('pages.historyTitle')} subtitle={t('pages.historySubtitle')}>
          <HistoryPanel onEditRound={props.onEditRound} />
        </PageSection>
      </Match>
    </Switch>
  )
}
