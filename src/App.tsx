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
  type InGameRoute,
} from '@/shared/routes'

function AppContent() {
  const { state } = useGame()
  const [editingRoundId, setEditingRoundId] = createSignal<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false)
  const { route, navigate, syncRouteFromLocation } = useAppNavigation(() => state.hasStartedGame)
  const currentGameRoute = (): InGameRoute => (route() === 'start' ? 'party' : route()) as InGameRoute

  useSwipeNavigation({ route, currentGameRoute, navigate: (nextRoute) => navigate(nextRoute) })

  onMount(() => {
    syncRouteFromLocation()
    window.addEventListener('hashchange', syncRouteFromLocation)
  })

  onCleanup(() => {
    window.removeEventListener('hashchange', syncRouteFromLocation)
  })

  createEffect(() => {
    if (!state.hasStartedGame && route() !== 'start') {
      navigate('start', { replace: true })
    }
  })

  return (
    <main class="min-h-screen bg-(--color-bg) text-(--color-fg)">
      <section class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] sm:px-6 sm:py-8 lg:px-8">
        <Show
          when={route() !== 'start'}
          fallback={<LandingScreen onEnterGame={() => navigate(getDefaultRoute(true))} />}
        >
          <ApplicationControlBar />
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
