import { For, Show } from 'solid-js'
import { useGame } from '../../state/game-context'
import type { TeamId } from '../../domain/types'

type ScoreboardProps = {
  onEditRound: (roundId: string) => void
}

export function Scoreboard(props: ScoreboardProps) {
  const {
    cumulativeScores,
    deleteRound,
    duplicateRound,
    gameStatus,
    leadingTeamId,
    state,
    t,
    teamNames,
  } = useGame()

  return (
    <section class="space-y-4">
      <Show when={gameStatus().tieBreakRequired}>
        <Banner tone="amber">{t('banners.tieBreak')}</Banner>
      </Show>
      <Show when={gameStatus().isGameOver && gameStatus().winnerTeamId}>
        <Banner tone="emerald">
          {t('banners.winner', {
            team: teamNames()[gameStatus().winnerTeamId as TeamId],
          })}
        </Banner>
      </Show>

      <section class="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {t('sections.scoreboard')}
          </p>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--color-muted)]">
            {state.rounds.length} {t('scoreboard.rounds')}
          </span>
        </div>

        <div class="mt-5 grid gap-3">
          <TeamTotalCard
            teamId="north-south"
            total={cumulativeScores()['north-south']}
            label={teamNames()['north-south']}
            isLeading={leadingTeamId() === 'north-south'}
          />
          <TeamTotalCard
            teamId="east-west"
            total={cumulativeScores()['east-west']}
            label={teamNames()['east-west']}
            isLeading={leadingTeamId() === 'east-west'}
          />
        </div>
      </section>

      <section class="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {t('scoreboard.history')}
          </p>
        </div>

        <Show
          when={state.rounds.length > 0}
          fallback={
            <p class="mt-4 rounded-[1.5rem] border border-dashed border-white/12 px-4 py-6 text-sm text-[var(--color-muted)]">
              {t('scoreboard.empty')}
            </p>
          }
        >
          <div class="mt-4 space-y-3">
            <For each={state.rounds}>
              {(round, index) => (
                <article class="rounded-[1.5rem] border border-white/10 bg-[var(--color-surface)] p-4 motion-safe:animate-[slide-up_220ms_ease-out]">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-base font-semibold text-[var(--color-fg)]">
                        {t('scoreboard.roundLabel', { round: index() + 1 })}
                      </h3>
                      <p class="mt-1 text-sm text-[var(--color-muted)]">
                        {t('scoreboard.cardPoints')}: {round.result.cardPoints['north-south']} /{' '}
                        {round.result.cardPoints['east-west']}
                      </p>
                      <p class="text-sm text-[var(--color-muted)]">
                        {t('scoreboard.bonuses')}: {round.result.tichuBonuses['north-south']} /{' '}
                        {round.result.tichuBonuses['east-west']}
                      </p>
                    </div>
                    <div class="grid gap-2 text-right">
                      <span class="text-lg font-semibold text-[var(--color-fg)]">
                        {round.result.roundTotals['north-south']} : {round.result.roundTotals['east-west']}
                      </span>
                      <div class="flex justify-end gap-2">
                        <ActionButton onClick={() => props.onEditRound(round.id)}>
                          {t('scoreboard.edit')}
                        </ActionButton>
                        <ActionButton onClick={() => duplicateRound(round.id)}>
                          {t('scoreboard.duplicate')}
                        </ActionButton>
                        <ActionButton onClick={() => deleteRound(round.id)}>
                          {t('scoreboard.delete')}
                        </ActionButton>
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

function TeamTotalCard(props: {
  teamId: TeamId
  total: number
  label: string
  isLeading: boolean
}) {
  const { t } = useGame()

  return (
    <article
      class={`rounded-[1.6rem] border p-4 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 ${
        props.isLeading
          ? 'border-amber-300/40 bg-amber-300/10'
          : 'border-white/10 bg-[var(--color-surface)]'
      }`}
      data-testid={`team-total-${props.teamId}`}
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">{props.label}</p>
          <Show when={props.isLeading}>
            <p class="mt-2 text-sm text-amber-100">{t('scoreboard.leading')}</p>
          </Show>
        </div>
        <div class="text-right">
          <p class="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {t('scoreboard.total')}
          </p>
          <p class="mt-2 text-3xl font-semibold text-[var(--color-fg)]">{props.total}</p>
        </div>
      </div>
    </article>
  )
}

function Banner(props: { children: string; tone: 'amber' | 'emerald' }) {
  return (
    <div
      class={`rounded-[1.5rem] border px-4 py-3 text-sm ${
        props.tone === 'amber'
          ? 'border-amber-300/35 bg-amber-300/10 text-amber-50'
          : 'border-emerald-300/35 bg-emerald-300/10 text-emerald-50'
      }`}
    >
      {props.children}
    </div>
  )
}

function ActionButton(props: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      class="rounded-full border border-white/10 px-3 py-2 text-xs text-[var(--color-fg)]"
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  )
}
