import { BrandLogo } from '../../shared/BrandLogo'
import { useGame } from '../../state/game-context'

export function LandingScreen() {
  const { startGame, t } = useGame()

  return (
    <section class="flex min-h-screen items-center py-6">
      <div class="w-full rounded-[2.4rem] border border-white/10 bg-[linear-gradient(155deg,rgba(255,191,105,0.18),rgba(255,255,255,0.04))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm motion-safe:animate-[fade-in_260ms_ease-out] sm:p-7">
        <div class="flex items-center gap-3">
          <div class="flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/12 bg-slate-950/35 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            <BrandLogo class="h-11 w-11" />
          </div>
          <div class="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
            {t('app.badge')}
          </div>
        </div>

        <h1 class="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {t('app.title')}
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
          {t('landing.subtitle')}
        </p>

        <div class="mt-6 grid gap-3 text-sm text-[var(--color-muted)] sm:grid-cols-3">
          <article class="rounded-[1.6rem] border border-white/10 bg-slate-950/20 p-4">
            <p class="font-semibold text-[var(--color-fg)]">{t('landing.featureFastTitle')}</p>
            <p class="mt-2 leading-6">{t('landing.featureFastBody')}</p>
          </article>
          <article class="rounded-[1.6rem] border border-white/10 bg-slate-950/20 p-4">
            <p class="font-semibold text-[var(--color-fg)]">{t('landing.featureLocalTitle')}</p>
            <p class="mt-2 leading-6">{t('landing.featureLocalBody')}</p>
          </article>
          <article class="rounded-[1.6rem] border border-white/10 bg-slate-950/20 p-4">
            <p class="font-semibold text-[var(--color-fg)]">{t('landing.featureBilingualTitle')}</p>
            <p class="mt-2 leading-6">{t('landing.featureBilingualBody')}</p>
          </article>
        </div>

        <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            class="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-slate-950 transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5"
            onClick={() => startGame()}
          >
            {t('landing.start')}
          </button>
          <p class="text-sm text-[var(--color-muted)]">{t('landing.caption')}</p>
        </div>
      </div>
    </section>
  )
}
