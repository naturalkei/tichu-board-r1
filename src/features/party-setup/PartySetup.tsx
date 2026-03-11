import { Show, createEffect } from 'solid-js'

import { PartyBench } from './PartyBench'
import { PlayerEditorDialog, TeamEditorDialog } from './PartySetupDialogs'
import { SeatMapBoard } from './SeatMapBoard'
import { TeamSetupCard } from './TeamSetupCard'
import { usePartySetupController } from './use-party-setup-controller'

export function PartySetup() {
  const controller = usePartySetupController()
  let seatMapContainerRef: HTMLDivElement | undefined

  createEffect(() => {
    const armedPlayerId = controller.armedPlayerId()
    const seatMapElement = seatMapContainerRef

    if (!armedPlayerId || !seatMapElement || typeof window === 'undefined') {
      return
    }

    const { top, bottom } = seatMapElement.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const isFullyVisible = top >= 0 && bottom <= viewportHeight

    if (isFullyVisible) {
      return
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    seatMapElement.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    })
  })

  return (
    <section class="grid gap-4 rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5">
      <div class="grid gap-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">{controller.t('sections.party')}</p>
            <p class="mt-2 text-xs leading-5 text-(--color-muted) sm:text-sm">{controller.t('party.hintCompact')}</p>
          </div>
          <Show when={controller.interactionHint()}>
            <span class="inline-flex max-w-40 rounded-full border border-white/10 bg-black/18 px-3 py-1 text-[11px] leading-5 text-(--color-fg)">
              {controller.interactionHint()}
            </span>
          </Show>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <TeamSetupCard
            teamId="north-south"
            label={controller.teamNames()['north-south']}
            subtitle={controller.teamLineups()['north-south']}
            selectedColor={controller.state.settings.teamColors['north-south']}
            oppositeColor={controller.state.settings.teamColors['east-west']}
            editLabel={controller.t('party.editTeam')}
            onOpenEditor={controller.openTeamEditor}
          />
          <TeamSetupCard
            teamId="east-west"
            label={controller.teamNames()['east-west']}
            subtitle={controller.teamLineups()['east-west']}
            selectedColor={controller.state.settings.teamColors['east-west']}
            oppositeColor={controller.state.settings.teamColors['north-south']}
            editLabel={controller.t('party.editTeam')}
            onOpenEditor={controller.openTeamEditor}
          />
        </div>
      </div>

      <PartyBench
        players={controller.rosterPlayers()}
        recentNames={controller.recentNames()}
        armedPlayerId={controller.armedPlayerId()}
        armedRecentName={controller.armedRecentName()}
        onArmPlayer={controller.armPlayer}
        onDragPlayerStart={controller.startDraggingPlayer}
        onDragPlayerEnd={controller.stopDraggingPlayer}
        onDragPlayerDrop={controller.handleSeatAssign}
        onRecentNameClick={controller.selectRecentName}
        onRecentNameDragStart={controller.startDraggingRecentName}
        onRecentNameDragEnd={controller.stopDraggingRecentName}
        onClearSelection={controller.clearArmedState}
        title={controller.t('party.playerBench')}
        hint={controller.t('party.playerBenchHint')}
        clearLabel={controller.t('party.clearSelection')}
      />

      <div ref={seatMapContainerRef} data-testid="seat-map-scroll-anchor">
        <SeatMapBoard
          entries={controller.seatEntries()}
          teamColors={controller.state.settings.teamColors}
          teamNames={controller.teamNames()}
          armedPlayerId={controller.armedPlayerId()}
          draggingPlayerId={controller.draggingPlayerId()}
          armedRecentName={controller.armedRecentName()}
          draggingRecentName={controller.draggingRecentName()}
          onSeatAssign={controller.handleSeatAssign}
          tableLabel={controller.t('party.tableLabel')}
          dropToSeatLabel={controller.t('party.dropToSeat')}
          seatActionLabel={(seat, name) => controller.t('party.seatAction', { seat: controller.t(`seats.${seat}`), name })}
        />
      </div>

      <Show when={controller.editorDraft() && controller.activePlayer()}>
        <PlayerEditorDialog
          draft={controller.editorDraft()!}
          errorMessage={controller.errorMessage()}
          recentNames={controller.recentNames()}
          title={controller.t('party.editorTitle')}
          subtitle={controller.t('party.editorSubtitle', { seat: controller.t(`seats.${controller.activePlayer()!.seat}`) })}
          nameFieldLabel={controller.t('party.nameField')}
          quickActionsLabel={controller.t('party.quickActions')}
          recentNamesLabel={controller.t('party.recentPlayers')}
          recentNamesHint={controller.t('party.recentPlayersHint')}
          rerollLabel={controller.t('party.rerollName')}
          moveSeatLabel={controller.t('party.moveSeat')}
          closeLabel={controller.t('party.closeEditor')}
          applyLabel={controller.t('party.applyChanges')}
          cancelLabel={controller.t('round.cancel')}
          onNameInput={controller.setEditorName}
          onRecentNameClick={controller.selectRecentName}
          onReroll={controller.rerollEditorName}
          onMoveSeat={controller.moveEditorPlayerToSeatMode}
          onClose={controller.closePlayerEditor}
          onApply={controller.commitPlayerEditor}
        />
      </Show>

      <Show when={controller.teamEditorDraft()}>
        <TeamEditorDialog
          draft={controller.teamEditorDraft()!}
          oppositeTeamColor={controller.state.settings.teamColors[controller.activeTeamId(controller.teamEditorDraft()!.teamId)]}
          title={controller.t('party.teamEditorTitle')}
          subtitle={controller.t('party.teamEditorSubtitle', {
            team: controller.teamEditorDraft()!.name.trim() || (controller.teamEditorDraft()!.teamId === 'north-south' ? 'Team 1' : 'Team 2'),
          })}
          closeLabel={controller.t('party.closeTeamEditor')}
          nameFieldLabel={controller.t('party.teamNameField')}
          teamColorsLabel={controller.t('party.teamColors')}
          teamColorBlockedLabel={controller.t('party.teamColorUnavailable')}
          onNameInput={controller.setTeamEditorName}
          onColorSelect={controller.setTeamEditorColor}
          onClose={controller.closeTeamEditor}
        />
      </Show>
    </section>
  )
}
