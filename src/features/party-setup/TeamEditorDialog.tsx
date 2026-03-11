import clsx from 'clsx'
import { For } from 'solid-js'
import type { TeamColor } from '@/domain/types'
import { teamColorClasses, teamColorOptions, type TeamEditorDraft } from './party-setup.shared'
import { DialogActions, DialogCloseButton, DialogShell } from './PartyDialogPrimitives'

type TeamEditorDialogProps = {
  draft: TeamEditorDraft
  oppositeTeamColor: TeamColor
  title: string
  subtitle: string
  closeLabel: string
  nameFieldLabel: string
  teamColorsLabel: string
  applyLabel: string
  cancelLabel: string
  onNameInput: (name: string) => void
  onColorSelect: (color: TeamColor) => void
  onClose: () => void
  onApply: () => void
}

export function TeamEditorDialog(props: TeamEditorDialogProps) {
  return (
    <DialogShell closeLabel={props.closeLabel} onClose={props.onClose} testId="team-editor-dialog">
      <div class="flex-1 overflow-y-auto px-5 pb-6 pt-6 sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">{props.title}</p>
            <p class="mt-2 text-sm text-(--color-muted)">{props.subtitle}</p>
          </div>
          <DialogCloseButton closeLabel={props.closeLabel} onClose={props.onClose} />
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
                          ? 'border-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]'
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

      <DialogActions
        primaryLabel={props.applyLabel}
        secondaryLabel={props.cancelLabel}
        onPrimary={props.onApply}
        onSecondary={props.onClose}
      />
    </DialogShell>
  )
}
