import clsx from 'clsx'
import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { ApplicationControlBar } from '@/features/app/ApplicationControlBar'
import { GameTabBar } from '@/features/app/GameTabBar'
import { GameplayPages } from '@/features/app/GameplayPages'
import { useAppNavigation } from '@/features/app/use-app-navigation'
import { useSwipeNavigation } from '@/features/app/use-swipe-navigation'
import { LandingScreen } from '@/features/landing/LandingScreen'
import { GlobalScoreSummary } from '@/features/scoreboard/Scoreboard'
import { SettingsDialog } from '@/features/settings/SettingsDialog'
import { GameProvider, useGame } from '@/state/game-context'
import {
  getDefaultRoute,
  inGameRoutes,
  isInGameRoute,
  getPathForRoute,
  type InGameRoute,
} from '@/shared/routes'

type PageTransitionDirection = 'forward' | 'backward' | 'none'

type BottomDockRecoveryInput = {
  currentTop: number
  viewportHeight: number
  documentHeight: number
  footerHeight: number
  creditPeek?: number
}

export function getBottomDockRecoveryTarget(input: BottomDockRecoveryInput) {
  const creditPeek = input.creditPeek ?? 18
  const distanceFromBottom = input.documentHeight - (input.currentTop + input.viewportHeight)

  if (input.footerHeight === 0 || distanceFromBottom > input.footerHeight) {
    return null
  }

  const targetTop = Math.max(
    0,
    input.documentHeight - input.viewportHeight - Math.max(input.footerHeight - creditPeek, 0),
  )

  return Math.abs(targetTop - input.currentTop) < 8 ? null : targetTop
}

function AppContent() {
  const { state, t } = useGame()
  const [editingRoundId, setEditingRoundId] = createSignal<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false)
  const [pageTransitionDirection, setPageTransitionDirection] = createSignal<PageTransitionDirection>('none')
  const [pageTransitionKey, setPageTransitionKey] = createSignal(0)
  const { route, navigate, syncRouteFromLocation } = useAppNavigation(() => state.hasStartedGame)
  const currentGameRoute = (): InGameRoute => (route() === 'start' ? 'party' : route()) as InGameRoute
  const isStartRoute = () => route() === 'start'
  let creditFooterRef: HTMLDivElement | undefined
  let handleRelease: (() => void) | undefined

  useSwipeNavigation({ route, currentGameRoute, navigate: (nextRoute) => navigate(nextRoute) })

  onMount(() => {
    const recoverDockVisibility = () => {
      if (typeof window === 'undefined' || isStartRoute()) {
        return
      }

      const footerHeight = creditFooterRef?.offsetHeight ?? 0

      if (footerHeight === 0) {
        return
      }

      const documentHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const currentTop = window.scrollY
      const targetTop = getBottomDockRecoveryTarget({
        currentTop,
        viewportHeight,
        documentHeight,
        footerHeight,
      })
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (targetTop === null) {
        return
      }

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }

    handleRelease = () => {
      window.setTimeout(recoverDockVisibility, 24)
    }

    syncRouteFromLocation()
    window.addEventListener('popstate', syncRouteFromLocation)
    window.addEventListener('pointerup', handleRelease)
    window.addEventListener('touchend', handleRelease)
  })

  onCleanup(() => {
    window.removeEventListener('popstate', syncRouteFromLocation)
    if (handleRelease) {
      window.removeEventListener('pointerup', handleRelease)
      window.removeEventListener('touchend', handleRelease)
    }
  })

  createEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const expectedPath = getPathForRoute(route())

    if (window.location.pathname !== expectedPath) {
      navigate(route(), { replace: true })
    }
  })

  createEffect((previousRoute?: string) => {
    const nextRoute = route()

    if (
      previousRoute &&
      isInGameRoute(previousRoute as typeof nextRoute) &&
      isInGameRoute(nextRoute) &&
      previousRoute !== nextRoute
    ) {
      const previousIndex = inGameRoutes.indexOf(previousRoute as InGameRoute)
      const nextIndex = inGameRoutes.indexOf(nextRoute)
      setPageTransitionDirection(nextIndex > previousIndex ? 'forward' : 'backward')
      setPageTransitionKey((current) => current + 1)
    }

    return nextRoute
  })

  return (
    <main
      class={clsx(
        'bg-(--color-bg) text-(--color-fg)',
        isStartRoute() ? 'h-dvh overflow-hidden' : 'min-h-screen',
      )}
      data-testid="app-shell"
    >
      <section
        class={clsx(
          'mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8',
          isStartRoute()
            ? 'h-dvh overflow-hidden py-4 sm:py-5'
            : 'min-h-screen gap-4 py-6 pb-[calc(env(safe-area-inset-bottom)+4.75rem)] sm:py-8',
        )}
      >
        <Show
          when={!isStartRoute()}
          fallback={<LandingScreen onEnterGame={() => navigate(getDefaultRoute(true))} />}
        >
          <GlobalScoreSummary />

          <div class="min-h-[calc(100vh-15rem)]" data-testid={`page-${route()}`}>
            <GameplayPages
              route={currentGameRoute()}
              transitionDirection={pageTransitionDirection()}
              transitionKey={pageTransitionKey()}
              editingRoundId={editingRoundId()}
              onEditingRoundIdChange={setEditingRoundId}
              onEditRound={(roundId) => {
                setEditingRoundId(roundId)
                navigate('round')
              }}
            />
          </div>
          
          <ApplicationControlBar />

          <GameTabBar
            activeRoute={currentGameRoute()}
            onNavigate={navigate}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          <div
            ref={creditFooterRef}
            data-testid="bottom-credit"
            class="flex min-h-[calc(env(safe-area-inset-bottom)+2.75rem)] items-end justify-center pb-[calc(env(safe-area-inset-bottom)+0.2rem)] pt-1"
          >
            <p class="text-[10px] font-medium uppercase tracking-[0.18em] text-(--color-muted)/70">
              {t('app.credit')}
            </p>
          </div>

          <SettingsDialog
            isOpen={isSettingsOpen()}
            onClose={() => setIsSettingsOpen(false)}
            onShowLanding={() => navigate('start')}
          />
        </Show>
      </section>
    </main>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
