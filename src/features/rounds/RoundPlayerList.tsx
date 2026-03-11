import clsx from 'clsx'
import { For } from 'solid-js'
import type { Player, TichuCall } from '@/domain/types'
import type { TranslationKey } from '@/shared/i18n'
import type { RoundDraft } from './round-entry.shared'

type RoundPlayerListProps = {
  players: Player[]
  draft: RoundDraft
  t: (key: TranslationKey) => string
  onTichuCallChange: (playerId: Player['id'], value: TichuCall) => void
  onFirstOutChange: (playerId: Player['id']) => void
}

export function RoundPlayerList(props: RoundPlayerListProps) {
  return (
    <div class="grid gap-3">
      <For each={props.players}>
        {(player) => (
          <article class="rounded-3xl border border-white/10 bg-(--color-surface) p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-(--color-fg)">{player.name}</p>
                <p class="text-xs uppercase tracking-[0.2em] text-(--color-muted)">{props.t(`seats.${player.seat}`)}</p>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-xs text-(--color-muted)" for={`call-${player.id}`}>
                  {props.t('round.tichu')}
                </label>
                <select
                  id={`call-${player.id}`}
                  class={clsx(
                    'rounded-full border border-white/10 bg-black/15 px-3 py-2',
                    'text-sm text-(--color-fg) outline-none focus:border-(--color-accent)',
                  )}
                  value={props.draft.tichuCalls[player.id]}
                  data-testid={`tichu-call-${player.id}`}
                  onInput={(event) => props.onTichuCallChange(player.id, event.currentTarget.value as TichuCall)}
                >
                  <option value="none">{props.t('round.noCall')}</option>
                  <option value="small">{props.t('round.small')}</option>
                  <option value="grand">{props.t('round.grand')}</option>
                </select>
              </div>
            </div>
            <label class="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-(--color-fg)">
              <input
                type="radio"
                name="first-out-player"
                checked={props.draft.firstOutPlayerId === player.id}
                data-testid={`first-out-${player.id}`}
                onChange={() => props.onFirstOutChange(player.id)}
              />
              <span>{props.t('round.firstOut')}</span>
            </label>
          </article>
        )}
      </For>
    </div>
  )
}
