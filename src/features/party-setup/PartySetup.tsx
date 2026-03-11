import clsx from 'clsx'
import { For, Show, createMemo, createSignal, type ParentProps } from 'solid-js'
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
  violet: {
    chip: 'bg-violet-300 text-violet-950',
    ring: 'ring-violet-300/55',
    surface: 'from-violet-300/18 to-violet-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(196,181,253,0.24),0_18px_50px_rgba(196,181,253,0.14)]',
  },
  teal: {
    chip: 'bg-teal-300 text-teal-950',
    ring: 'ring-teal-300/55',
    surface: 'from-teal-300/18 to-teal-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(94,234,212,0.24),0_18px_50px_rgba(94,234,212,0.14)]',
  },
  orange: {
    chip: 'bg-orange-300 text-orange-950',
    ring: 'ring-orange-300/55',
    surface: 'from-orange-300/18 to-orange-100/4',
    glow: 'shadow-[0_0_0_1px_rgba(253,186,116,0.24),0_18px_50px_rgba(253,186,116,0.14)]',
  },
}

const teamColorOptions: TeamColor[] = ['amber', 'sky', 'emerald', 'rose', 'violet', 'teal', 'orange']

const seatLayouts: { seat: Seat; className: string }[] = [
  { seat: 'north', className: 'col-start-2 row-start-1' },
  { seat: 'west', className: 'col-start-1 row-start-2' },
  { seat: 'east', className: 'col-start-3 row-start-2' },
  { seat: 'south', className: 'col-start-2 row-start-3' },
]

const seatOverlayLabels: Record<Seat, string> = {
  north: 'N',
  west: 'W',
  east: 'E',
  south: 'S',
}

type EditorDraft = {
  playerId: PlayerId
  name: string
}

type TeamEditorDraft = {
  teamId: TeamId
  name: string
  color: TeamColor
}

