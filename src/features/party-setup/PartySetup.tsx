import clsx from 'clsx'
import { For, Show, createMemo, createSignal } from 'solid-js'
import { getRandomPlayerName } from '@/domain/defaults'
import type { Language, Player, PlayerId, Seat, TeamColor, TeamId } from '@/domain/types'
import { useGame } from '@/state/game-context'

const teamColorClasses: Record<TeamColor, { chip: string; ring: string; surface: string; glow: string }> = {
  amber: {
    chip: 'bg-amber-300 text-amber-950',
    ring: 'ring-amber-300/55',
    surface: 'from-amber-300/18 to-amber-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(252,211,77,0.24),0_18px_50px_rgba(252,211,77,0.14)]',
  },
  emerald: {
    chip: 'bg-emerald-300 text-emerald-950',
    ring: 'ring-emerald-300/55',
    surface: 'from-emerald-300/18 to-emerald-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(110,231,183,0.24),0_18px_50px_rgba(110,231,183,0.14)]',
  },
  sky: {
    chip: 'bg-sky-300 text-sky-950',
    ring: 'ring-sky-300/55',
    surface: 'from-sky-300/18 to-sky-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(125,211,252,0.24),0_18px_50px_rgba(125,211,252,0.14)]',
  },
  rose: {
    chip: 'bg-rose-300 text-rose-950',
    ring: 'ring-rose-300/55',
    surface: 'from-rose-300/18 to-rose-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(253,164,175,0.24),0_18px_50px_rgba(253,164,175,0.14)]',
  },
}

const teamColorOptions: TeamColor[] = ['amber', 'sky', 'emerald', 'rose']

const seatLayouts: { seat: Seat; className: string }[] = [
  { seat: 'north', className: 'col-start-2 row-start-1' },
  { seat: 'west', className: 'col-start-1 row-start-2' },
  { seat: 'east', className: 'col-start-3 row-start-2' },
  { seat: 'south', className: 'col-start-2 row-start-3' },
]

type EditorDraft = {
  playerId: PlayerId
  name: string
}

