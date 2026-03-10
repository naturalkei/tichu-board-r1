function App() {
  return (
    <main class="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-6 px-5 py-12 sm:px-8">
        <div class="inline-flex w-fit rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Tichu Board R1
        </div>
        <div class="space-y-4">
          <h1 class="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Mobile-first Tichu scorekeeping with fast round entry and resilient local state
          </h1>
          <p class="max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
            The initial shell is ready. Next slices will add scoring, storage, bilingual UI, dark mode,
            and round history on top of this baseline.
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <article class="rounded-3xl border border-white/12 bg-white/6 p-4 backdrop-blur-sm">
            <h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Domain
            </h2>
            <p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Pure scoring rules and validation will land in the next branch.
            </p>
          </article>
          <article class="rounded-3xl border border-white/12 bg-white/6 p-4 backdrop-blur-sm">
            <h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Interface
            </h2>
            <p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              The UI shell is set up for mobile-first layout, theme tokens, and animation-safe styling.
            </p>
          </article>
          <article class="rounded-3xl border border-white/12 bg-white/6 p-4 backdrop-blur-sm">
            <h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Quality
            </h2>
            <p class="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Lint, tests, and build will validate every feature branch before merge.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
