import clsx from 'clsx'
import { For, Show, createSignal, onCleanup } from 'solid-js'
import { Portal } from 'solid-js/web'
import type { PlayerId, Seat, TeamColor } from '@/domain/types'
import { teamColorClasses } from './party-setup.shared'

type BenchPlayer = {
  id: PlayerId
  name: string
  seatInitial: string
  teamColor: TeamColor
}

type PartyBenchProps = {
  players: BenchPlayer[]
  recentNames: string[]
  armedPlayerId: PlayerId | null
  armedRecentName: string | null
  onArmPlayer: (playerId: PlayerId) => void
  onDragPlayerStart: (playerId: PlayerId) => void
  onDragPlayerEnd: () => void
  onDragPlayerDrop: (seat: Seat) => void
  onRecentNameClick: (name: string) => void
  onRecentNameDragStart: (name: string) => void
  onRecentNameDragEnd: () => void
  onClearSelection: () => void
  title: string
  hint: string
  clearLabel: string
}

export function PartyBench(props: PartyBenchProps) {
  const [suppressClickPlayerId, setSuppressClickPlayerId] = createSignal<PlayerId | null>(null)
  const [dragPreview, setDragPreview] = createSignal<{
    playerId: PlayerId
    name: string
    seatInitial: string
    teamColor: TeamColor
    x: number
    y: number
    offsetX: number
    offsetY: number
    width: number
    height: number
    hasStarted: boolean
  } | null>(null)

  let activePointerId: number | null = null
  let originX = 0
  let originY = 0

  const clearPointerDrag = () => {
    activePointerId = null
    originX = 0
    originY = 0
    setDragPreview(null)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerCancel)
  }

  const resolveSeatAtPoint = (x: number, y: number): Seat | null => {
    const target = document.elementFromPoint(x, y)

    if (!(target instanceof HTMLElement)) {
      return null
    }

    const seatTarget = target.closest<HTMLElement>('[data-seat-id]')
    const seat = seatTarget?.dataset.seatId

    return seat === 'north' || seat === 'east' || seat === 'south' || seat === 'west' ? seat : null
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return
    }

    setDragPreview((current) => {
      if (!current) {
        return current
      }

      const distance = Math.hypot(event.clientX - originX, event.clientY - originY)
      const hasStarted = current.hasStarted || distance > 8

      if (hasStarted && !current.hasStarted) {
        props.onDragPlayerStart(current.playerId)
      }

      return {
        ...current,
        x: event.clientX,
        y: event.clientY,
        hasStarted,
      }
    })
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return
    }

    const current = dragPreview()

    if (!current) {
      clearPointerDrag()
      return
    }

    if (!current.hasStarted) {
      props.onArmPlayer(current.playerId)
      setSuppressClickPlayerId(current.playerId)
      clearPointerDrag()
      return
    }

    const seat = resolveSeatAtPoint(event.clientX, event.clientY)

    if (seat) {
      props.onDragPlayerDrop(seat)
    } else {
      props.onDragPlayerEnd()
    }

    setSuppressClickPlayerId(current.playerId)
    clearPointerDrag()
  }

  const handlePointerCancel = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return
    }

    if (dragPreview()?.hasStarted) {
      props.onDragPlayerEnd()
    }

    clearPointerDrag()
  }

  const startPointerDrag = (event: PointerEvent, player: BenchPlayer) => {
    if (event.button !== 0) {
      return
    }

    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()

    activePointerId = event.pointerId
    originX = event.clientX
    originY = event.clientY
    setDragPreview({
      playerId: player.id,
      name: player.name,
      seatInitial: player.seatInitial,
      teamColor: player.teamColor,
      x: event.clientX,
      y: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      hasStarted: false,
    })
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerCancel)
  }

  onCleanup(() => clearPointerDrag())

  return (
    <section class="grid gap-3 rounded-4xl border border-white/10 bg-black/12 p-3">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-[11px] uppercase tracking-[0.22em] text-(--color-accent)">{props.title}</p>
          <p class="mt-1 text-[11px] text-(--color-muted)">{props.hint}</p>
        </div>
        <Show when={props.armedPlayerId || props.armedRecentName}>
          <button
            type="button"
            class="rounded-full border border-white/10 px-3 py-1 text-[11px] text-(--color-fg)"
            onClick={() => props.onClearSelection()}
          >
            {props.clearLabel}
          </button>
        </Show>
      </div>

      <div class="grid gap-2">
        <div class="flex flex-wrap gap-2">
          <For each={props.players}>
            {(player) => (
              <button
                type="button"
                class={clsx(
                  'inline-flex min-h-12 touch-none items-center gap-2 rounded-full border px-3 py-2 text-left text-sm transition-transform',
                  props.armedPlayerId === player.id
                    ? 'border-(--color-accent) bg-(--color-accent) text-slate-950'
                    : 'border-white/10 bg-(--color-surface) text-(--color-fg) motion-safe:hover:-translate-y-0.5',
                )}
                data-testid={`bench-player-${player.id}`}
                onClick={() => {
                  if (suppressClickPlayerId() === player.id) {
                    setSuppressClickPlayerId(null)
                    return
                  }

                  props.onArmPlayer(player.id)
                }}
                onPointerDown={(event) => startPointerDrag(event, player)}
              >
                <span
                  class={clsx(
                    'inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold',
                    teamColorClasses[player.teamColor].chip,
                  )}
                >
                  {player.seatInitial}
                </span>
                <span class="font-medium">{player.name}</span>
              </button>
            )}
          </For>
        </div>

        <Show when={props.recentNames.length > 0}>
          <div class="flex flex-wrap gap-2 border-t border-white/8 pt-2">
            <For each={props.recentNames}>
              {(name) => (
                <button
                  type="button"
                  class={clsx(
                    'rounded-full border px-3 py-2 text-sm transition-colors opacity-55 grayscale',
                    props.armedRecentName === name
                      ? 'border-(--color-accent) bg-(--color-accent) text-slate-950 opacity-100 grayscale-0'
                      : 'border-white/10 bg-black/15 text-(--color-fg)',
                  )}
                  draggable="true"
                  data-testid={`bench-recent-${name}`}
                  onClick={() => props.onRecentNameClick(name)}
                  onDragStart={() => props.onRecentNameDragStart(name)}
                  onDragEnd={props.onRecentNameDragEnd}
                >
                  {name}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>

      <Show when={dragPreview() && dragPreview()!.hasStarted}>
        <Portal>
          <div
            class="pointer-events-none fixed left-0 top-0 z-999"
            style={{
              left: `${dragPreview()!.x - dragPreview()!.offsetX}px`,
              top: `${dragPreview()!.y - dragPreview()!.offsetY}px`,
              width: `${dragPreview()!.width}px`,
              height: `${dragPreview()!.height}px`,
            }}
            data-testid="bench-drag-preview"
          >
            <div class="inline-flex h-full w-full items-center gap-2 rounded-full border border-white/14 bg-[color-mix(in_srgb,var(--color-surface)_94%,#020617)] px-3 py-2 text-sm text-(--color-fg) shadow-[0_18px_40px_rgba(15,23,42,0.3)]">
              <div
                class={clsx(
                  'inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold',
                  teamColorClasses[dragPreview()!.teamColor].chip,
                )}
              >
                {dragPreview()!.seatInitial}
              </div>
              <span class="font-medium">{dragPreview()!.name}</span>
            </div>
          </div>
        </Portal>
      </Show>
    </section>
  )
}
