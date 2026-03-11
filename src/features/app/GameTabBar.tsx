import clsx from 'clsx'
import { For } from 'solid-js'
import type { InGameRoute } from '@/shared/routes'
import { inGameRoutes } from '@/shared/routes'
import { useGame } from '@/state/game-context'

type GameTabBarProps = {
  activeRoute: InGameRoute
  onNavigate: (route: InGameRoute) => void
  onOpenSettings: () => void
}

const tabIcons: Record<InGameRoute | 'settings', string> = {
  party: 'M4 9.5H20M7.5 4V9.5M16.5 4V9.5M6 20H18A2 2 0 0 0 20 18V9.5H4V18A2 2 0 0 0 6 20Z',
  round: 'M12 3V21M3 12H21M5.5 5.5L18.5 18.5M18.5 5.5L5.5 18.5',
  results: 'M5 19V10M12 19V5M19 19V13',
  history: 'M12 7V12L15 15M4 12A8 8 0 1 0 6.34 6.34M4 4V9H9',
  settings:
    'M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5ZM19.4 15A1 1 0 0 0 19.6 16.1L19.7 16.2A1.2 1.2 0 0 1 18 17.9L17.9 17.8A1 1 0 0 0 16.8 17.6A1 1 0 0 0 16.2 18.5V18.8A1.2 1.2 0 0 1 13.8 18.8V18.7A1 1 0 0 0 13.2 17.8A1 1 0 0 0 12.1 17.9L12 18A1.2 1.2 0 0 1 10.3 16.3L10.4 16.2A1 1 0 0 0 10.6 15.1A1 1 0 0 0 9.7 14.5H9.4A1.2 1.2 0 0 1 9.4 12.1H9.5A1 1 0 0 0 10.4 11.5A1 1 0 0 0 10.2 10.4L10.1 10.3A1.2 1.2 0 0 1 11.8 8.6L11.9 8.7A1 1 0 0 0 13 8.9A1 1 0 0 0 13.6 8V7.7A1.2 1.2 0 0 1 16 7.7V7.8A1 1 0 0 0 16.6 8.7A1 1 0 0 0 17.7 8.5L17.8 8.4A1.2 1.2 0 0 1 19.5 10.1L19.4 10.2A1 1 0 0 0 19.2 11.3A1 1 0 0 0 20.1 11.9H20.4A1.2 1.2 0 0 1 20.4 14.3H20.3A1 1 0 0 0 19.4 15Z',
}

export function GameTabBar(props: GameTabBarProps) {
  const { t } = useGame()
  const tabs = () => [...inGameRoutes, 'settings'] as const

  return (
    <nav
      aria-label={t('nav.label')}
      class={clsx(
        'sticky bottom-4 z-20',
        'rounded-[1.8rem] border border-white/10',
        'bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)]',
        'p-2 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl',
      )}
    >
      <div class="grid grid-cols-5 gap-2">
        <For each={tabs()}>
          {(route) => (
            <button
              type="button"
              class={clsx(
                'flex min-h-16 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-2 py-2',
                'text-[11px] font-medium transition-colors',
                route !== 'settings' && props.activeRoute === route
                  ? 'bg-(--color-accent) text-slate-950'
                  : 'bg-black/10 text-(--color-fg)',
              )}
              aria-current={route !== 'settings' && props.activeRoute === route ? 'page' : undefined}
              aria-label={route === 'settings' ? t('settings.open') : t(`nav.${route}`)}
              onClick={() => {
                if (route === 'settings') {
                  props.onOpenSettings()
                  return
                }

                props.onNavigate(route)
              }}
            >
              <svg
                aria-hidden="true"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={tabIcons[route]}
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
              <span>{route === 'settings' ? t('nav.settings') : t(`nav.${route}`)}</span>
            </button>
          )}
        </For>
      </div>
    </nav>
  )
}
