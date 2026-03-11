import { For, Show } from 'solid-js'
import { useGame } from '@/state/game-context'
import { ActionButton, formatElapsedMs } from './scoreboard.shared'

type HistoryPanelProps = {
  onEditRound: (roundId: string) => void
}

export function HistoryPanel(props: HistoryPanelProps) {
  const { deleteRound, duplicateRound, state, t } = useGame()

  return (
    <section class="rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">{t('scoreboard.history')}</p>
      </div>

      <section class="rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
        <Show
          when={state.rounds.length > 0}
          fallback={
            <p class="mt-4 rounded-3xl border border-dashed border-white/12 px-4 py-6 text-sm text-(--color-muted)">
              {t('scoreboard.empty')}
            </p>
          }
        >
          <div class="mt-4 space-y-3">
            <For each={state.rounds}>
              {(round, index) => (
                <article class="rounded-3xl border border-white/10 bg-(--color-surface) p-4 motion-safe:animate-[slide-up_220ms_ease-out]">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-base font-semibold text-(--color-fg)">{t('scoreboard.roundLabel', { round: index() + 1 })}</h3>
                      <p class="mt-1 text-sm text-(--color-muted)">
                        {t('scoreboard.cardPoints')}: {round.result.cardPoints['north-south']} / {round.result.cardPoints['east-west']}
                      </p>
                      <p class="text-sm text-(--color-muted)">
                        {t('scoreboard.bonuses')}: {round.result.tichuBonuses['north-south']} / {round.result.tichuBonuses['east-west']}
                      </p>
                      <p class="text-sm text-(--color-muted)">{t('scoreboard.elapsed')}: {formatElapsedMs(round.timing.elapsedMs)}</p>
                    </div>
                    <div class="grid gap-2 text-right">
                      <span class="text-lg font-semibold text-(--color-fg)">
                        {round.result.roundTotals['north-south']} : {round.result.roundTotals['east-west']}
                      </span>
                      <div class="flex justify-end gap-2">
                        <ActionButton onClick={() => props.onEditRound(round.id)}>{t('scoreboard.edit')}</ActionButton>
                        <ActionButton onClick={() => duplicateRound(round.id)}>{t('scoreboard.duplicate')}</ActionButton>
                        <ActionButton onClick={() => deleteRound(round.id)}>{t('scoreboard.delete')}</ActionButton>
                      </div>
                    </div>
                  </div>
                </article>
              )}
            </For>
          </div>
        </Show>
      </section>
    </section>
  )
}
