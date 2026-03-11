import { For } from 'solid-js'
import type { EditorDraft } from './party-setup.shared'
import { DialogActions, DialogCloseButton, DialogShell } from './PartyDialogPrimitives'

type PlayerEditorDialogProps = {
  draft: EditorDraft
  errorMessage: string
  recentNames: string[]
  title: string
  subtitle: string
  nameFieldLabel: string
  quickActionsLabel: string
  rerollLabel: string
  moveSeatLabel: string
  closeLabel: string
  applyLabel: string
  cancelLabel: string
  onNameInput: (name: string) => void
  onRecentNameClick: (name: string) => void
  onReroll: () => void
  onMoveSeat: () => void
  onClose: () => void
  onApply: () => void
}

export function PlayerEditorDialog(props: PlayerEditorDialogProps) {
  return (
    <DialogShell closeLabel={props.closeLabel} onClose={props.onClose} testId="party-editor-dialog">
      <div class="flex-1 overflow-y-auto px-5 pb-6 pt-6 sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">{props.title}</p>
            <p class="mt-2 text-sm text-(--color-muted)">{props.subtitle}</p>
          </div>
          <DialogCloseButton closeLabel={props.closeLabel} onClose={props.onClose} />
        </div>

        <div class="mt-5 grid gap-4">
          <label class="grid gap-2 text-sm">
            <span class="text-(--color-muted)">{props.nameFieldLabel}</span>
            <input
              class="w-full rounded-2xl border border-white/14 bg-slate-950/85 px-4 py-3 text-(--color-fg) outline-none placeholder:text-(--color-muted) focus:border-(--color-accent)"
              value={props.draft.name}
              onInput={(event) => props.onNameInput(event.currentTarget.value)}
            />
          </label>

          <div class="grid gap-2">
            <span class="text-sm text-(--color-muted)">{props.quickActionsLabel}</span>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-full border border-white/12 bg-slate-950/85 px-3 py-2 text-sm text-(--color-fg)"
                onClick={() => props.onReroll()}
              >
                {props.rerollLabel}
              </button>
              <button
                type="button"
                class="rounded-full border border-white/12 bg-slate-950/85 px-3 py-2 text-sm text-(--color-fg)"
                onClick={() => props.onMoveSeat()}
              >
                {props.moveSeatLabel}
              </button>
              <For each={props.recentNames}>
                {(name) => (
                  <button
                    type="button"
                    class="rounded-full border border-dashed border-white/14 bg-slate-950/80 px-3 py-2 text-sm text-(--color-fg) opacity-70"
                    onClick={() => props.onRecentNameClick(name)}
                  >
                    {name}
                  </button>
                )}
              </For>
            </div>
          </div>

          {props.errorMessage ? (
            <p class="rounded-2xl border border-rose-300/35 bg-rose-300/10 px-4 py-3 text-sm text-rose-50">
              {props.errorMessage}
            </p>
          ) : null}
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
