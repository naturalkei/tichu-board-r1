import { createSignal } from 'solid-js'
import { PartySetup } from './features/party-setup/PartySetup'
import { RoundEntry } from './features/rounds/RoundEntry'
import { Scoreboard } from './features/scoreboard/Scoreboard'
import { SettingsPanel } from './features/settings/SettingsPanel'
import { GameProvider, useGame } from './state/game-context'

function AppContent() {
  const { t } = useGame()
  const [editingRoundId, setEditingRoundId] = createSignal<string | null>(null)

  return (
    <main class="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header class="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,191,105,0.16),rgba(255,255,255,0.04))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.2)] backdrop-blur-sm motion-safe:animate-[fade-in_260ms_ease-out] sm:p-7">
          <div class="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
            {t('app.badge')}
          </div>
          <h1 class="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {t('app.title')}
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
            {t('app.subtitle')}
          </p>
        </header>

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
            <SettingsPanel />
          </div>
        </div>
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
