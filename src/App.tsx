import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { ApplicationControlBar } from './features/app/ApplicationControlBar'
import { GameTabBar } from './features/app/GameTabBar'
import { GameplayPages } from './features/app/GameplayPages'
import { LandingScreen } from './features/landing/LandingScreen'
import { SettingsDialog } from './features/settings/SettingsDialog'
import { GameProvider, useGame } from './state/game-context'
import {
  getAdjacentRoute,
  getDefaultRoute,
  getHashForRoute,
  getRouteFromHash,
  isInGameRoute,
  type AppRoute,
  type InGameRoute,
} from './shared/routes'

function AppContent() {
  const { state } = useGame()
  const [editingRoundId, setEditingRoundId] = createSignal<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false)
  const [route, setRoute] = createSignal<AppRoute>(resolveInitialRoute(state.hasStartedGame))
  const currentGameRoute = (): InGameRoute => (route() === 'start' ? 'party' : route()) as InGameRoute

  let touchStartX = 0
  let touchStartY = 0
  let swipeEnabled = false

  const syncRouteFromLocation = () => {
    setRoute(getRouteFromHash(window.location.hash, state.hasStartedGame))
  }

  const navigate = (nextRoute: AppRoute, options?: { replace?: boolean }) => {
    const nextHash = getHashForRoute(nextRoute)

    if (window.location.hash !== nextHash) {
      if (options?.replace) {
        window.history.replaceState(null, '', nextHash)
      } else {
        window.history.pushState(null, '', nextHash)
      }
    }

    setRoute(nextRoute)
  }

  const handleSwipeStart = (event: TouchEvent) => {
    const target = event.target

    swipeEnabled =
      target instanceof HTMLElement &&
      !target.closest('button, input, select, textarea, label, a, [role="dialog"]')

    if (!swipeEnabled) {
      return
    }

    touchStartX = event.changedTouches[0]?.clientX ?? 0
    touchStartY = event.changedTouches[0]?.clientY ?? 0
  }

  const handleSwipeEnd = (event: TouchEvent) => {
    if (!swipeEnabled || !isInGameRoute(route())) {
      return
    }

    const touch = event.changedTouches[0]

    if (!touch) {
      return
    }

    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY

    swipeEnabled = false

    if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return
    }

    navigate(getAdjacentRoute(currentGameRoute(), deltaX < 0 ? 'next' : 'previous'))
  }

  onMount(() => {
    syncRouteFromLocation()
    window.addEventListener('hashchange', syncRouteFromLocation)
    window.addEventListener('touchstart', handleSwipeStart, { passive: true })
    window.addEventListener('touchend', handleSwipeEnd, { passive: true })
  })

  onCleanup(() => {
    window.removeEventListener('hashchange', syncRouteFromLocation)
    window.removeEventListener('touchstart', handleSwipeStart)
    window.removeEventListener('touchend', handleSwipeEnd)
  })

  createEffect(() => {
    if (!state.hasStartedGame && route() !== 'start') {
      navigate('start', { replace: true })
      return
    }

    if (state.hasStartedGame && route() === 'start') {
      navigate(getDefaultRoute(true), { replace: true })
    }
  })

  return (
    <main class="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] sm:px-6 sm:py-8 lg:px-8">
        <Show when={state.hasStartedGame} fallback={<LandingScreen />}>
          <ApplicationControlBar onOpenSettings={() => setIsSettingsOpen(true)} />

          <div class="min-h-[calc(100vh-15rem)]" data-testid={`page-${route()}`}>
            <GameplayPages
              route={currentGameRoute()}
              editingRoundId={editingRoundId()}
              onEditingRoundIdChange={setEditingRoundId}
              onEditRound={(roundId) => {
                setEditingRoundId(roundId)
                navigate('round')
              }}
            />
          </div>

          <GameTabBar activeRoute={currentGameRoute()} onNavigate={navigate} />

          <SettingsDialog
            isOpen={isSettingsOpen()}
            onClose={() => setIsSettingsOpen(false)}
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

function resolveInitialRoute(hasStartedGame: boolean): AppRoute {
  if (typeof window === 'undefined') {
    return getDefaultRoute(hasStartedGame)
  }

  return getRouteFromHash(window.location.hash, hasStartedGame)
}

export default App
