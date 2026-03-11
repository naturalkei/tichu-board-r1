import clsx from 'clsx'
import { For, Show } from 'solid-js'
import type { Player, PlayerId, Seat, TeamColor, TeamId } from '@/domain/types'
import { TeamBadge } from './TeamSetupCard'
import { getTeamId, seatLayouts, seatOverlayLabels, teamColorClasses } from './party-setup.shared'

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
      class="grid min-h-96 grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] grid-rows-[auto_minmax(6rem,1fr)_auto] gap-3"
      aria-label={props.tableLabel}
    >
      <div class="col-start-2 row-start-2 flex items-center justify-center">
        <div class="flex h-full w-full items-center justify-center rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,191,105,0.18),rgba(15,23,42,0.94))] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div class="grid place-items-center gap-2">
            <div class="h-12 w-12 rounded-full border border-white/12 bg-black/18 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]" />
            <p class="text-[10px] uppercase tracking-[0.3em] text-(--color-muted)">Tichu</p>
          </div>
        </div>
      </div>

      <For each={props.entries}>
        {(entry) => {
          const player = entry.player
          const teamId = player ? getTeamId(player.seat) : getTeamId(entry.seat)
          const colors = teamColorClasses[props.teamColors[teamId]]
          const isActiveDropTarget = Boolean(
            props.armedPlayerId || props.draggingPlayerId || props.armedRecentName || props.draggingRecentName,
          )

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
              aria-label={props.seatActionLabel(entry.seat, player?.name ?? '')}
              onClick={() => props.onSeatAssign(entry.seat)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => props.onSeatAssign(entry.seat)}
              data-testid={`seat-${entry.seat}`}
            >
              <div class={clsx('pointer-events-none absolute inset-0 bg-linear-to-br opacity-70', colors.surface)} />
              <span
                class="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(3.5rem,20vw,5.25rem)] font-black tracking-[-0.08em] text-white/6"
                aria-hidden="true"
                data-testid={`seat-overlay-${entry.seat}`}
              >
                {seatOverlayLabels[entry.seat]}
              </span>
              <div class="relative flex items-start justify-end gap-2">
                <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/18 px-2 py-1 text-[10px] text-(--color-muted)">
                  <TeamBadge color={props.teamColors[teamId]} />
                  {props.teamNames[teamId]}
                </span>
              </div>

              <div class="relative grid gap-1">
                <p class="text-lg font-semibold tracking-[-0.02em] text-(--color-fg)">{player?.name}</p>
                <Show when={isActiveDropTarget}>
                  <p class="text-[11px] text-(--color-muted)">{props.dropToSeatLabel}</p>
                </Show>
              </div>
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
