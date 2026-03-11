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
