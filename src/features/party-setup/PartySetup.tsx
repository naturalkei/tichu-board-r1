import { Show, createMemo, createSignal } from 'solid-js'
import type { PlayerId, Seat, TeamId } from '@/domain/types'
import { useGame } from '@/state/game-context'
import { PartyBench } from './PartyBench'
import { PlayerEditorDialog, TeamEditorDialog } from './PartySetupDialogs'
import { createSeatEntries, SeatMapBoard } from './SeatMapBoard'
import { TeamSetupCard } from './TeamSetupCard'
import {
  getTeamId,
  getUniqueRandomName,
  type EditorDraft,
  type TeamEditorDraft,
} from './party-setup.shared'

export function PartySetup() {
  const { assignPlayerSeat, setTeamColor, setTeamName, state, teamLineups, teamNames, updatePlayerName, t } = useGame()
  const [editorDraft, setEditorDraft] = createSignal<EditorDraft | null>(null)
  const [teamEditorDraft, setTeamEditorDraft] = createSignal<TeamEditorDraft | null>(null)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [armedPlayerId, setArmedPlayerId] = createSignal<PlayerId | null>(null)
  const [draggingPlayerId, setDraggingPlayerId] = createSignal<PlayerId | null>(null)
  const [armedRecentName, setArmedRecentName] = createSignal<string | null>(null)
  const [draggingRecentName, setDraggingRecentName] = createSignal<string | null>(null)

  const seatEntries = createMemo(() => createSeatEntries(state.players))
  const activePlayer = createMemo(() => {
    const draft = editorDraft()
    return draft ? state.players.find((player) => player.id === draft.playerId) ?? null : null
  })
  const recentNames = createMemo(() => {
    const seatedNames = new Set(state.players.map((player) => player.name.trim().toLowerCase()))
    return state.recentPlayerNames.filter((name) => !seatedNames.has(name.trim().toLowerCase())).slice(0, 2)
  })
  const rosterPlayers = createMemo(() =>
    state.players.map((player) => ({
      id: player.id,
      name: player.name,
      seatInitial: t(`seats.${player.seat}`).slice(0, 1),
      teamColor: state.settings.teamColors[getTeamId(player.seat)],
    })),
  )
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

  const openPlayerEditor = (playerId: PlayerId) => {
    const player = state.players.find((item) => item.id === playerId)

    if (!player) {
      return
    }
    setEditorDraft({ playerId: player.id, name: player.name })
    setErrorMessage('')
  }

  const closePlayerEditor = () => {
    setEditorDraft(null)
    setErrorMessage('')
  }

  const openTeamEditor = (teamId: TeamId) => {
    setTeamEditorDraft({ teamId, name: teamNames()[teamId], color: state.settings.teamColors[teamId] })
  }

  const clearArmedState = () => {
    setArmedPlayerId(null)
    setDraggingPlayerId(null)
    setArmedRecentName(null)
    setDraggingRecentName(null)
  }

  const activeTeamId = (teamId: TeamId) => (teamId === 'north-south' ? 'east-west' : 'north-south')

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
    openPlayerEditor(seatPlayer.id)
  }

  const commitPlayerEditor = () => {
    const draft = editorDraft()

    if (!draft || !applyNameToSeat(draft.playerId, draft.name)) {
      return
    }

    closePlayerEditor()
  }

  const commitTeamEditor = () => {
    const draft = teamEditorDraft()

    if (!draft) {
      return
    }

    setTeamName(draft.teamId, draft.name)
    setTeamColor(draft.teamId, draft.color)
    setTeamEditorDraft(null)
  }

  return (
    <section class="grid gap-4 rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5">
      <div class="grid gap-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">{t('sections.party')}</p>
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
            label={teamNames()['north-south']}
            subtitle={teamLineups()['north-south']}
            selectedColor={state.settings.teamColors['north-south']}
            oppositeColor={state.settings.teamColors['east-west']}
            editLabel={t('party.editTeam')}
            onOpenEditor={openTeamEditor}
          />
          <TeamSetupCard
            teamId="east-west"
            label={teamNames()['east-west']}
            subtitle={teamLineups()['east-west']}
            selectedColor={state.settings.teamColors['east-west']}
            oppositeColor={state.settings.teamColors['north-south']}
            editLabel={t('party.editTeam')}
            onOpenEditor={openTeamEditor}
          />
        </div>
      </div>

      <PartyBench
        players={rosterPlayers()}
        recentNames={recentNames()}
        armedPlayerId={armedPlayerId()}
        armedRecentName={armedRecentName()}
        onArmPlayer={(playerId) => {
          setArmedPlayerId(playerId)
          setArmedRecentName(null)
        }}
        onDragPlayerStart={(playerId) => {
          setDraggingPlayerId(playerId)
          setArmedRecentName(null)
        }}
        onDragPlayerEnd={() => setDraggingPlayerId(null)}
        onRecentNameClick={(name) => {
          const draft = editorDraft()
          if (draft) {
            setEditorDraft({ ...draft, name })
            setErrorMessage('')
            return
          }
          setArmedRecentName(name)
          setArmedPlayerId(null)
        }}
        onRecentNameDragStart={(name) => {
          setDraggingRecentName(name)
          setArmedPlayerId(null)
        }}
        onRecentNameDragEnd={() => setDraggingRecentName(null)}
        onClearSelection={clearArmedState}
        title={t('party.playerBench')}
        hint={t('party.playerBenchHint')}
        clearLabel={t('party.clearSelection')}
      />

      <SeatMapBoard
        entries={seatEntries()}
        teamColors={state.settings.teamColors}
        teamNames={teamNames()}
        armedPlayerId={armedPlayerId()}
        draggingPlayerId={draggingPlayerId()}
        armedRecentName={armedRecentName()}
        draggingRecentName={draggingRecentName()}
        onSeatAssign={handleSeatAssign}
        tableLabel={t('party.tableLabel')}
        dropToSeatLabel={t('party.dropToSeat')}
        seatActionLabel={(seat, name) => t('party.seatAction', { seat: t(`seats.${seat}`), name })}
      />

      <Show when={editorDraft() && activePlayer()}>
        <PlayerEditorDialog
          draft={editorDraft()!}
          errorMessage={errorMessage()}
          recentNames={recentNames()}
          title={t('party.editorTitle')}
          subtitle={t('party.editorSubtitle', { seat: t(`seats.${activePlayer()!.seat}`) })}
          nameFieldLabel={t('party.nameField')}
          quickActionsLabel={t('party.quickActions')}
          rerollLabel={t('party.rerollName')}
          moveSeatLabel={t('party.moveSeat')}
          closeLabel={t('party.closeEditor')}
          applyLabel={t('party.applyChanges')}
          cancelLabel={t('round.cancel')}
          onNameInput={(name) => setEditorDraft((current) => (current ? { ...current, name } : current))}
          onRecentNameClick={(name) => setEditorDraft((current) => (current ? { ...current, name } : current))}
          onReroll={() =>
            setEditorDraft((current) =>
              current ? { ...current, name: getUniqueRandomName(state.players, state.settings.language, current) } : current,
            )
          }
          onMoveSeat={() => {
            setArmedPlayerId(activePlayer()!.id)
            setArmedRecentName(null)
            closePlayerEditor()
          }}
          onClose={closePlayerEditor}
          onApply={commitPlayerEditor}
        />
      </Show>

      <Show when={teamEditorDraft()}>
        <TeamEditorDialog
          draft={teamEditorDraft()!}
          oppositeTeamColor={state.settings.teamColors[activeTeamId(teamEditorDraft()!.teamId)]}
          title={t('party.teamEditorTitle')}
          subtitle={t('party.teamEditorSubtitle', {
            team: teamEditorDraft()!.teamId === 'north-south' ? '1' : '2',
          })}
          closeLabel={t('party.closeTeamEditor')}
          nameFieldLabel={t('party.teamNameField')}
          teamColorsLabel={t('party.teamColors')}
          applyLabel={t('party.applyChanges')}
          cancelLabel={t('round.cancel')}
          onNameInput={(name) => setTeamEditorDraft((current) => (current ? { ...current, name } : current))}
          onColorSelect={(color) => setTeamEditorDraft((current) => (current ? { ...current, color } : current))}
          onClose={() => setTeamEditorDraft(null)}
          onApply={commitTeamEditor}
        />
      </Show>
    </section>
  )
}