export function PartySetup() {
  const { assignPlayerSeat, setTeamColor, setTeamName, state, teamLineups, teamNames, updatePlayerName, t } = useGame()
  const [editorDraft, setEditorDraft] = createSignal<EditorDraft | null>(null)
  const [teamEditorDraft, setTeamEditorDraft] = createSignal<TeamEditorDraft | null>(null)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [armedPlayerId, setArmedPlayerId] = createSignal<PlayerId | null>(null)
  const [draggingPlayerId, setDraggingPlayerId] = createSignal<PlayerId | null>(null)
  const [armedRecentName, setArmedRecentName] = createSignal<string | null>(null)
  const [draggingRecentName, setDraggingRecentName] = createSignal<string | null>(null)

  const playersBySeat = createMemo(() =>
    seatLayouts.map(({ seat, className }) => ({
      seat,
      className,
      player: state.players.find((item) => item.seat === seat) ?? null,
    })),
  )

  const activePlayer = createMemo(() => {
    const draft = editorDraft()
    return draft ? state.players.find((player) => player.id === draft.playerId) ?? null : null
  })

  const activeTeamEditor = createMemo(() => teamEditorDraft())

  const rosterPlayers = createMemo(() =>
    state.players.map((player) => ({
      ...player,
      teamId: getTeamId(player.seat),
    })),
  )

  const recentNames = createMemo(() => {
    const seatedNames = new Set(state.players.map((player) => player.name.trim().toLowerCase()))

    return state.recentPlayerNames
      .filter((name) => !seatedNames.has(name.trim().toLowerCase()))
      .slice(0, 2)
  })

  const interactionHint = createMemo(() => {
    if (armedRecentName()) {
      return t('party.pendingRecentName', { name: armedRecentName()! })
    }

    if (armedPlayerId()) {
      const player = state.players.find((item) => item.id === armedPlayerId())
      return player ? t('party.pendingSeatMove', { name: player.name }) : ''
    }

    return ''
  })

  const openEditor = (player: Player) => {
    setEditorDraft({
      playerId: player.id,
      name: player.name,
    })
    setErrorMessage('')
  }

  const closeEditor = () => {
    setEditorDraft(null)
    setErrorMessage('')
  }

  const openTeamEditor = (teamId: TeamId) => {
    setTeamEditorDraft({
      teamId,
      name: teamNames()[teamId],
      color: state.settings.teamColors[teamId],
    })
  }

  const closeTeamEditor = () => {
    setTeamEditorDraft(null)
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

  const clearArmedState = () => {
    setArmedPlayerId(null)
    setDraggingPlayerId(null)
    setArmedRecentName(null)
    setDraggingRecentName(null)
  }

  const handleSeatAssign = (seat: Seat) => {
    const seatPlayer = state.players.find((player) => player.seat === seat)

    if (!seatPlayer) {
      return
    }

    if (draggingRecentName() || armedRecentName()) {
      const nextName = draggingRecentName() ?? armedRecentName()

      if (nextName && applyNameToSeat(seatPlayer.id, nextName)) {
        clearArmedState()
      }

      return
    }

    if (draggingPlayerId() || armedPlayerId()) {
      const sourcePlayerId = draggingPlayerId() ?? armedPlayerId()

      if (sourcePlayerId) {
        assignPlayerSeat(sourcePlayerId, seat)
        clearArmedState()
      }

      return
    }

    openEditor(seatPlayer)
  }

  const applyRecentName = (name: string) => {
    const draft = editorDraft()

    if (draft) {
      setEditorDraft({ ...draft, name })
      setErrorMessage('')
      return
    }

    setArmedRecentName(name)
    setArmedPlayerId(null)
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

  const commitTeamEditor = () => {
    const draft = teamEditorDraft()

    if (!draft) {
      return
    }

    setTeamName(draft.teamId, draft.name)
    setTeamColor(draft.teamId, draft.color)
    closeTeamEditor()
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

        <div class="grid gap-2 sm:grid-cols-2">
          <TeamSetupCard
            teamId="north-south"
            label={() => teamNames()['north-south']}
            subtitle={() => teamLineups()['north-south']}
            selectedColor={() => state.settings.teamColors['north-south']}
            oppositeColor={() => state.settings.teamColors['east-west']}
            onOpenEditor={openTeamEditor}
          />
          <TeamSetupCard
            teamId="east-west"
            label={() => teamNames()['east-west']}
            subtitle={() => teamLineups()['east-west']}
            selectedColor={() => state.settings.teamColors['east-west']}
            oppositeColor={() => state.settings.teamColors['north-south']}
            onOpenEditor={openTeamEditor}
          />
        </div>
      </div>

      <section class="grid gap-3 rounded-4xl border border-white/10 bg-black/12 p-3">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.22em] text-(--color-accent)">{t('party.playerBench')}</p>
            <p class="mt-1 text-[11px] text-(--color-muted)">{t('party.playerBenchHint')}</p>
          </div>
          <Show when={armedPlayerId() || armedRecentName()}>
            <button
              type="button"
              class="rounded-full border border-white/10 px-3 py-1 text-[11px] text-(--color-fg)"
              onClick={clearArmedState}
            >
              {t('party.clearSelection')}
            </button>
          </Show>
        </div>

        <div class="grid gap-2">
          <div class="flex flex-wrap gap-2">
            <For each={rosterPlayers()}>
              {(player) => (
                <button
                  type="button"
                  class={clsx(
                    'inline-flex min-h-12 items-center gap-2 rounded-full border px-3 py-2 text-left text-sm transition-transform',
                    armedPlayerId() === player.id
                      ? 'border-(--color-accent) bg-(--color-accent) text-slate-950'
                      : 'border-white/10 bg-(--color-surface) text-(--color-fg) motion-safe:hover:-translate-y-0.5',
                  )}
                  draggable="true"
                  data-testid={`bench-player-${player.id}`}
                  onClick={() => {
                    setArmedPlayerId(player.id)
                    setArmedRecentName(null)
                  }}
                  onDragStart={() => {
                    setDraggingPlayerId(player.id)
                    setArmedRecentName(null)
                  }}
                  onDragEnd={() => setDraggingPlayerId(null)}
                >
                  <span
                    class={clsx(
                      'inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold',
                      teamColorClasses[state.settings.teamColors[player.teamId]].chip,
                    )}
                  >
                    {t(`seats.${player.seat}`).slice(0, 1)}
                  </span>
                  <span class="font-medium">{player.name}</span>
                </button>
              )}
            </For>
          </div>

          <Show when={recentNames().length > 0}>
            <div class="flex flex-wrap gap-2 border-t border-white/8 pt-2">
              <For each={recentNames()}>
                {(name) => (
                  <button
                    type="button"
                    class={clsx(
                      'rounded-full border px-3 py-2 text-sm transition-colors opacity-55 grayscale',
                      armedRecentName() === name
                        ? 'border-(--color-accent) bg-(--color-accent) text-slate-950 opacity-100 grayscale-0'
                        : 'border-white/10 bg-black/15 text-(--color-fg)',
                    )}
                    draggable="true"
                    data-testid={`bench-recent-${name}`}
                    onClick={() => applyRecentName(name)}
                    onDragStart={() => {
                      setDraggingRecentName(name)
                      setArmedPlayerId(null)
                    }}
                    onDragEnd={() => setDraggingRecentName(null)}
                  >
                    {name}
                  </button>
                )}
              </For>
            </div>
          </Show>
        </div>
      </section>

      <div
        class="grid min-h-96 grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] grid-rows-[auto_minmax(6rem,1fr)_auto] gap-3"
        aria-label={t('party.tableLabel')}
      >
        <div class="col-start-2 row-start-2 flex items-center justify-center">
          <div class="flex h-full w-full items-center justify-center rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,191,105,0.18),rgba(15,23,42,0.94))] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div class="grid place-items-center gap-2">
              <div class="h-12 w-12 rounded-full border border-white/12 bg-black/18 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]" />
              <p class="text-[10px] uppercase tracking-[0.3em] text-(--color-muted)">Tichu</p>
            </div>
          </div>
        </div>

        <For each={playersBySeat()}>
          {(entry) => {
            const player = entry.player
            const teamId = player ? getTeamId(player.seat) : getTeamId(entry.seat)
            const colors = teamColorClasses[state.settings.teamColors[teamId]]
            const isActiveDropTarget = Boolean(armedPlayerId() || draggingPlayerId() || armedRecentName() || draggingRecentName())

            return (
              <button
                type="button"
                class={clsx(
                  entry.className,
                  'relative flex min-h-28 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-(--color-surface) p-3 text-left',
                  'ring-1 transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5',
                  colors.ring,
                  colors.glow,
                  isActiveDropTarget && 'border-dashed border-(--color-accent)',
                )}
                aria-label={t('party.seatAction', {
                  seat: t(`seats.${entry.seat}`),
                  name: player?.name ?? '',
                })}
                onClick={() => handleSeatAssign(entry.seat)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleSeatAssign(entry.seat)}
                data-testid={`seat-${entry.seat}`}
              >
                <div
                  class={clsx(
                    'pointer-events-none absolute inset-0 bg-linear-to-br opacity-70',
                    colors.surface,
                  )}
                />
                <span
                  class="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(3.5rem,20vw,5.25rem)] font-black tracking-[-0.08em] text-white/6"
                  aria-hidden="true"
                  data-testid={`seat-overlay-${entry.seat}`}
                >
                  {seatOverlayLabels[entry.seat]}
                </span>
                <div class="relative flex items-start justify-between gap-2">
                  <span class="rounded-full border border-white/10 bg-black/18 px-2 py-1 text-[10px] uppercase tracking-[0.26em] text-(--color-muted)">
                    {seatOverlayLabels[entry.seat]}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/18 px-2 py-1 text-[10px] text-(--color-muted)">
                    <TeamBadge teamId={teamId} />
                    {teamId === 'north-south' ? teamNames()['north-south'] : teamNames()['east-west']}
                  </span>
                </div>

                <div class="relative grid gap-1">
                  <p class="text-lg font-semibold tracking-[-0.02em] text-(--color-fg)">{player?.name}</p>
                  <p class="text-[11px] text-(--color-muted)">
                    {isActiveDropTarget ? t('party.dropToSeat') : t(`seats.${entry.seat}`)}
                  </p>
                </div>
              </button>
            )
          }}
        </For>
      </div>

      <Show when={editorDraft() && activePlayer()}>
        <DialogShell closeLabel={t('party.closeEditor')} onClose={closeEditor} testId="party-editor-dialog">
          <div class="flex-1 overflow-y-auto px-5 pb-6 pt-6 sm:p-5">
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
                  class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-(--color-fg)"
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
                    class="w-full rounded-2xl border border-white/14 bg-slate-950/85 px-4 py-3 text-(--color-fg) outline-none placeholder:text-(--color-muted) focus:border-(--color-accent)"
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
                      class="rounded-full border border-white/12 bg-slate-950/85 px-3 py-2 text-sm text-(--color-fg)"
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
                      class="rounded-full border border-white/12 bg-slate-950/85 px-3 py-2 text-sm text-(--color-fg)"
                      onClick={() => {
                        setArmedPlayerId(activePlayer()!.id)
                        setArmedRecentName(null)
                        closeEditor()
                      }}
                    >
                      {t('party.moveSeat')}
                    </button>
                    <For each={recentNames()}>
                      {(name) => (
                        <button
                          type="button"
                          class="rounded-full border border-dashed border-white/14 bg-slate-950/80 px-3 py-2 text-sm text-(--color-fg) opacity-70"
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
              </div>
          </div>

          <DialogActions
            primaryLabel={t('party.applyChanges')}
            secondaryLabel={t('round.cancel')}
            onPrimary={commitEditor}
            onSecondary={closeEditor}
          />
        </DialogShell>
      </Show>

      <Show when={activeTeamEditor()}>
        <DialogShell closeLabel={t('party.closeTeamEditor')} onClose={closeTeamEditor} testId="team-editor-dialog">
          <div class="flex-1 overflow-y-auto px-5 pb-6 pt-6 sm:p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">
                  {t('party.teamEditorTitle')}
                </p>
                <p class="mt-2 text-sm text-(--color-muted)">
                  {t('party.teamEditorSubtitle', {
                    team: activeTeamEditor()!.teamId === 'north-south' ? '1' : '2',
                  })}
                </p>
              </div>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-(--color-fg)"
                aria-label={t('party.closeTeamEditor')}
                onClick={closeTeamEditor}
              >
                ×
              </button>
            </div>

            <div class="mt-5 grid gap-5">
              <label class="grid gap-2 text-sm">
                <span class="text-(--color-muted)">{t('party.teamNameField')}</span>
                <input
                  class="w-full rounded-2xl border border-white/14 bg-slate-950/85 px-4 py-3 text-(--color-fg) outline-none placeholder:text-(--color-muted) focus:border-(--color-accent)"
                  value={activeTeamEditor()!.name}
                  onInput={(event) =>
                    setTeamEditorDraft((current) =>
                      current ? { ...current, name: event.currentTarget.value } : current,
                    )
                  }
                  data-testid={`team-editor-name-${activeTeamEditor()!.teamId}`}
                />
              </label>

              <div class="grid gap-3">
                <span class="text-sm text-(--color-muted)">{t('party.teamColors')}</span>
                <div class="grid grid-cols-4 gap-2">
                  <For each={teamColorOptions}>
                    {(color) => {
                      const isDisabled = () =>
                        color !== activeTeamEditor()!.color &&
                        color === state.settings.teamColors[activeTeamEditor()!.teamId === 'north-south' ? 'east-west' : 'north-south']

                      return (
                        <button
                          type="button"
                          class={clsx(
                            'grid gap-2 rounded-2xl border p-3 text-left transition-transform',
                            teamColorClasses[color].chip,
                            activeTeamEditor()!.color === color
                              ? 'border-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]'
                              : 'border-transparent',
                            isDisabled()
                              ? 'cursor-not-allowed opacity-30'
                              : 'motion-safe:hover:-translate-y-0.5',
                          )}
                          aria-disabled={isDisabled()}
                          aria-pressed={activeTeamEditor()!.color === color}
                          disabled={isDisabled()}
                          data-testid={`team-editor-color-${color}`}
                          onClick={() =>
                            setTeamEditorDraft((current) => (current ? { ...current, color } : current))
                          }
                        >
                          <span class="h-3 w-8 rounded-full bg-black/20" />
                          <span class="text-[11px] font-semibold uppercase tracking-[0.18em]">
                            {color}
                          </span>
                        </button>
                      )
                    }}
                  </For>
                </div>
              </div>
            </div>
          </div>

          <DialogActions
            primaryLabel={t('party.applyChanges')}
            secondaryLabel={t('round.cancel')}
            onPrimary={commitTeamEditor}
            onSecondary={closeTeamEditor}
          />
        </DialogShell>
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

function TeamSetupCard(props: {
  teamId: TeamId
  label: () => string
  subtitle: () => string
  selectedColor: () => TeamColor
  oppositeColor: () => TeamColor
  onOpenEditor: (teamId: TeamId) => void
}) {
  const { t } = useGame()

  return (
    <button
      type="button"
      class="rounded-3xl border border-white/10 bg-black/10 p-3 text-left transition-transform motion-safe:hover:-translate-y-0.5"
      data-testid={`team-name-${props.teamId}`}
      onClick={() => props.onOpenEditor(props.teamId)}
    >
      <div class="grid gap-3">
        <div>
          <p class="text-sm font-medium text-(--color-fg)" data-testid={`team-label-${props.teamId}`}>
            {props.label()}
          </p>
          <p class="mt-1 text-[11px] text-(--color-muted)">{props.subtitle()}</p>
        </div>
        <div class="flex items-center justify-between gap-3">
          <div class="flex flex-wrap gap-1.5">
            <For each={teamColorOptions.slice(0, 4)}>
              {(color) => (
                <span
                  class={clsx(
                    'h-3 w-3 rounded-full border border-white/10',
                    teamColorClasses[color].chip,
                    props.selectedColor() !== color && props.oppositeColor() === color && 'opacity-25',
                  )}
                />
              )}
            </For>
          </div>
          <span class="text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">{t('party.editTeam')}</span>
        </div>
      </div>
    </button>
  )
}

function DialogShell(props: ParentProps<{
  closeLabel: string
  onClose: () => void
  testId: string
}>) {
  return (
    <div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/82 p-0 backdrop-blur-md sm:items-center sm:p-6">
      <button
        type="button"
        class="absolute inset-0"
        aria-label={props.closeLabel}
        onClick={() => props.onClose()}
      />
      <div
        class="relative z-10 flex h-dvh max-h-dvh w-full flex-col overflow-hidden border-white/12 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:h-auto sm:max-h-[min(100dvh-3rem,42rem)] sm:max-w-md sm:rounded-4xl sm:border"
        data-testid={props.testId}
      >
        {props.children}
      </div>
    </div>
  )
}

function DialogActions(props: {
  primaryLabel: string
  secondaryLabel: string
  onPrimary: () => void
  onSecondary: () => void
}) {
  return (
    <div class="sticky bottom-0 flex gap-3 border-t border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 sm:px-5 sm:pb-5">
      <button
        type="button"
        class="flex-1 rounded-2xl bg-(--color-accent) px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={() => props.onPrimary()}
      >
        {props.primaryLabel}
      </button>
      <button
        type="button"
        class="rounded-2xl border border-white/10 px-4 py-3 text-sm text-(--color-fg)"
        onClick={() => props.onSecondary()}
      >
        {props.secondaryLabel}
      </button>
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
