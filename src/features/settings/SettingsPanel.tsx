import { For } from 'solid-js'
import type { ThemeMode } from '../../domain/types'
import { useGame } from '../../state/game-context'

const themeModes: ThemeMode[] = ['system', 'light', 'dark']

export function SettingsPanel() {
  const { resetGame, setLanguage, setTheme, state, t } = useGame()

  return (
    <section class="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
        {t('sections.settings')}
      </p>

      <div class="mt-5 grid gap-4">
        <div class="grid gap-2">
          <span class="text-sm text-[var(--color-muted)]">{t('settings.language')}</span>
          <div class="flex gap-2">
            <LanguageButton
              isActive={state.settings.language === 'en'}
              onClick={() => setLanguage('en')}
              label={t('language.english')}
            />
            <LanguageButton
              isActive={state.settings.language === 'ko'}
              onClick={() => setLanguage('ko')}
              label={t('language.korean')}
            />
          </div>
        </div>

        <div class="grid gap-2">
          <span class="text-sm text-[var(--color-muted)]">{t('settings.theme')}</span>
          <div class="grid grid-cols-3 gap-2">
            <For each={themeModes}>
              {(mode) => (
                <button
                  type="button"
                  class={`rounded-2xl px-4 py-3 text-sm transition-colors ${
                    state.settings.theme === mode
                      ? 'bg-[var(--color-accent)] text-slate-950'
                      : 'border border-white/10 bg-black/15 text-[var(--color-fg)]'
                  }`}
                  onClick={() => setTheme(mode)}
                >
                  {t(`settings.${mode}`)}
                </button>
              )}
            </For>
          </div>
        </div>

        <button
          type="button"
          class="rounded-2xl border border-rose-300/35 bg-rose-300/10 px-4 py-3 text-sm text-rose-50"
          onClick={() => {
            if (window.confirm(t('settings.resetConfirm'))) {
              resetGame()
            }
          }}
        >
          {t('settings.reset')}
        </button>
      </div>
    </section>
  )
}

function LanguageButton(props: { isActive: boolean; label: string; onClick: () => void }) {
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
