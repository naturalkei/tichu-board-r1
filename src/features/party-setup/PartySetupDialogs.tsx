import clsx from 'clsx'
import { For, type ParentProps } from 'solid-js'
import type { TeamColor } from '@/domain/types'
import { teamColorClasses, teamColorOptions, type EditorDraft, type TeamEditorDraft } from './party-setup.shared'

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

function DialogCloseButton(props: { closeLabel: string; onClose: () => void }) {
  return (
    <button
      type="button"
      class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-(--color-fg)"
      aria-label={props.closeLabel}
      onClick={() => props.onClose()}
    >
      ×
    </button>
  )
}

function DialogShell(props: ParentProps<{ closeLabel: string; onClose: () => void; testId: string }>) {
  return (
    <div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/82 p-0 backdrop-blur-md sm:items-center sm:p-6">
      <button
        type="button"
        class="absolute inset-0"
        aria-label={props.closeLabel}
        onClick={() => props.onClose()}
      />
      <div
        class="relative z-10 flex h-dvh max-h-dvh w-full flex-col overflow-hidden border-white/12 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:h-auto sm:max-h-[min(100dvh-3rem,42rem)] sm:max-w-md sm:rounded-4xl sm:border"
        data-testid={props.testId}
      >
        {props.children}
      </div>
    </div>
  )
}

function DialogActions(props: {
  primaryLabel: string
  secondaryLabel: string
  onPrimary: () => void
  onSecondary: () => void
}) {
  return (
    <div class="sticky bottom-0 flex gap-3 border-t border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 sm:px-5 sm:pb-5">
      <button
        type="button"
        class="flex-1 rounded-2xl bg-(--color-accent) px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={() => props.onPrimary()}
      >
        {props.primaryLabel}
      </button>
      <button
        type="button"
        class="rounded-2xl border border-white/10 px-4 py-3 text-sm text-(--color-fg)"
        onClick={() => props.onSecondary()}
      >
        {props.secondaryLabel}
      </button>
    </div>
  )
}
