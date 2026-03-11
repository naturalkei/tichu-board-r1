import { For, createMemo, createSignal } from 'solid-js'
import { SEATS } from '../../domain/constants'
import { getRandomPlayerName } from '../../domain/defaults'
import { useGame } from '../../state/game-context'
import type { PlayerId, Seat } from '../../domain/types'

const seatLayouts: { seat: Seat; className: string }[] = [
  { seat: 'north', className: 'col-start-2 row-start-1' },
  { seat: 'west', className: 'col-start-1 row-start-2' },
  { seat: 'east', className: 'col-start-3 row-start-2' },
  { seat: 'south', className: 'col-start-2 row-start-3' },
]

export function PartySetup() {
  const { assignPlayerSeat, state, swapPlayerSeats, updatePlayerName, t } = useGame()
  const [draggingPlayerId, setDraggingPlayerId] = createSignal<PlayerId | null>(null)

  const playersBySeat = createMemo(() =>
    seatLayouts
      .map(({ seat, className }) => {
        const player = state.players.find((item) => item.seat === seat)

        return player ? { player, className } : null
      })
      .filter((item): item is { player: (typeof state.players)[number]; className: string } => Boolean(item)),
  )

  return (
    <section class="rounded-4xl border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent)">
            {t('sections.party')}
          </p>
          <p class="mt-2 text-xs leading-5 text-(--color-muted) sm:text-sm">{t('party.hint')}</p>
        </div>
      </div>
      <div
        class="mt-4 grid min-h-88 grid-cols-[minmax(0,1fr)_minmax(4.75rem,0.84fr)_minmax(0,1fr)] grid-rows-[auto_minmax(5rem,1fr)_auto] gap-3"
        aria-label={t('party.tableLabel')}
      >
        <div class="col-start-2 row-start-2 flex items-center justify-center">
          <div class="flex h-full min-h-28 w-full max-w-32 items-center justify-center rounded-[2.2rem] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(255,191,105,0.24),rgba(15,23,42,0.9))] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div>
              <p class="text-[10px] uppercase tracking-[0.26em] text-(--color-accent)">
                {t('party.tableCenter')}
              </p>
              <p class="mt-2 text-xs leading-5 text-(--color-muted)">{t('teams.northSouth')}</p>
              <p class="text-xs leading-5 text-(--color-muted)">{t('teams.eastWest')}</p>
            </div>
          </div>
        </div>

        <For each={playersBySeat()}>
          {(entry) => {
            const teamKey =
              entry.player.seat === 'north' || entry.player.seat === 'south'
                ? 'northSouth'
                : 'eastWest'

            return (
            <article
              class={`${entry.className} group rounded-3xl border border-white/10 bg-(--color-surface) p-3 transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5`}
              draggable="true"
              onDragStart={() => setDraggingPlayerId(entry.player.id)}
              onDragEnd={() => setDraggingPlayerId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                const sourceId = draggingPlayerId()

                if (!sourceId) {
                  return
                }

                swapPlayerSeats(sourceId, entry.player.id)
                setDraggingPlayerId(null)
              }}
              data-testid={`seat-${entry.player.seat}`}
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-[11px] uppercase tracking-[0.22em] text-(--color-accent)">
                    {t(`seats.${entry.player.seat}`)}
                  </p>
                  <p class="mt-1 text-xs text-(--color-muted)">
                    {t('party.teamLabel', { team: t(`teams.${teamKey}`) })}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/15 text-(--color-fg)"
                    aria-label={t('party.rerollName')}
                    onClick={() =>
                      updatePlayerName(
                        entry.player.id,
                        getRandomPlayerName(state.settings.language, entry.player.name),
                      )
                    }
                  >
                    <svg
                      aria-hidden="true"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 9H14L11 6M20 15H10L13 18M6 6V12C6 15.3137 8.68629 18 12 18H13M18 18V12C18 8.68629 15.3137 6 12 6H11"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.8"
                      />
                    </svg>
                  </button>
                  <span class="rounded-full border border-white/10 px-2 py-1 text-[10px] text-(--color-muted)">
                    {entry.player.id}
                  </span>
                </div>
              </div>

              <label class="mt-3 block">
                <span class="sr-only">
                  {t('party.nameLabel', { seat: t(`seats.${entry.player.seat}`) })}
                </span>
                <input
                  class="w-full rounded-2xl border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-(--color-fg) outline-none transition-colors placeholder:text-(--color-muted) focus:border-(--color-accent)"
                  value={entry.player.name}
                  onInput={(event) => updatePlayerName(entry.player.id, event.currentTarget.value)}
                  placeholder={t(`seats.${entry.player.seat}`)}
                  data-testid={`player-name-${entry.player.id}`}
                />
              </label>

              <label class="mt-2 block">
                <span class="sr-only">
                  {t('party.seatPickerLabel', { seat: t(`seats.${entry.player.seat}`) })}
                </span>
                <select
                  class="w-full rounded-2xl border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-(--color-fg) outline-none focus:border-(--color-accent)"
                  aria-label={t('party.seatPicker', { seat: t(`seats.${entry.player.seat}`) })}
                  value={entry.player.seat}
                  onChange={(event) => assignPlayerSeat(entry.player.id, event.currentTarget.value as Seat)}
                >
                  <For each={SEATS}>{(seat) => <option value={seat}>{t(`seats.${seat}`)}</option>}</For>
                </select>
              </label>
            </article>
            )
          }}
        </For>
      </div>
    </section>
  )
}