export function PartySetup() {
  const { setTeamColor, state, swapPlayerSeats, teamNames, updatePlayerName, t } = useGame()
  const [draggingPlayerId, setDraggingPlayerId] = createSignal<PlayerId | null>(null)
  const [draggingRecentName, setDraggingRecentName] = createSignal<string | null>(null)
  const [editorDraft, setEditorDraft] = createSignal<EditorDraft | null>(null)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [seatMoveSourceId, setSeatMoveSourceId] = createSignal<PlayerId | null>(null)
  const [pendingRecentName, setPendingRecentName] = createSignal<string | null>(null)

  const playersBySeat = createMemo(() =>
    seatLayouts
      .map(({ seat, className }) => {
        const player = state.players.find((item) => item.seat === seat)

        return player ? { player, className } : null
      })
      .filter((item): item is { player: Player; className: string } => Boolean(item)),
  )

  const activePlayer = createMemo(() => {
    const draft = editorDraft()
    return draft ? state.players.find((player) => player.id === draft.playerId) ?? null : null
  })

  const movingPlayer = createMemo(() => {
    const playerId = seatMoveSourceId()
    return playerId ? state.players.find((player) => player.id === playerId) ?? null : null
  })

  const recentNames = createMemo(() => {
    const seatedNames = new Set(state.players.map((player) => player.name.trim().toLowerCase()))

    return state.recentPlayerNames
      .filter((name) => !seatedNames.has(name.trim().toLowerCase()))
      .slice(0, 5)
  })

  const interactionHint = createMemo(() => {
    if (pendingRecentName()) {
      return t('party.pendingRecentName', { name: pendingRecentName()! })
    }

    if (movingPlayer()) {
      return t('party.pendingSeatMove', { name: movingPlayer()!.name })
    }

    return ''
  })

  const openEditor = (player: Player) => {
    setEditorDraft({
      playerId: player.id,
      name: player.name,
    })
    setSeatMoveSourceId(null)
    setPendingRecentName(null)
    setErrorMessage('')
  }

  const closeEditor = () => {
    setEditorDraft(null)
    setErrorMessage('')
  }

  const applyNameToSeat = (playerId: PlayerId, nextName: string) => {
    const trimmedName = nextName.trim()

    if (!trimmedName) {
      setErrorMessage(t('party.validationEmptyName'))
      return false
    }

    const hasDuplicate = state.players.some(
      (player) => player.id !== playerId && player.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    )

    if (hasDuplicate) {
      setErrorMessage(t('party.validationDuplicateName'))
      return false
    }

    updatePlayerName(playerId, trimmedName)
    setErrorMessage('')
    return true
  }

  const handleSeatAction = (player: Player) => {
    if (pendingRecentName()) {
      const nextName = pendingRecentName()!

      if (applyNameToSeat(player.id, nextName)) {
        setPendingRecentName(null)
      }

      return
    }

    if (seatMoveSourceId()) {
      if (seatMoveSourceId() !== player.id) {
        swapPlayerSeats(seatMoveSourceId()!, player.id)
      }

      setSeatMoveSourceId(null)
      return
    }

    openEditor(player)
  }

  const handleSeatDrop = (targetPlayerId: PlayerId) => {
    const sourcePlayerId = draggingPlayerId()
    const recentName = draggingRecentName()

    if (sourcePlayerId && sourcePlayerId !== targetPlayerId) {
      swapPlayerSeats(sourcePlayerId, targetPlayerId)
    }

    if (recentName) {
      applyNameToSeat(targetPlayerId, recentName)
    }

    setDraggingPlayerId(null)
    setDraggingRecentName(null)
  }

  const applyRecentName = (name: string) => {
    const draft = editorDraft()

    if (draft) {
      setEditorDraft({ ...draft, name })
      setErrorMessage('')
      return
    }

    setPendingRecentName(name)
    setSeatMoveSourceId(null)
  }

  const commitEditor = () => {
    const draft = editorDraft()

    if (!draft) {
      return
    }

    if (!applyNameToSeat(draft.playerId, draft.name)) {
      return
    }

    closeEditor()
  }

  return (
    <section class="grid gap-4 rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5">
      <div class="grid gap-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">
              {t('sections.party')}
            </p>
            <p class="mt-2 text-xs leading-5 text-(--color-muted) sm:text-sm">{t('party.hintCompact')}</p>
          </div>
          <Show when={interactionHint()}>
            <span class="inline-flex max-w-40 rounded-full border border-white/10 bg-black/18 px-3 py-1 text-[11px] leading-5 text-(--color-fg)">
              {interactionHint()}
            </span>
          </Show>
        </div>

        <Show when={recentNames().length > 0}>
          <div class="grid gap-2 rounded-3xl border border-white/10 bg-black/12 p-3">
            <div class="flex items-center justify-between gap-2">
              <p class="text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">
                {t('party.recentPlayers')}
              </p>
              <p class="text-[11px] text-(--color-muted)">{t('party.recentPlayersHint')}</p>
            </div>
            <div class="flex snap-x gap-2 overflow-x-auto pb-1">
              <For each={recentNames()}>
                {(name) => (
                  <button
                    type="button"
                    class={clsx(
                      'shrink-0 snap-start rounded-full border px-3 py-2 text-sm transition-colors',
                      pendingRecentName() === name
                        ? 'border-(--color-accent) bg-(--color-accent) text-slate-950'
                        : 'border-white/10 bg-black/15 text-(--color-fg)',
                    )}
                    draggable="true"
                    onClick={() => applyRecentName(name)}
                    onDragStart={() => setDraggingRecentName(name)}
                    onDragEnd={() => setDraggingRecentName(null)}
                  >
                    {name}
                  </button>
                )}
              </For>
            </div>
          </div>
        </Show>

        <div class="grid gap-2 sm:grid-cols-2">
          <TeamColorPicker
            teamId="north-south"
            label={teamNames()['north-south']}
            subtitle={t('teams.northSouth')}
            selectedColor={state.settings.teamColors['north-south']}
            onSelect={setTeamColor}
          />
          <TeamColorPicker
            teamId="east-west"
            label={teamNames()['east-west']}
            subtitle={t('teams.eastWest')}
            selectedColor={state.settings.teamColors['east-west']}
            onSelect={setTeamColor}
          />
        </div>
      </div>

      <div
        class="grid min-h-96 grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] grid-rows-[auto_minmax(6.5rem,1fr)_auto] gap-3"
        aria-label={t('party.tableLabel')}
      >
        <div class="col-start-2 row-start-2 flex items-center justify-center">
          <div class="flex h-full min-h-36 w-full items-center justify-center rounded-[2.4rem] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(255,191,105,0.24),rgba(15,23,42,0.92))] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div class="grid gap-3">
              <p class="text-[10px] uppercase tracking-[0.26em] text-(--color-accent)">
                {t('party.tableCenter')}
              </p>
              <TeamPill teamId="north-south" label={teamNames()['north-south']} subtitle={t('teams.northSouth')} />
              <TeamPill teamId="east-west" label={teamNames()['east-west']} subtitle={t('teams.eastWest')} />
            </div>
          </div>
        </div>

        <For each={playersBySeat()}>
          {(entry) => {
            const teamId = getTeamId(entry.player.seat)
            const colors = teamColorClasses[state.settings.teamColors[teamId]]
            const isMovingSource = seatMoveSourceId() === entry.player.id
            const isRecentTarget = Boolean(pendingRecentName())

            return (
              <button
                type="button"
                class={clsx(
                  entry.className,
                  'relative flex min-h-24 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-(--color-surface) p-3 text-left',
                  'ring-1 transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5',
                  colors.ring,
                  colors.glow,
                  isMovingSource && 'scale-[1.02] border-(--color-accent) ring-(--color-accent)',
                  isRecentTarget && 'border-dashed',
                )}
                draggable="true"
                aria-label={t('party.seatAction', {
                  seat: t(`seats.${entry.player.seat}`),
                  name: entry.player.name,
                })}
                onClick={() => handleSeatAction(entry.player)}
                onDragStart={() => setDraggingPlayerId(entry.player.id)}
                onDragEnd={() => setDraggingPlayerId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleSeatDrop(entry.player.id)}
                data-testid={`seat-${entry.player.seat}`}
              >
                <div
                  class={clsx(
                    'pointer-events-none absolute inset-0 bg-linear-to-br opacity-70',
                    colors.surface,
                  )}
                />
                <div class="relative flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <TeamBadge teamId={teamId} />
                    <span class="text-[11px] uppercase tracking-[0.24em] text-(--color-muted)">
                      {t(`seats.${entry.player.seat}`)}
                    </span>
                  </div>
                  <span class="rounded-full border border-white/10 bg-black/15 px-2 py-1 text-[10px] text-(--color-muted)">
                    {t(`teams.${teamId === 'north-south' ? 'northSouth' : 'eastWest'}`)}
                  </span>
                </div>

                <div class="relative">
                  <p class="text-base font-semibold text-(--color-fg)">{entry.player.name}</p>
                  <p class="mt-1 text-[11px] text-(--color-muted)">
                    {isMovingSource ? t('party.tapTargetSeat') : t('party.tapToEdit')}
                  </p>
                </div>
              </button>
            )
          }}
        </For>
      </div>

      <Show when={editorDraft() && activePlayer()}>
        <div class="fixed inset-0 z-40 flex items-end bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
          <button
            type="button"
            class="absolute inset-0"
            aria-label={t('party.closeEditor')}
            onClick={closeEditor}
          />

          <div class="relative z-10 w-full max-w-md rounded-4xl border border-white/10 bg-(--color-surface) p-5 shadow-[0_28px_90px_rgba(0,0,0,0.3)]">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">
                  {t('party.editorTitle')}
                </p>
                <p class="mt-2 text-sm text-(--color-muted)">
                  {t('party.editorSubtitle', {
                    seat: t(`seats.${activePlayer()!.seat}`),
                  })}
                </p>
              </div>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/15 text-(--color-fg)"
                aria-label={t('party.closeEditor')}
                onClick={closeEditor}
              >
                ×
              </button>
            </div>

            <div class="mt-5 grid gap-4">
              <label class="grid gap-2 text-sm">
                <span class="text-(--color-muted)">{t('party.nameField')}</span>
                <input
                  class="w-full rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-(--color-fg) outline-none placeholder:text-(--color-muted) focus:border-(--color-accent)"
                  value={editorDraft()!.name}
                  onInput={(event) =>
                    setEditorDraft((current) =>
                      current ? { ...current, name: event.currentTarget.value } : current,
                    )
                  }
                />
              </label>

              <div class="grid gap-2">
                <span class="text-sm text-(--color-muted)">{t('party.quickActions')}</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-sm text-(--color-fg)"
                    onClick={() =>
                      setEditorDraft((current) =>
                        current
                          ? {
                              ...current,
                              name: getUniqueRandomName(state.players, state.settings.language, current),
                            }
                          : current,
                      )
                    }
                  >
                    {t('party.rerollName')}
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-sm text-(--color-fg)"
                    onClick={() => {
                      setSeatMoveSourceId(activePlayer()!.id)
                      closeEditor()
                    }}
                  >
                    {t('party.moveSeat')}
                  </button>
                  <For each={recentNames()}>
                    {(name) => (
                      <button
                        type="button"
                        class="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-sm text-(--color-fg)"
                        onClick={() => applyRecentName(name)}
                      >
                        {name}
                      </button>
                    )}
                  </For>
                </div>
              </div>

              <Show when={errorMessage()}>
                <p class="rounded-2xl border border-rose-300/35 bg-rose-300/10 px-4 py-3 text-sm text-rose-50">
                  {errorMessage()}
                </p>
              </Show>

              <div class="flex gap-3">
                <button
                  type="button"
                  class="flex-1 rounded-2xl bg-(--color-accent) px-4 py-3 text-sm font-semibold text-slate-950"
                  onClick={commitEditor}
                >
                  {t('party.applyChanges')}
                </button>
                <button
                  type="button"
                  class="rounded-2xl border border-white/10 px-4 py-3 text-sm text-(--color-fg)"
                  onClick={closeEditor}
                >
                  {t('round.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </section>
  )
}

function getTeamId(seat: Seat): TeamId {
  return seat === 'north' || seat === 'south' ? 'north-south' : 'east-west'
}

function TeamBadge(props: { teamId: TeamId }) {
  const { state } = useGame()

  return (
    <span
      class={clsx('h-3 w-3 rounded-full', teamColorClasses[state.settings.teamColors[props.teamId]].chip)}
    />
  )
}

function TeamPill(props: { teamId: TeamId; label: string; subtitle: string }) {
  const { state } = useGame()

  return (
    <div
      class={clsx(
        'rounded-3xl border border-white/10 px-3 py-2 text-left',
        teamColorClasses[state.settings.teamColors[props.teamId]].surface,
      )}
      data-testid={`team-name-${props.teamId}`}
    >
      <div class="flex items-center gap-2">
        <TeamBadge teamId={props.teamId} />
        <div>
          <p class="text-sm font-semibold text-(--color-fg)">{props.label}</p>
          <p class="text-[11px] text-(--color-muted)">{props.subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function TeamColorPicker(props: {
  teamId: TeamId
  label: string
  subtitle: string
  selectedColor: TeamColor
  onSelect: (teamId: TeamId, color: TeamColor) => void
}) {
  return (
    <div class="rounded-3xl border border-white/10 bg-black/10 p-3">
      <p class="text-sm font-medium text-(--color-fg)">{props.label}</p>
      <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">{props.subtitle}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <For each={teamColorOptions}>
          {(color) => (
            <button
              type="button"
              class={clsx(
                'h-8 w-8 rounded-full border-2 transition-transform motion-safe:hover:scale-105',
                teamColorClasses[color].chip,
                props.selectedColor === color ? 'border-white' : 'border-transparent',
              )}
              aria-label={`${props.label} ${color}`}
              aria-pressed={props.selectedColor === color}
              data-testid={`team-color-${props.teamId}-${color}`}
              onClick={() => props.onSelect(props.teamId, color)}
            />
          )}
        </For>
      </div>
    </div>
  )
}

function getUniqueRandomName(players: Player[], language: Language, draft: EditorDraft) {
  let nextName = getRandomPlayerName(language, draft.name)
  let attempts = 0

  while (
    players.some(
      (player) => player.id !== draft.playerId && player.name.trim().toLowerCase() === nextName.toLowerCase(),
    ) &&
    attempts < 12
  ) {
    nextName = getRandomPlayerName(language, nextName)
    attempts += 1
  }

  return nextName
}
