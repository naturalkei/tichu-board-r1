import clsx from 'clsx'
import { Match, createEffect, createSignal, onCleanup, Switch } from 'solid-js'
import { PartySetup } from '@/features/party-setup/PartySetup'
import { RoundEntry } from '@/features/rounds/RoundEntry'
import { HistoryPanel, ResultsSummary } from '@/features/scoreboard/Scoreboard'
import { useGame } from '@/state/game-context'
import { PageSection } from './PageSection'

type GameplayPagesProps = {
  route: 'party' | 'round' | 'results' | 'history'
  transitionDirection: 'forward' | 'backward' | 'none'
  transitionKey: number
  editingRoundId: string | null
  onEditRound: (roundId: string) => void
  onEditingRoundIdChange: (roundId: string | null) => void
}

export function GameplayPages(props: GameplayPagesProps) {
  const { t } = useGame()
  const [animationClass, setAnimationClass] = createSignal('')

  createEffect(() => {
    const direction = props.transitionDirection
    const transitionKey = props.transitionKey

    if (transitionKey === 0 || direction === 'none') {
      setAnimationClass('')
      return
    }

    const nextClass =
      direction === 'forward'
        ? 'motion-safe:animate-[page-slide-forward_220ms_cubic-bezier(0.22,1,0.36,1)]'
        : 'motion-safe:animate-[page-slide-backward_220ms_cubic-bezier(0.22,1,0.36,1)]'

    setAnimationClass('')
    const frameId = window.requestAnimationFrame(() => setAnimationClass(nextClass))
    onCleanup(() => window.cancelAnimationFrame(frameId))
  })

  return (
    <div
      data-testid={`page-transition-${props.route}`}
      data-transition-key={props.transitionKey}
      class={clsx('motion-safe:will-change-transform', animationClass())}
    >
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
    </div>
  )
}
