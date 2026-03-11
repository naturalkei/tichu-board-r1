import clsx from 'clsx'
import { BrandLogo } from '../../shared/BrandLogo'
import { useGame } from '../../state/game-context'

type ApplicationControlBarProps = {
  onOpenSettings: () => void
}

export function ApplicationControlBar(props: ApplicationControlBarProps) {
  const { t } = useGame()

  return (
    <header
      class={clsx(
        'sticky top-4 z-20',
        'rounded-[1.8rem] border border-white/10',
        'bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)]',
        'p-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl',
        'motion-safe:animate-[fade-in_220ms_ease-out]',
      )}
    >
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
          <BrandLogo class="h-8 w-8" />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-semibold tracking-[0.08em] text-(--color-fg)">
              {t('app.title')}
            </p>
            <span
              class={clsx(
                'rounded-full border border-white/10 bg-white/8',
                'px-2 py-0.5 text-[10px] uppercase tracking-[0.22em]',
                'text-(--color-accent)',
              )}
            >
              {t('app.badge')}
            </span>
          </div>
          <p class="mt-1 truncate text-xs text-(--color-muted)">{t('app.controlSubtitle')}</p>
        </div>

        <button
          type="button"
          class={clsx(
            'inline-flex h-11 min-w-11 items-center justify-center rounded-full',
            'border border-white/10 bg-slate-950/35 px-4',
            'text-sm font-medium text-(--color-fg)',
            'transition-transform duration-200 ease-out',
            'motion-safe:hover:-translate-y-0.5',
          )}
          aria-label={t('settings.open')}
          onClick={() => props.onOpenSettings()}
        >
          <svg
            aria-hidden="true"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            />
            <path
              d="M19.4 15A1 1 0 0 0 19.6 16.1L19.7 16.2A1.2 1.2 0 0 1 18 17.9L17.9 17.8A1 1 0 0 0 16.8 17.6A1 1 0 0 0 16.2 18.5V18.8A1.2 1.2 0 0 1 13.8 18.8V18.7A1 1 0 0 0 13.2 17.8A1 1 0 0 0 12.1 17.9L12 18A1.2 1.2 0 0 1 10.3 16.3L10.4 16.2A1 1 0 0 0 10.6 15.1A1 1 0 0 0 9.7 14.5H9.4A1.2 1.2 0 0 1 9.4 12.1H9.5A1 1 0 0 0 10.4 11.5A1 1 0 0 0 10.2 10.4L10.1 10.3A1.2 1.2 0 0 1 11.8 8.6L11.9 8.7A1 1 0 0 0 13 8.9A1 1 0 0 0 13.6 8V7.7A1.2 1.2 0 0 1 16 7.7V7.8A1 1 0 0 0 16.6 8.7A1 1 0 0 0 17.7 8.5L17.8 8.4A1.2 1.2 0 0 1 19.5 10.1L19.4 10.2A1 1 0 0 0 19.2 11.3A1 1 0 0 0 20.1 11.9H20.4A1.2 1.2 0 0 1 20.4 14.3H20.3A1 1 0 0 0 19.4 15Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
