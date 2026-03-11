import clsx from 'clsx'
import { Show } from 'solid-js'
import type { TeamId } from '@/domain/types'
import { useGame } from '@/state/game-context'
import { ShareScoreButton } from './ShareScoreButton'
import { Banner } from './scoreboard.shared'

export function ResultsSummary() {
  const { cumulativeScores, gameStatus, leadingTeamId, state, t, teamNames } = useGame()

  return (
    <section class="space-y-4">
      <Show when={gameStatus().tieBreakRequired}>
        <Banner tone="amber">{t('banners.tieBreak')}</Banner>
      </Show>
      <Show when={gameStatus().isGameOver && gameStatus().winnerTeamId}>
        <Banner tone="emerald">
          {t('banners.winner', { team: teamNames()[gameStatus().winnerTeamId as TeamId] })}
        </Banner>
      </Show>

      <section class="rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">{t('sections.scoreboard')}</p>
            <span class="mt-2 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-(--color-muted)">
              {state.rounds.length} {t('scoreboard.rounds')}
            </span>
          </div>
          <ShareScoreButton />
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
    </section>
  )
}

export function GlobalScoreSummary() {
  const { cumulativeScores, leadingTeamId, state, teamNames, t } = useGame()

  return (
    <Show when={state.rounds.length > 0}>
      <section
        class="sticky top-4 z-10 rounded-[1.8rem] border border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl"
        data-testid="global-score-summary"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.24em] text-(--color-accent)">{t('scoreboard.floatingLabel')}</p>
            <p class="mt-1 text-xs text-(--color-muted)">{state.rounds.length} {t('scoreboard.rounds')}</p>
          </div>
          <ShareScoreButton />
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <CompactScoreCard
            label={teamNames()['north-south']}
            total={cumulativeScores()['north-south']}
            isLeading={leadingTeamId() === 'north-south'}
          />
          <CompactScoreCard
            label={teamNames()['east-west']}
            total={cumulativeScores()['east-west']}
            isLeading={leadingTeamId() === 'east-west'}
          />
        </div>
      </section>
    </Show>
  )
}

function TeamTotalCard(props: { teamId: TeamId; total: number; label: string; isLeading: boolean }) {
  const { t } = useGame()

  return (
    <article
      class={clsx(
        'rounded-[1.6rem] border p-4',
        'transition-transform duration-200 motion-safe:hover:-translate-y-0.5',
        props.isLeading ? 'border-amber-300/40 bg-amber-300/10' : 'border-white/10 bg-(--color-surface)',
      )}
      data-testid={`team-total-${props.teamId}`}
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-(--color-accent)">{props.label}</p>
          <Show when={props.isLeading}>
            <p class="mt-2 text-sm text-amber-100">{t('scoreboard.leading')}</p>
          </Show>
        </div>
        <div class="text-right">
          <p class="text-xs uppercase tracking-[0.22em] text-(--color-muted)">{t('scoreboard.total')}</p>
          <p class="mt-2 text-3xl font-semibold text-(--color-fg)">{props.total}</p>
        </div>
      </div>
    </article>
  )
}

function CompactScoreCard(props: { label: string; total: number; isLeading: boolean }) {
  return (
    <article
      class={clsx(
        'rounded-3xl border p-3',
        props.isLeading ? 'border-amber-300/35 bg-amber-300/10' : 'border-white/10 bg-black/10',
      )}
    >
      <p class="truncate text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">{props.label}</p>
      <p class="mt-2 text-2xl font-semibold text-(--color-fg)">{props.total}</p>
    </article>
  )
}
