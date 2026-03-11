import { HistoryPanel } from './HistoryPanel'
import { GlobalScoreSummary, ResultsSummary } from './ResultsSummary'

type ScoreboardProps = {
  onEditRound: (roundId: string) => void
}

export function Scoreboard(props: ScoreboardProps) {
  return (
    <section class="space-y-4">
      <ResultsSummary />
      <HistoryPanel onEditRound={props.onEditRound} />
    </section>
  )
}

export { GlobalScoreSummary, HistoryPanel, ResultsSummary }
