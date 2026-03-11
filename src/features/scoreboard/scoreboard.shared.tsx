import clsx from 'clsx'

export function Banner(props: { children: string; tone: 'amber' | 'emerald' }) {
  return (
    <div
      class={clsx(
        'rounded-3xl border px-4 py-3 text-sm',
        props.tone === 'amber'
          ? 'border-amber-300/35 bg-amber-300/10 text-amber-50'
          : 'border-emerald-300/35 bg-emerald-300/10 text-emerald-50',
      )}
    >
      {props.children}
    </div>
  )
}

export function ActionButton(props: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      class="rounded-full border border-white/10 px-3 py-2 text-xs text-(--color-fg)"
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  )
}

export function formatElapsedMs(value: number) {
  const totalSeconds = Math.max(0, Math.floor(value / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}
