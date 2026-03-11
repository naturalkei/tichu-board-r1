import type { Player, PlayerId, Seat, TeamColor, TeamId } from '@/domain/types'
import clsx from 'clsx'
import { For, Show } from 'solid-js'

import { getTeamId, seatLayouts, seatOverlayLabels, teamColorClasses } from './party-setup.shared'
import { TeamBadge } from './TeamSetupCard'

type SeatEntry = {
  seat: Seat
  className: string
  player: Player | null
}

type SeatMapBoardProps = {
  entries: SeatEntry[]
  teamColors: Record<TeamId, TeamColor>
  teamNames: Record<TeamId, string>
  armedPlayerId: PlayerId | null
  draggingPlayerId: PlayerId | null
  armedRecentName: string | null
  draggingRecentName: string | null
  onSeatAssign: (seat: Seat) => void
  tableLabel: string
  dropToSeatLabel: string
  seatActionLabel: (seat: Seat, name: string) => string
}

export function SeatMapBoard(props: SeatMapBoardProps) {
  return (
    <div
      class="grid aspect-square grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] grid-rows-[auto_minmax(6rem,1fr)_auto] gap-3"
      aria-label={props.tableLabel}
      data-testid="seat-map-board"
    >
      <div class="col-start-2 row-start-2 flex items-center justify-center">
        <div class="flex h-full w-full max-w-18 items-center justify-center p-4 text-center">
          <div class="grid place-items-center gap-2">
            <div class={clsx(
              'h-15 w-15 rounded-full border border-white/15 bg-black/18 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]', 
              'flex items-center justify-center',
            )} >
              <p class="text-[9px] uppercase tracking-[0.2em] text-(--color-muted)">Tichu</p>
            </div>
          </div>
        </div>
      </div>

      <For each={props.entries}>
        {(entry) => {
          const player = entry.player
          const teamId = player ? getTeamId(player.seat) : getTeamId(entry.seat)
          const colors = teamColorClasses[props.teamColors[teamId]]
          const isActiveDropTarget = () =>
            Boolean(props.armedPlayerId || props.draggingPlayerId || props.armedRecentName || props.draggingRecentName)
          const isSourceSeat = () =>
            Boolean(props.armedPlayerId && player?.id === props.armedPlayerId) ||
            Boolean(props.draggingPlayerId && player?.id === props.draggingPlayerId)
          const showDropLabel = () => isActiveDropTarget() && !isSourceSeat()

          return (
            <button
              type="button"
              class={clsx(
                entry.className,
                'relative flex aspect-square w-full min-w-0',
                'flex-col items-center justify-center overflow-hidden rounded-3xl bg-(--color-surface) p-2',
                'ring-1 transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5',
                isActiveDropTarget()
                  ? 'border-2 border-(--color-accent) ring-2 ring-(--color-accent)/45 shadow-[0_0_0_1px_rgba(255,191,105,0.16),0_20px_36px_rgba(255,191,105,0.14)]'
                  : 'border border-white/10',
                colors.ring,
                colors.glow,
                isSourceSeat() && 'border-white/18 ring-1 ring-white/20 shadow-none',
              )}
              aria-label={props.seatActionLabel(entry.seat, player?.name ?? '')}
              onClick={() => props.onSeatAssign(entry.seat)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => props.onSeatAssign(entry.seat)}
              data-testid={`seat-${entry.seat}`}
              data-seat-id={entry.seat}
            >
              <div class={clsx('pointer-events-none absolute inset-0 bg-linear-to-br opacity-70', colors.surface)} />
              <span
                class="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(3.5rem,20vw,5.25rem)] font-black tracking-[-0.08em] text-white/6"
                aria-hidden="true"
                data-testid={`seat-overlay-${entry.seat}`}
              >
                {seatOverlayLabels[entry.seat]}
              </span>
              <div class="absolute top-2 left-2">
                <span class="inline-flex items-center gap-1 rounded-full border border-white/8 bg-black/10 px-2 py-1 text-[10px] text-(--color-muted)">
                  <TeamBadge color={props.teamColors[teamId]} />
                  {props.teamNames[teamId]}
                </span>
              </div>

              <div class="relative grid gap-1">
                <p class="text-lg font-semibold tracking-[-0.02em] text-(--color-fg)">{player?.name}</p>
              </div>
              <Show when={showDropLabel()}>
                <div class="absolute inset-0 bg-black/65 flex items-center justify-center">
                  <p class="text-[9px] font-medium tracking-[0.2em] text-(--color-accent)">
                    {props.dropToSeatLabel}
                  </p>
                </div>
              </Show>
            </button>
          )
        }}
      </For>
    </div>
  )
}

export function createSeatEntries(players: Player[]) {
  return seatLayouts.map(({ seat, className }) => ({
    seat,
    className,
    player: players.find((item) => item.seat === seat) ?? null,
  }))
}
