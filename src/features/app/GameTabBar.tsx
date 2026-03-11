import type { InGameRoute } from '@/shared/routes'
import { inGameRoutes } from '@/shared/routes'
import { useGame } from '@/state/game-context'
import clsx from 'clsx'
import { For } from 'solid-js'

type GameTabBarProps = {
  activeRoute: InGameRoute
  onNavigate: (route: InGameRoute) => void
  onOpenSettings: () => void
}

const tabButtonBaseClass =
  'group relative flex aspect-square min-w-0 items-center justify-center rounded-3xl p-1.5 text-center transition-all duration-200 ease-out'

const tabLabelClass =
  'pointer-events-none absolute bottom-1.5 left-1/2 max-w-[90%] -translate-x-1/2 truncate text-[8px] font-semibold uppercase tracking-[0.14em] text-current/68 transition-opacity duration-200'

export function GameTabBar(props: GameTabBarProps) {
  const { t } = useGame()
  const tabs = () => [...inGameRoutes, 'settings'] as const

  return (
    <nav
      aria-label={t('nav.label')}
      data-testid="game-tab-bar"
      class={clsx(
        'sticky bottom-4 z-20',
        'rounded-4xl border border-white/10',
        'bg-[color-mix(in_srgb,var(--color-surface)_84%,transparent)]',
        'px-1.5 py-1.5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl',
      )}
    >
      <div class="grid grid-cols-5 gap-2" data-testid="game-tab-grid">
        <For each={tabs()}>
          {(route) => (
            <button
              type="button"
              data-testid={`game-tab-${route}`}
              class={clsx(
                tabButtonBaseClass,
                'border border-white/8 bg-black/14 text-(--color-fg)',
                route !== 'settings' && props.activeRoute === route
                  ? 'border-amber-100/60 bg-[linear-gradient(180deg,rgba(255,191,105,1),rgba(255,154,81,0.94))] text-[#1c1203] shadow-[0_0_0_1px_rgba(255,240,204,0.32),0_18px_34px_rgba(255,191,105,0.38)] ring-2 ring-amber-100/34'
                  : 'motion-safe:hover:-translate-y-0.5 motion-safe:hover:bg-black/18 dark:border-white/10 dark:bg-white/5',
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
              <div
                class={clsx(
                  'grid h-full w-full place-items-center rounded-[1.35rem] pb-3 transition-all duration-200',
                  // route !== 'settings' && props.activeRoute === route
                  //   ? 'bg-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]'
                  //   : 'bg-white/4 group-hover:bg-white/7',
                )}
              >
                <TabGlyph
                  route={route}
                  active={route !== 'settings' && props.activeRoute === route}
                  class={clsx(
                    'h-11 w-11 transition-transform duration-200',
                    route === 'settings' ? 'h-10.5 w-10.5' : '',
                    route !== 'settings' && props.activeRoute === route
                      ? 'scale-108'
                      : 'text-current/90 group-active:scale-95',
                  )}
                />
              </div>
              <span class={clsx(
                tabLabelClass,
                route !== 'settings' && props.activeRoute === route ? 'opacity-100' : 'opacity-68',
              )}>
                {route === 'settings' ? t('nav.settings') : t(`nav.${route}`)}
              </span>
            </button>
          )}
        </For>
      </div>
    </nav>
  )
}

function TabGlyph(props: { route: InGameRoute | 'settings'; active: boolean; class?: string }) {
  const primaryStroke = () => (props.active ? '2.05' : '1.8')
  const accentStroke = () => (props.active ? '2.25' : '2')

  return (
    <svg
      aria-hidden="true"
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.route === 'party' ? (
        <>
          <circle cx="12" cy="6.9" r="2.1" stroke="currentColor" stroke-width={primaryStroke()} />
          <circle cx="17.1" cy="12" r="2.1" stroke="currentColor" stroke-width={primaryStroke()} />
          <circle cx="12" cy="17.1" r="2.1" stroke="currentColor" stroke-width={primaryStroke()} />
          <circle cx="6.9" cy="12" r="2.1" stroke="currentColor" stroke-width={primaryStroke()} />
          <path d="M12 9.2V14.8M9.2 12H14.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </>
      ) : null}
      {props.route === 'round' ? (
        <>
          <circle cx="12" cy="12" r="6.2" stroke="currentColor" stroke-width={primaryStroke()} />
          <path d="M12 8.7V15.3M8.7 12H15.3" stroke="currentColor" stroke-width={accentStroke()} stroke-linecap="round" />
        </>
      ) : null}
      {props.route === 'results' ? (
        <>
          <rect x="5.7" y="11.8" width="3" height="6.2" rx="1.1" stroke="currentColor" stroke-width={primaryStroke()} />
          <rect x="10.5" y="8.8" width="3" height="9.2" rx="1.1" stroke="currentColor" stroke-width={primaryStroke()} />
          <rect x="15.3" y="5.8" width="3" height="12.2" rx="1.1" stroke="currentColor" stroke-width={primaryStroke()} />
        </>
      ) : null}
      {props.route === 'history' ? (
        <>
          <path
            d="M7 10.2A5.9 5.9 0 1 1 8.7 16.9"
            stroke="currentColor"
            stroke-width={primaryStroke()}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M6.9 7.2V10.3H10" stroke="currentColor" stroke-width={primaryStroke()} stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 9.7V12.1L14.4 12.1" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {props.route === 'settings' ? (
        <>
          <path d="M6 9H18" stroke="currentColor" stroke-width={primaryStroke()} stroke-linecap="round" />
          <path d="M6 15H18" stroke="currentColor" stroke-width={primaryStroke()} stroke-linecap="round" />
          <circle cx="9" cy="9" r="2.1" fill="var(--color-surface)" stroke="currentColor" stroke-width={primaryStroke()} />
          <circle cx="15" cy="15" r="2.1" fill="var(--color-surface)" stroke="currentColor" stroke-width={primaryStroke()} />
        </>
      ) : null}
    </svg>
  )
}
