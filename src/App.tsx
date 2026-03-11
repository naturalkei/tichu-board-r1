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
  getPathForRoute,
  type InGameRoute,
} from '@/shared/routes'

function AppContent() {
  const { state } = useGame()
  const [editingRoundId, setEditingRoundId] = createSignal<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false)
  const { route, navigate, syncRouteFromLocation } = useAppNavigation(() => state.hasStartedGame)
  const currentGameRoute = (): InGameRoute => (route() === 'start' ? 'party' : route()) as InGameRoute
  const isStartRoute = () => route() === 'start'

  useSwipeNavigation({ route, currentGameRoute, navigate: (nextRoute) => navigate(nextRoute) })

  onMount(() => {
    syncRouteFromLocation()
    window.addEventListener('popstate', syncRouteFromLocation)
  })

  onCleanup(() => {
    window.removeEventListener('popstate', syncRouteFromLocation)
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
            : 'min-h-screen gap-4 py-6 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] sm:py-8',
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
