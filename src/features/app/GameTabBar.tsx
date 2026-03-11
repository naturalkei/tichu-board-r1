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
          <rect x="5" y="5" width="14" height="14" rx="4.5" stroke="currentColor" stroke-width={props.active ? '2.4' : '2.2'} />
          <circle cx="8.4" cy="8.4" r="1.35" fill="currentColor" />
          <circle cx="15.6" cy="8.4" r="1.35" fill="currentColor" />
          <circle cx="8.4" cy="15.6" r="1.35" fill="currentColor" />
          <circle cx="15.6" cy="15.6" r="1.35" fill="currentColor" />
        </>
      ) : null}
      {props.route === 'round' ? (
        <>
          <path
            d="M8 4.8H15.2L19 8.6V17.2C19 18.3 18.1 19.2 17 19.2H8C6.9 19.2 6 18.3 6 17.2V6.8C6 5.7 6.9 4.8 8 4.8Z"
            stroke="currentColor"
            stroke-width={props.active ? '2.3' : '2.1'}
            stroke-linejoin="round"
          />
          <path d="M14.8 4.8V8.2H18.2" stroke="currentColor" stroke-width={props.active ? '2.3' : '2.1'} stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 10V15.2M9.4 12.6H14.6" stroke="currentColor" stroke-width={props.active ? '2.6' : '2.3'} stroke-linecap="round" />
        </>
      ) : null}
      {props.route === 'results' ? (
        <>
          <path d="M6.5 18.5V12.8" stroke="currentColor" stroke-width={props.active ? '2.8' : '2.4'} stroke-linecap="round" />
          <path d="M12 18.5V8.8" stroke="currentColor" stroke-width={props.active ? '2.8' : '2.4'} stroke-linecap="round" />
          <path d="M17.5 18.5V5.8" stroke="currentColor" stroke-width={props.active ? '2.8' : '2.4'} stroke-linecap="round" />
          <path d="M5 18.5H19" stroke="currentColor" stroke-width={props.active ? '2.1' : '1.9'} stroke-linecap="round" />
        </>
      ) : null}
      {props.route === 'history' ? (
        <>
          <circle cx="12" cy="12.2" r="6.6" stroke="currentColor" stroke-width={props.active ? '2.4' : '2.1'} />
          <path d="M12 9.2V12.4L14.2 14.2" stroke="currentColor" stroke-width={props.active ? '2.5' : '2.2'} stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8 4.7H5.7V7" stroke="currentColor" stroke-width={props.active ? '2.2' : '2'} stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {props.route === 'settings' ? (
        <>
          <circle cx="12" cy="12" r="3.1" stroke="currentColor" stroke-width="2.1" />
          <path
            d="M12 4.6V6.2M12 17.8V19.4M19.4 12H17.8M6.2 12H4.6M17.3 6.7L16.1 7.9M7.9 16.1L6.7 17.3M17.3 17.3L16.1 16.1M7.9 7.9L6.7 6.7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </>
      ) : null}
    </svg>
  )
}
