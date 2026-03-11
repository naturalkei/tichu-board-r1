import clsx from 'clsx'
import { For } from 'solid-js'
import type { TeamColor, TeamId } from '@/domain/types'
import { teamColorClasses, teamColorOptions } from './party-setup.shared'

type TeamSetupCardProps = {
  teamId: TeamId
  label: string
  subtitle: string
  selectedColor: TeamColor
  oppositeColor: TeamColor
  editLabel: string
  onOpenEditor: (teamId: TeamId) => void
}

export function TeamSetupCard(props: TeamSetupCardProps) {
  return (
    <button
      type="button"
      class={clsx(
        'w-full rounded-3xl bg-transparent text-left transition-transform motion-safe:hover:-translate-y-0.5',
        teamColorClasses[props.selectedColor].ring,
        teamColorClasses[props.selectedColor].glow,
      )}
      data-testid={`team-name-${props.teamId}`}
      onClick={() => props.onOpenEditor(props.teamId)}
    >
      <div
        class={clsx(
          'grid gap-2.5 rounded-[1.15rem] border-l-[6px] bg-linear-to-br px-3 py-2.5',
          teamColorClasses[props.selectedColor].surface,
          {
            'border-l-amber-300': props.selectedColor === 'amber',
            'border-l-sky-300': props.selectedColor === 'sky',
            'border-l-emerald-300': props.selectedColor === 'emerald',
            'border-l-rose-300': props.selectedColor === 'rose',
            'border-l-violet-300': props.selectedColor === 'violet',
            'border-l-teal-300': props.selectedColor === 'teal',
            'border-l-orange-300': props.selectedColor === 'orange',
          },
        )}
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="truncate text-base font-semibold tracking-[-0.02em] text-(--color-fg)" data-testid={`team-label-${props.teamId}`}>
              {props.label}
            </p>
            <p class="mt-1 truncate text-[11px] leading-5 text-(--color-muted)">{props.subtitle}</p>
          </div>
          <span class="shrink-0 rounded-full bg-black/18 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-(--color-muted)">
            {props.editLabel}
          </span>
        </div>

        <div class="grid gap-2 rounded-2xl bg-black/12 px-2.5 py-2">
          <div class="flex min-w-0 items-center gap-2">
            <span class={clsx('h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white/30', teamColorClasses[props.selectedColor].chip)} />
            <span class="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-(--color-muted)">
              Active color
            </span>
          </div>

          <div class="flex min-w-0 flex-wrap items-center gap-1.5">
            <For each={teamColorOptions}>
              {(color) => (
                <span
                  class={clsx(
                    'h-3.5 w-3.5 rounded-full border border-white/10 ring-1 ring-transparent',
                    teamColorClasses[color].chip,
                    props.selectedColor === color && 'scale-110 border-white/50 ring-white/50',
                    props.selectedColor !== color && props.oppositeColor === color && 'opacity-25',
                  )}
                />
              )}
            </For>
          </div>
        </div>
      </div>
    </button>
  )
}

export function TeamBadge(props: { color: TeamColor }) {
  return <span class={clsx('h-3 w-3 rounded-full', teamColorClasses[props.color].chip)} />
}
