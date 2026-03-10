import { For, Show } from 'solid-js'
import type { ThemeMode } from '../../domain/types'
import { useGame } from '../../state/game-context'

const themeModes: ThemeMode[] = ['system', 'light', 'dark']

type SettingsDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function SettingsDialog(props: SettingsDialogProps) {
  const { resetGame, setLanguage, setTheme, state, t } = useGame()

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-40 flex items-end bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
        <button
          type="button"
          class="absolute inset-0"
          aria-label={t('settings.close')}
          onClick={() => props.onClose()}
        />

        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-dialog-title"
          class="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-[var(--color-surface)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.3)] motion-safe:animate-[fade-in_180ms_ease-out] sm:p-6"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {t('sections.settings')}
              </p>
              <h2 id="settings-dialog-title" class="mt-2 text-xl font-semibold text-[var(--color-fg)]">
                {t('settings.panelTitle')}
              </h2>
              <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {t('settings.panelSubtitle')}
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/15 text-[var(--color-fg)]"
              aria-label={t('settings.close')}
              onClick={() => props.onClose()}
            >
              <svg
                aria-hidden="true"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
            </button>
          </div>

          <div class="mt-6 grid gap-5">
            <div class="grid gap-2">
              <span class="text-sm text-[var(--color-muted)]">{t('settings.language')}</span>
              <div class="grid grid-cols-2 gap-2">
                <OptionButton
                  isActive={state.settings.language === 'en'}
                  label={t('language.english')}
                  onClick={() => setLanguage('en')}
                />
                <OptionButton
                  isActive={state.settings.language === 'ko'}
                  label={t('language.korean')}
                  onClick={() => setLanguage('ko')}
                />
              </div>
            </div>

            <div class="grid gap-2">
              <span class="text-sm text-[var(--color-muted)]">{t('settings.theme')}</span>
              <div class="grid grid-cols-3 gap-2">
                <For each={themeModes}>
                  {(mode) => (
                    <OptionButton
                      isActive={state.settings.theme === mode}
                      label={t(`settings.${mode}`)}
                      onClick={() => setTheme(mode)}
                    />
                  )}
                </For>
              </div>
            </div>

            <button
              type="button"
              class="rounded-2xl border border-rose-300/35 bg-rose-300/10 px-4 py-3 text-sm text-rose-50"
              onClick={() => {
                if (window.confirm(t('settings.resetConfirm'))) {
                  props.onClose()
                  resetGame()
                }
              }}
            >
              {t('settings.reset')}
            </button>
          </div>
        </section>
      </div>
    </Show>
  )
}

function OptionButton(props: { isActive: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      class={`rounded-2xl px-4 py-3 text-sm transition-colors ${
        props.isActive
          ? 'bg-[var(--color-accent)] text-slate-950'
          : 'border border-white/10 bg-black/15 text-[var(--color-fg)]'
      }`}
      onClick={() => props.onClick()}
    >
      {props.label}
    </button>
  )
}
