import { createMemo, createSignal } from 'solid-js'
import type { PlayerId, Seat, TeamId } from '@/domain/types'
import { useGame } from '@/state/game-context'
import { createSeatEntries } from './SeatMapBoard'
import {
  getTeamId,
  getUniqueRandomName,
  type EditorDraft,
  type TeamEditorDraft,
} from './party-setup.shared'

export function usePartySetupController() {
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

  const closePlayerEditor = () => {
    setEditorDraft(null)
    setErrorMessage('')
  }

  const openPlayerEditor = (playerId: PlayerId) => {
    const player = state.players.find((item) => item.id === playerId)

    if (!player) {
      return
    }

    setEditorDraft({ playerId: player.id, name: player.name })
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

  return {
    state,
    teamLineups,
    teamNames,
    t,
    editorDraft,
    teamEditorDraft,
    errorMessage,
    armedPlayerId,
    draggingPlayerId,
    armedRecentName,
    draggingRecentName,
    seatEntries,
    activePlayer,
    recentNames,
    rosterPlayers,
    interactionHint,
    closePlayerEditor,
    openPlayerEditor,
    openTeamEditor,
    clearArmedState,
    activeTeamId: (teamId: TeamId) => (teamId === 'north-south' ? 'east-west' : 'north-south'),
    setEditorName: (name: string) => setEditorDraft((current) => (current ? { ...current, name } : current)),
    setTeamEditorName: (name: string) =>
      setTeamEditorDraft((current) => {
        if (!current) {
          return current
        }

        setTeamName(current.teamId, name)
        return { ...current, name }
      }),
    setTeamEditorColor: (color: TeamEditorDraft['color']) =>
      setTeamEditorDraft((current) => {
        if (!current) {
          return current
        }

        setTeamColor(current.teamId, color)
        return { ...current, color }
      }),
    armPlayer: (playerId: PlayerId) => {
      setArmedPlayerId(playerId)
      setArmedRecentName(null)
    },
    startDraggingPlayer: (playerId: PlayerId) => {
      setDraggingPlayerId(playerId)
      setArmedRecentName(null)
    },
    stopDraggingPlayer: () => setDraggingPlayerId(null),
    selectRecentName: (name: string) => {
      const draft = editorDraft()

      if (draft) {
        setEditorDraft({ ...draft, name })
        setErrorMessage('')
        return
      }

      setArmedRecentName(name)
      setArmedPlayerId(null)
    },
    startDraggingRecentName: (name: string) => {
      setDraggingRecentName(name)
      setArmedPlayerId(null)
    },
    stopDraggingRecentName: () => setDraggingRecentName(null),
    rerollEditorName: () =>
      setEditorDraft((current) =>
        current ? { ...current, name: getUniqueRandomName(state.players, state.settings.language, current) } : current,
      ),
    moveEditorPlayerToSeatMode: () => {
      const player = activePlayer()

      if (!player) {
        return
      }

      setArmedPlayerId(player.id)
      setArmedRecentName(null)
      closePlayerEditor()
    },
    closeTeamEditor: () => setTeamEditorDraft(null),
    handleSeatAssign,
    commitPlayerEditor,
  }
}
