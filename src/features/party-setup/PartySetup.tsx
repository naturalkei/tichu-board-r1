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

export function PartySetup() {
  const { assignPlayerSeat, setTeamColor, setTeamName, state, teamLineups, teamNames, updatePlayerName, t } = useGame()
  const [editorDraft, setEditorDraft] = createSignal<EditorDraft | null>(null)
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
            onSelectColor={setTeamColor}
            onNameChange={setTeamName}
          />
          <TeamSetupCard
            teamId="east-west"
            label={() => teamNames()['east-west']}
            subtitle={() => teamLineups()['east-west']}
            selectedColor={() => state.settings.teamColors['east-west']}
            oppositeColor={() => state.settings.teamColors['north-south']}
            onSelectColor={setTeamColor}
            onNameChange={setTeamName}
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
        <div class="fixed inset-0 z-50 bg-slate-950/78 backdrop-blur-md">
          <button
            type="button"
            class="absolute inset-0"
            aria-label={t('party.closeEditor')}
            onClick={closeEditor}
          />

          <div
            class="relative z-10 flex min-h-dvh w-full flex-col border-white/12 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:mx-auto sm:mt-6 sm:min-h-0 sm:max-w-md sm:rounded-4xl sm:border"
            data-testid="party-editor-dialog"
          >
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

            <div class="sticky bottom-0 flex gap-3 border-t border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 sm:rounded-b-4xl sm:px-5 sm:pb-5">
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
  onSelectColor: (teamId: TeamId, color: TeamColor) => void
  onNameChange: (teamId: TeamId, name: string) => void
}) {
  const { t } = useGame()
  const unavailableColors = createMemo(() => {
    return Object.fromEntries(
      teamColorOptions.map((color) => [color, color !== props.selectedColor() && props.oppositeColor() === color]),
    ) as Record<TeamColor, boolean>
  })

  return (
    <div
      class="rounded-3xl border border-white/10 bg-black/10 p-3"
      data-testid={`team-name-${props.teamId}`}
    >
      <div class="grid gap-3">
        <div>
          <input
            class="w-full border-b border-dashed border-white/18 bg-transparent pb-1 text-sm font-medium text-(--color-fg) outline-none focus:border-(--color-accent)"
            value={props.label()}
            data-testid={`team-label-${props.teamId}`}
            onInput={(event) => props.onNameChange(props.teamId, event.currentTarget.value)}
          />
          <p class="mt-1 text-[11px] text-(--color-muted)">{props.subtitle()}</p>
        </div>
        <div class="flex flex-wrap justify-end gap-1">
          <For each={teamColorOptions}>
            {(color) => {
              const isDisabled = () => unavailableColors()[color]

              return (
                <button
                  type="button"
                  class={clsx(
                    'h-7 w-7 rounded-full border-2 transition-transform',
                    teamColorClasses[color].chip,
                    props.selectedColor() === color ? 'border-white' : 'border-transparent',
                    isDisabled()
                      ? 'cursor-not-allowed opacity-35'
                      : 'motion-safe:hover:scale-105',
                  )}
                  aria-label={`${props.label()} ${color}`}
                  aria-disabled={isDisabled()}
                  aria-pressed={props.selectedColor() === color}
                  data-testid={`team-color-${props.teamId}-${color}`}
                  disabled={isDisabled()}
                  title={isDisabled() ? t('party.teamColorUnavailable') : undefined}
                  onClick={() => props.onSelectColor(props.teamId, color)}
                />
              )
            }}
          </For>
        </div>
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
