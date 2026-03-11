import type { ParentProps } from 'solid-js'
import { Portal } from 'solid-js/web'

export function DialogShell(props: ParentProps<{ closeLabel: string; onClose: () => void; testId: string }>) {
  return (
    <Portal>
      <div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/82 p-0 backdrop-blur-md sm:items-center sm:p-6">
        <button
          type="button"
          class="absolute inset-0"
          aria-label={props.closeLabel}
          onClick={() => props.onClose()}
        />
        <div
          role="dialog"
          aria-modal="true"
          class="relative z-10 flex h-dvh max-h-dvh w-full flex-col overflow-hidden border-white/12 bg-[color-mix(in_srgb,var(--color-surface)_98%,#020617)] shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:h-auto sm:max-h-[min(100dvh-3rem,42rem)] sm:max-w-md sm:rounded-4xl sm:border"
          data-testid={props.testId}
        >
          {props.children}
        </div>
      </div>
    </Portal>
  )
}

export function DialogCloseButton(props: { closeLabel: string; onClose: () => void; size?: 'md' | 'lg' }) {
  return (
    <button
      type="button"
      class={
        props.size === 'lg'
          ? 'inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/24 text-(--color-fg)'
          : 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-(--color-fg)'
      }
      aria-label={props.closeLabel}
      onClick={() => props.onClose()}
    >
      <svg
        aria-hidden="true"
        class={props.size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={props.size === 'lg' ? '2.4' : '2'}
        />
      </svg>
    </button>
  )
}

export function DialogActions(props: {
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
