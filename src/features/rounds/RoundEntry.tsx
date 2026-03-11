import clsx from 'clsx'
import { For, Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { validateRoundInput } from '@/domain/scoring'
import { useGame } from '@/state/game-context'
import { RoundMetaFields } from './RoundMetaFields'
import { RoundPlayerList } from './RoundPlayerList'
import {
  buildRoundInput,
  createDraft,
  createDraftFromRound,
  formatElapsedMs,
  type RoundDraft,
} from './round-entry.shared'

type RoundEntryProps = {
  editingRoundId: string | null
  onEditingRoundIdChange: (roundId: string | null) => void
}

export function RoundEntry(props: RoundEntryProps) {
  const { addRound, cancelActiveRound, findRound, startRound, state, t, updateRound } = useGame()
  const [draft, setDraft] = createStore<RoundDraft>(createDraft(state.players))
  const [errors, setErrors] = createSignal<string[]>([])
  const [now, setNow] = createSignal(Date.now())
  const [statusMessage, setStatusMessage] = createSignal('')
  const editingRound = createMemo(() => (props.editingRoundId ? findRound(props.editingRoundId) : undefined))
  const editingRoundIndex = createMemo(() =>
    props.editingRoundId ? state.rounds.findIndex((round) => round.id === props.editingRoundId) : -1,
  )

  createEffect(() => {
    const currentRound = editingRound()

    if (!currentRound) {
      setDraft(reconcile(createDraft(state.players)))
      setErrors([])
      return
    }

    setDraft(reconcile(createDraftFromRound(currentRound.input)))
    setErrors([])
  })

  createEffect(() => {
    if (!state.players.some((player) => player.id === draft.firstOutPlayerId)) {
      setDraft('firstOutPlayerId', state.players[0]?.id ?? 'player-1')
    }
  })

  const timer = window.setInterval(() => setNow(Date.now()), 1000)
  onCleanup(() => window.clearInterval(timer))

  const activeRoundElapsed = createMemo(() =>
    state.activeRoundStartedAt ? formatElapsedMs(now() - new Date(state.activeRoundStartedAt).getTime()) : null,
  )
  const lastRoundElapsed = createMemo(() => {
    const lastRound = state.rounds.at(-1)
    return lastRound ? formatElapsedMs(lastRound.timing.elapsedMs) : null
  })
  const submitLabel = () => (props.editingRoundId ? t('round.update') : t('round.save'))
  const shouldShowForm = () => Boolean(props.editingRoundId || state.activeRoundStartedAt)

  const resetDraft = () => setDraft(reconcile(createDraft(state.players)))

  const submitRound = () => {
    const input = buildRoundInput(draft)
    const validation = validateRoundInput(state.players, input)

    if (!validation.ok) {
      setErrors(validation.errors.map((error) => error.message))
      setStatusMessage('')
      return
    }

    if (props.editingRoundId) {
      updateRound(props.editingRoundId, input)
      props.onEditingRoundIdChange(null)
      setStatusMessage(t('actions.updateSuccess'))
    } else {
      addRound(input)
      setStatusMessage(t('actions.saveSuccess'))
    }

    resetDraft()
    setErrors([])
  }

  const cancelRound = () => {
    if (props.editingRoundId) {
      props.onEditingRoundIdChange(null)
      resetDraft()
    }

    setErrors([])
    cancelActiveRound()
  }

  return (
    <section class="rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">{t('sections.round')}</p>
          <p class="mt-2 text-sm leading-6 text-(--color-muted)">{t('round.cardPointsHint')}</p>
        </div>
        <Show when={props.editingRoundId && editingRoundIndex() >= 0}>
          <span class="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
            {t('round.editing', { round: editingRoundIndex() + 1 })}
          </span>
        </Show>
      </div>

      <Show when={!shouldShowForm()}>
        <div class="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-(--color-surface) p-4">
          <p class="text-sm leading-6 text-(--color-muted)">
            {state.rounds.length > 0 ? t('round.nextRoundPrompt') : t('round.firstRoundPrompt')}
          </p>
          <Show when={lastRoundElapsed()}>
            <p class="text-sm text-(--color-muted)">{t('round.previousElapsed', { elapsed: lastRoundElapsed()! })}</p>
          </Show>
          <button
            type="button"
            class="inline-flex min-h-12 items-center justify-center rounded-2xl bg-(--color-accent) px-4 text-sm font-semibold text-slate-950"
            onClick={() => {
              startRound()
              setStatusMessage('')
            }}
          >
            {state.rounds.length > 0 ? t('round.startNext') : t('round.startFirst')}
          </button>
        </div>
      </Show>

      <Show when={shouldShowForm()}>
        <div class="mt-5 flex flex-wrap items-center gap-2">
          <Show when={state.activeRoundStartedAt && !props.editingRoundId}>
            <span class="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-50">
              {t('round.timelapseRunning', { elapsed: activeRoundElapsed() ?? '00:00' })}
            </span>
          </Show>
          <Show when={lastRoundElapsed() && !props.editingRoundId && state.rounds.length > 0}>
            <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-(--color-muted)">
              {t('round.previousElapsedShort', { elapsed: lastRoundElapsed()! })}
            </span>
          </Show>
        </div>
      </Show>

      <Show when={shouldShowForm()}>
        <form
          class="mt-5 space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            submitRound()
          }}
        >
          <RoundPlayerList
            players={state.players}
            draft={draft}
            t={t}
            onTichuCallChange={(playerId, value) => setDraft('tichuCalls', playerId, value)}
            onFirstOutChange={(playerId) => setDraft('firstOutPlayerId', playerId)}
          />

          <RoundMetaFields
            draft={draft}
            t={t}
            onDoubleVictoryChange={(teamId) => setDraft('doubleVictoryTeamId', teamId)}
            onCardPointsNorthSouthChange={(value) => setDraft('cardPointsNorthSouth', value)}
            onCardPointsEastWestChange={(value) => setDraft('cardPointsEastWest', value)}
          />

          <Show when={errors().length > 0}>
            <div class="rounded-[1.25rem] border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              <ul class="space-y-1">
                <For each={errors()}>{(error) => <li>{error}</li>}</For>
              </ul>
            </div>
          </Show>

          <Show when={statusMessage()}>
            <div class="rounded-[1.25rem] border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-50">
              {statusMessage()}
            </div>
          </Show>

          <div class="sticky bottom-3 z-10 flex gap-3 rounded-3xl border border-white/10 bg-[color-mix(in_srgb,var(--color-bg)_78%,transparent)] p-3 backdrop-blur">
            <button
              type="submit"
              class={clsx(
                'flex-1 rounded-2xl bg-(--color-accent) px-4 py-3',
                'text-sm font-semibold text-slate-950',
                'transition-transform duration-150 motion-safe:hover:-translate-y-0.5',
              )}
              data-testid="save-round"
            >
              {submitLabel()}
            </button>
            <button
              type="button"
              class="rounded-2xl border border-white/12 px-4 py-3 text-sm text-(--color-fg)"
              onClick={cancelRound}
            >
              {t('round.cancel')}
            </button>
          </div>
        </form>
      </Show>
    </section>
  )
}
