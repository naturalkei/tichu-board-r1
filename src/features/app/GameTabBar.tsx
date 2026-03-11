import clsx from 'clsx'
import { For } from 'solid-js'
import type { InGameRoute } from '../../shared/routes'
import { inGameRoutes } from '../../shared/routes'
import { useGame } from '../../state/game-context'

type GameTabBarProps = {
  activeRoute: InGameRoute
  onNavigate: (route: InGameRoute) => void
}

export function GameTabBar(props: GameTabBarProps) {
  const { t } = useGame()

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
      <div class="grid grid-cols-4 gap-2">
        <For each={inGameRoutes}>
          {(route) => (
            <button
              type="button"
              class={clsx(
                'rounded-[1.2rem] px-3 py-3',
                'text-xs font-medium transition-colors',
                props.activeRoute === route
                  ? 'bg-(--color-accent) text-slate-950'
                  : 'bg-black/10 text-(--color-fg)',
              )}
              aria-current={props.activeRoute === route ? 'page' : undefined}
              onClick={() => props.onNavigate(route)}
            >
              {t(`nav.${route}`)}
            </button>
          )}
        </For>
      </div>
    </nav>
  )
}
