import { For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { createDefaultTichuCalls } from '../../domain/defaults'
import { validateRoundInput } from '../../domain/scoring'
import type { Player, RoundInput, TeamId, TichuCall } from '../../domain/types'
import { useGame } from '../../state/game-context'

type RoundEntryProps = {
  editingRoundId: string | null
  onEditingRoundIdChange: (roundId: string | null) => void
}

type RoundDraft = {
  firstOutPlayerId: Player['id']
  doubleVictoryTeamId: TeamId | ''
  cardPointsNorthSouth: string
  cardPointsEastWest: string
  tichuCalls: Record<Player['id'], TichuCall>
}

export function RoundEntry(props: RoundEntryProps) {
  const { state, addRound, findRound, t, updateRound } = useGame()
  const [draft, setDraft] = createStore<RoundDraft>(createDraft(state.players))
  const [errors, setErrors] = createSignal<string[]>([])
  const [statusMessage, setStatusMessage] = createSignal('')
  const editingRound = createMemo(() =>
    props.editingRoundId ? findRound(props.editingRoundId) : undefined,
  )
  const editingRoundIndex = createMemo(() =>
    props.editingRoundId ? state.rounds.findIndex((round) => round.id === props.editingRoundId) : -1,
  )

  createEffect(() => {
    const currentRound = editingRound()

    if (!currentRound) {
      setDraft(replaceDraft(createDraft(state.players)))
      setErrors([])
      return
    }

    setDraft(replaceDraft(createDraftFromRound(currentRound.input)))
    setErrors([])
  })

  createEffect(() => {
    if (!state.players.some((player) => player.id === draft.firstOutPlayerId)) {
      setDraft('firstOutPlayerId', state.players[0]?.id ?? 'player-1')
    }
  })

  const submitLabel = () => (props.editingRoundId ? t('round.update') : t('round.save'))

  return (
    <section class="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {t('sections.round')}
          </p>
          <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{t('round.cardPointsHint')}</p>
        </div>
        <Show when={props.editingRoundId && editingRoundIndex() >= 0}>
          <span class="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
            {t('round.editing', { round: editingRoundIndex() + 1 })}
          </span>
        </Show>
      </div>

      <form
        class="mt-5 space-y-5"
        onSubmit={(event) => {
          event.preventDefault()

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

          setDraft(replaceDraft(createDraft(state.players)))
          setErrors([])
        }}
      >
        <div class="grid gap-3">
          <For each={state.players}>
            {(player) => (
              <article class="rounded-[1.5rem] border border-white/10 bg-[var(--color-surface)] p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-[var(--color-fg)]">{player.name}</p>
                    <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                      {t(`seats.${player.seat}`)}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="text-xs text-[var(--color-muted)]" for={`call-${player.id}`}>
                      {t('round.tichu')}
                    </label>
                    <select
                      id={`call-${player.id}`}
                      class="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)]"
                      value={draft.tichuCalls[player.id]}
                      onInput={(event) =>
                        setDraft('tichuCalls', player.id, event.currentTarget.value as TichuCall)
                      }
                    >
                      <option value="none">{t('round.noCall')}</option>
                      <option value="small">{t('round.small')}</option>
                      <option value="grand">{t('round.grand')}</option>
                    </select>
                  </div>
                </div>
                <label class="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[var(--color-fg)]">
                  <input
                    type="radio"
                    name="first-out-player"
                    checked={draft.firstOutPlayerId === player.id}
                    onChange={() => setDraft('firstOutPlayerId', player.id)}
                  />
                  <span>{t('round.firstOut')}</span>
                </label>
              </article>
            )}
          </For>
        </div>

        <div class="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[var(--color-surface)] p-4 sm:grid-cols-3">
          <label class="grid gap-2 text-sm">
            <span class="text-[var(--color-muted)]">{t('round.doubleVictory')}</span>
            <select
              class="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)]"
              value={draft.doubleVictoryTeamId}
              onInput={(event) =>
                setDraft('doubleVictoryTeamId', event.currentTarget.value as TeamId | '')
              }
            >
              <option value="">{t('round.noDoubleVictory')}</option>
              <option value="north-south">{t('teams.northSouth')}</option>
              <option value="east-west">{t('teams.eastWest')}</option>
            </select>
          </label>

          <label class="grid gap-2 text-sm">
            <span class="text-[var(--color-muted)]">{t('teams.northSouth')}</span>
            <input
              inputMode="numeric"
              type="number"
              min="0"
              max="100"
              disabled={Boolean(draft.doubleVictoryTeamId)}
              class="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-[var(--color-fg)] outline-none transition-opacity focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
              value={draft.cardPointsNorthSouth}
              onInput={(event) => setDraft('cardPointsNorthSouth', event.currentTarget.value)}
            />
          </label>

          <label class="grid gap-2 text-sm">
            <span class="text-[var(--color-muted)]">{t('teams.eastWest')}</span>
            <input
              inputMode="numeric"
              type="number"
              min="0"
              max="100"
              disabled={Boolean(draft.doubleVictoryTeamId)}
              class="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-[var(--color-fg)] outline-none transition-opacity focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
              value={draft.cardPointsEastWest}
              onInput={(event) => setDraft('cardPointsEastWest', event.currentTarget.value)}
            />
          </label>
        </div>

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

        <div class="sticky bottom-3 z-10 flex gap-3 rounded-[1.5rem] border border-white/10 bg-[color:color-mix(in_srgb,var(--color-bg)_78%,transparent)] p-3 backdrop-blur">
          <button
            type="submit"
            class="flex-1 rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-slate-950 transition-transform duration-150 motion-safe:hover:-translate-y-0.5"
          >
            {submitLabel()}
          </button>
          <Show when={props.editingRoundId}>
            <button
              type="button"
              class="rounded-2xl border border-white/12 px-4 py-3 text-sm text-[var(--color-fg)]"
              onClick={() => {
                props.onEditingRoundIdChange(null)
                setDraft(replaceDraft(createDraft(state.players)))
                setErrors([])
              }}
            >
              {t('round.cancel')}
            </button>
          </Show>
        </div>
      </form>
    </section>
  )
}

function createDraft(players: Player[]): RoundDraft {
  return {
    firstOutPlayerId: players[0]?.id ?? 'player-1',
    doubleVictoryTeamId: '',
    cardPointsNorthSouth: '50',
    cardPointsEastWest: '50',
    tichuCalls: createDefaultTichuCalls(),
  }
}

function createDraftFromRound(input: RoundInput): RoundDraft {
  return {
    firstOutPlayerId: input.firstOutPlayerId,
    doubleVictoryTeamId: input.doubleVictoryTeamId ?? '',
    cardPointsNorthSouth: input.cardPoints ? String(input.cardPoints['north-south']) : '50',
    cardPointsEastWest: input.cardPoints ? String(input.cardPoints['east-west']) : '50',
    tichuCalls: { ...input.tichuCalls },
  }
}

function replaceDraft(draft: RoundDraft) {
  return reconcile(draft)
}

function buildRoundInput(draft: RoundDraft): RoundInput {
  const doubleVictoryTeamId = draft.doubleVictoryTeamId || null

  return {
    firstOutPlayerId: draft.firstOutPlayerId,
    doubleVictoryTeamId,
    tichuCalls: { ...draft.tichuCalls },
    cardPoints: doubleVictoryTeamId
      ? null
      : {
          'north-south': Number(draft.cardPointsNorthSouth || 0),
          'east-west': Number(draft.cardPointsEastWest || 0),
        },
  }
}
