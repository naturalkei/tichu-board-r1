import clsx from 'clsx'
import { For } from 'solid-js'
import type { TeamColor } from '@/domain/types'
import { teamColorClasses, teamColorOptions, type TeamEditorDraft } from './party-setup.shared'
import { DialogCloseButton, DialogShell } from './PartyDialogPrimitives'

type TeamEditorDialogProps = {
  draft: TeamEditorDraft
  oppositeTeamColor: TeamColor
  title: string
  subtitle: string
  closeLabel: string
  nameFieldLabel: string
  teamColorsLabel: string
  onNameInput: (name: string) => void
  onColorSelect: (color: TeamColor) => void
  onClose: () => void
}

export function TeamEditorDialog(props: TeamEditorDialogProps) {
  const selectedColors = () => teamColorClasses[props.draft.color]

  return (
    <DialogShell closeLabel={props.closeLabel} onClose={props.onClose} testId="team-editor-dialog">
      <div class="flex-1 overflow-y-auto px-5 pb-6 pt-6 sm:p-5">
        <div
          class={clsx(
            'rounded-[1.6rem] border p-4 transition-colors duration-150',
            selectedColors().surface,
            selectedColors().ring,
          )}
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-2.5 py-1">
                <span class={clsx('h-3.5 w-3.5 rounded-full ring-2 ring-white/30', selectedColors().chip)} />
                <span class="text-[10px] uppercase tracking-[0.18em] text-(--color-muted)">{props.title}</span>
              </div>
              <p class="mt-3 text-base font-semibold tracking-[-0.02em] text-(--color-fg)">{props.subtitle}</p>
            </div>
            <DialogCloseButton closeLabel={props.closeLabel} onClose={props.onClose} size="lg" />
          </div>
        </div>

        <div class="mt-5 grid gap-5">
          <label class="grid gap-2 text-sm">
            <span class="text-(--color-muted)">{props.nameFieldLabel}</span>
            <input
              class="w-full rounded-2xl border border-white/14 bg-slate-950/85 px-4 py-3 text-(--color-fg) outline-none placeholder:text-(--color-muted) focus:border-(--color-accent)"
              value={props.draft.name}
              onInput={(event) => props.onNameInput(event.currentTarget.value)}
              data-testid={`team-editor-name-${props.draft.teamId}`}
            />
          </label>

          <div class="grid gap-3">
            <span class="text-sm text-(--color-muted)">{props.teamColorsLabel}</span>
            <div class="grid grid-cols-4 gap-2">
              <For each={teamColorOptions}>
                {(color) => {
                  const isDisabled = () => color !== props.draft.color && color === props.oppositeTeamColor

                  return (
                    <button
                      type="button"
                      class={clsx(
                        'grid gap-2 rounded-2xl border p-3 text-left transition-transform',
                        teamColorClasses[color].chip,
                        props.draft.color === color
                          ? 'scale-[1.02] border-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_16px_32px_rgba(255,255,255,0.08)]'
                          : 'border-transparent',
                        isDisabled() ? 'cursor-not-allowed opacity-30' : 'motion-safe:hover:-translate-y-0.5',
                      )}
                      aria-disabled={isDisabled()}
                      aria-pressed={props.draft.color === color}
                      disabled={isDisabled()}
                      data-testid={`team-editor-color-${color}`}
                      onClick={() => props.onColorSelect(color)}
                    >
                      <span class="h-3 w-8 rounded-full bg-black/20" />
                      <span class="text-[11px] font-semibold uppercase tracking-[0.18em]">{color}</span>
                    </button>
                  )
                }}
              </For>
            </div>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 border-t border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 sm:px-5 sm:pb-5">
        <button
          type="button"
          class="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm text-(--color-fg)"
          onClick={() => props.onClose()}
        >
          {props.closeLabel}
        </button>
      </div>
    </DialogShell>
  )
}
