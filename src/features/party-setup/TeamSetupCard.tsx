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
        'rounded-3xl border bg-black/10 p-3 text-left transition-transform motion-safe:hover:-translate-y-0.5',
        teamColorClasses[props.selectedColor].ring,
        teamColorClasses[props.selectedColor].glow,
      )}
      data-testid={`team-name-${props.teamId}`}
      onClick={() => props.onOpenEditor(props.teamId)}
    >
      <div
        class={clsx(
          'grid gap-3 rounded-[1.15rem] bg-linear-to-br p-1.5',
          teamColorClasses[props.selectedColor].surface,
        )}
      >
        <div>
          <p class="text-sm font-medium text-(--color-fg)" data-testid={`team-label-${props.teamId}`}>
            {props.label}
          </p>
          <p class="mt-1 text-[11px] text-(--color-muted)">{props.subtitle}</p>
        </div>
        <div class="flex items-center justify-between gap-3">
          <div class="grid grid-cols-4 gap-1.5">
            <For each={teamColorOptions}>
              {(color) => (
                <span
                  class={clsx(
                    'h-3 w-3 rounded-full border border-white/10',
                    teamColorClasses[color].chip,
                    props.selectedColor === color && 'scale-110 border-white/50',
                    props.selectedColor !== color && props.oppositeColor === color && 'opacity-25',
                  )}
                />
              )}
            </For>
          </div>
          <span class="text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">{props.editLabel}</span>
        </div>
      </div>
    </button>
  )
}

export function TeamBadge(props: { color: TeamColor }) {
  return <span class={clsx('h-3 w-3 rounded-full', teamColorClasses[props.color].chip)} />
}
