import clsx from 'clsx'
import { For, Show, createSignal } from 'solid-js'
import type { TeamId } from '@/domain/types'
import { useGame } from '@/state/game-context'

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
            <p class="text-[11px] uppercase tracking-[0.24em] text-(--color-accent)">
              {t('scoreboard.floatingLabel')}
            </p>
            <p class="mt-1 text-xs text-(--color-muted)">
              {state.rounds.length} {t('scoreboard.rounds')}
            </p>
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

export function ResultsSummary() {
  const {
    cumulativeScores,
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

      <section class="rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">
              {t('sections.scoreboard')}
            </p>
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

export function HistoryPanel(props: ScoreboardProps) {
  const { deleteRound, duplicateRound, state, t } = useGame()

  return (
    <section class="rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">
          {t('scoreboard.history')}
        </p>
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
                      <h3 class="text-base font-semibold text-(--color-fg)">
                        {t('scoreboard.roundLabel', { round: index() + 1 })}
                      </h3>
                      <p class="mt-1 text-sm text-(--color-muted)">
                        {t('scoreboard.cardPoints')}: {round.result.cardPoints['north-south']} /{' '}
                        {round.result.cardPoints['east-west']}
                      </p>
                      <p class="text-sm text-(--color-muted)">
                        {t('scoreboard.bonuses')}: {round.result.tichuBonuses['north-south']} /{' '}
                        {round.result.tichuBonuses['east-west']}
                      </p>
                      <p class="text-sm text-(--color-muted)">
                        {t('scoreboard.elapsed')}: {formatElapsedMs(round.timing.elapsedMs)}
                      </p>
                    </div>
                    <div class="grid gap-2 text-right">
                      <span class="text-lg font-semibold text-(--color-fg)">
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
      class={clsx(
        'rounded-[1.6rem] border p-4',
        'transition-transform duration-200 motion-safe:hover:-translate-y-0.5',
        props.isLeading
          ? 'border-amber-300/40 bg-amber-300/10'
          : 'border-white/10 bg-(--color-surface)',
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
          <p class="text-xs uppercase tracking-[0.22em] text-(--color-muted)">
            {t('scoreboard.total')}
          </p>
          <p class="mt-2 text-3xl font-semibold text-(--color-fg)">{props.total}</p>
        </div>
      </div>
    </article>
  )
}

function Banner(props: { children: string; tone: 'amber' | 'emerald' }) {
  return (
    <div
      class={clsx(
        'rounded-3xl border px-4 py-3 text-sm',
        props.tone === 'amber'
          ? 'border-amber-300/35 bg-amber-300/10 text-amber-50'
          : 'border-emerald-300/35 bg-emerald-300/10 text-emerald-50',
      )}
    >
      {props.children}
    </div>
  )
}

function ActionButton(props: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      class="rounded-full border border-white/10 px-3 py-2 text-xs text-(--color-fg)"
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
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

function ShareScoreButton() {
  const { cumulativeScores, state, t, teamNames } = useGame()
  const [statusMessage, setStatusMessage] = createSignal('')

  const handleShare = async () => {
    const svgMarkup = createScoreSummarySvg({
      title: t('app.title'),
      subtitle: t('scoreboard.shareSubtitle'),
      roundsLabel: `${state.rounds.length} ${t('scoreboard.rounds')}`,
      northSouthLabel: teamNames()['north-south'],
      eastWestLabel: teamNames()['east-west'],
      northSouthScore: cumulativeScores()['north-south'],
      eastWestScore: cumulativeScores()['east-west'],
    })
    const file = new File([svgMarkup], 'tichuboard-score-summary.svg', { type: 'image/svg+xml' })

    if (
      typeof navigator !== 'undefined' &&
      'share' in navigator &&
      typeof navigator.share === 'function' &&
      'canShare' in navigator &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: t('app.title'),
        text: t('scoreboard.shareSubtitle'),
        files: [file],
      })
      setStatusMessage(t('scoreboard.shareReady'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const link = document.createElement('a')

    link.href = objectUrl
    link.download = file.name
    link.click()
    URL.revokeObjectURL(objectUrl)
    setStatusMessage(t('scoreboard.shareDownloaded'))
  }

  return (
    <div class="grid justify-items-end gap-2">
      <button
        type="button"
        class="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-xs text-(--color-fg)"
        data-testid="share-score-summary"
        onClick={() => void handleShare()}
      >
        {t('scoreboard.share')}
      </button>
      <Show when={statusMessage()}>
        <p class="text-[11px] text-(--color-muted)">{statusMessage()}</p>
      </Show>
    </div>
  )
}

function createScoreSummarySvg({
  title,
  subtitle,
  roundsLabel,
  northSouthLabel,
  eastWestLabel,
  northSouthScore,
  eastWestScore,
}: {
  title: string
  subtitle: string
  roundsLabel: string
  northSouthLabel: string
  eastWestLabel: string
  northSouthScore: number
  eastWestScore: number
}) {
  const escape = (value: string) =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escape(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12213d" />
      <stop offset="100%" stop-color="#0b1323" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" rx="32" fill="url(#bg)" />
  <rect x="48" y="48" width="1104" height="534" rx="32" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
  <text x="84" y="126" fill="#ffbf69" font-family="Space Grotesk, sans-serif" font-size="24" letter-spacing="4">TICHUBOARD</text>
  <text x="84" y="184" fill="#f5efe5" font-family="Space Grotesk, sans-serif" font-size="56" font-weight="700">${escape(subtitle)}</text>
  <text x="84" y="226" fill="#c5c0b5" font-family="Space Grotesk, sans-serif" font-size="24">${escape(roundsLabel)}</text>
  <rect x="84" y="292" width="486" height="214" rx="28" fill="rgba(255,191,105,0.12)" stroke="rgba(255,191,105,0.24)" />
  <rect x="630" y="292" width="486" height="214" rx="28" fill="rgba(125,211,252,0.12)" stroke="rgba(125,211,252,0.24)" />
  <text x="118" y="360" fill="#c5c0b5" font-family="Space Grotesk, sans-serif" font-size="22">${escape(northSouthLabel)}</text>
  <text x="118" y="446" fill="#f5efe5" font-family="Space Grotesk, sans-serif" font-size="92" font-weight="700">${northSouthScore}</text>
  <text x="664" y="360" fill="#c5c0b5" font-family="Space Grotesk, sans-serif" font-size="22">${escape(eastWestLabel)}</text>
  <text x="664" y="446" fill="#f5efe5" font-family="Space Grotesk, sans-serif" font-size="92" font-weight="700">${eastWestScore}</text>
</svg>`
}

function formatElapsedMs(value: number) {
  const totalSeconds = Math.max(0, Math.floor(value / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}
