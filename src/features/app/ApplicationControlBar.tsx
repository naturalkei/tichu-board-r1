import clsx from 'clsx'
import { BrandLogo } from '@/shared/BrandLogo'
import { useGame } from '@/state/game-context'

export function ApplicationControlBar() {
  const { t } = useGame()

  return (
    <header
      class={clsx(
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
      </div>
    </header>
  )
}
