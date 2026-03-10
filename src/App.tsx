import { Show, createSignal } from 'solid-js'
import { ApplicationControlBar } from './features/app/ApplicationControlBar'
import { LandingScreen } from './features/landing/LandingScreen'
import { PartySetup } from './features/party-setup/PartySetup'
import { RoundEntry } from './features/rounds/RoundEntry'
import { Scoreboard } from './features/scoreboard/Scoreboard'
import { SettingsDialog } from './features/settings/SettingsDialog'
import { GameProvider, useGame } from './state/game-context'

function AppContent() {
  const { state } = useGame()
  const [editingRoundId, setEditingRoundId] = createSignal<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false)

  return (
    <main class="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Show
          when={state.hasStartedGame}
          fallback={<LandingScreen />}
        >
          <ApplicationControlBar onOpenSettings={() => setIsSettingsOpen(true)} />

          <div class="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
            <div class="grid gap-4">
              <PartySetup />
              <RoundEntry
                editingRoundId={editingRoundId()}
                onEditingRoundIdChange={setEditingRoundId}
              />
            </div>
            <div class="grid gap-4">
              <Scoreboard onEditRound={setEditingRoundId} />
            </div>
          </div>

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

export default App
