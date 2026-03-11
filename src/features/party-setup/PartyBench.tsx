import clsx from 'clsx'
import { For, Show } from 'solid-js'
import type { PlayerId, TeamColor } from '@/domain/types'
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
  onRecentNameClick: (name: string) => void
  onRecentNameDragStart: (name: string) => void
  onRecentNameDragEnd: () => void
  onClearSelection: () => void
  title: string
  hint: string
  clearLabel: string
}

export function PartyBench(props: PartyBenchProps) {
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
                  'inline-flex min-h-12 items-center gap-2 rounded-full border px-3 py-2 text-left text-sm transition-transform',
                  props.armedPlayerId === player.id
                    ? 'border-(--color-accent) bg-(--color-accent) text-slate-950'
                    : 'border-white/10 bg-(--color-surface) text-(--color-fg) motion-safe:hover:-translate-y-0.5',
                )}
                draggable="true"
                data-testid={`bench-player-${player.id}`}
                onClick={() => props.onArmPlayer(player.id)}
                onDragStart={() => props.onDragPlayerStart(player.id)}
                onDragEnd={props.onDragPlayerEnd}
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
    </section>
  )
}
