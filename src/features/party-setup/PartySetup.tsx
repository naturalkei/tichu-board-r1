import { For, createSignal } from 'solid-js'
import { useGame } from '../../state/game-context'
import type { PlayerId } from '../../domain/types'

const seatOrder = ['north', 'east', 'south', 'west'] as const

export function PartySetup() {
  const { state, swapPlayerSeats, updatePlayerName, t } = useGame()
  const [draggingPlayerId, setDraggingPlayerId] = createSignal<PlayerId | null>(null)

  const playersBySeat = () =>
    seatOrder
      .map((seat) => state.players.find((player) => player.seat === seat))
      .filter((player): player is NonNullable<typeof player> => Boolean(player))

  return (
    <section class="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {t('sections.party')}
          </p>
          <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{t('party.hint')}</p>
        </div>
      </div>
      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <For each={playersBySeat()}>
          {(player) => {
            const teamKey = player.seat === 'north' || player.seat === 'south' ? 'northSouth' : 'eastWest'

            return (
              <article
                class="group rounded-[1.6rem] border border-white/10 bg-[var(--color-surface)] p-4 transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5"
                draggable="true"
                onDragStart={() => setDraggingPlayerId(player.id)}
                onDragEnd={() => setDraggingPlayerId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  const sourceId = draggingPlayerId()

                  if (!sourceId) {
                    return
                  }

                  swapPlayerSeats(sourceId, player.id)
                  setDraggingPlayerId(null)
                }}
                data-testid={`seat-${player.seat}`}
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
                      {t(`seats.${player.seat}`)}
                    </p>
                    <p class="mt-2 text-sm text-[var(--color-muted)]">
                      {t('party.teamLabel', { team: t(`teams.${teamKey}`) })}
                    </p>
                  </div>
                  <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--color-muted)]">
                    {player.id}
                  </span>
                </div>
                <label class="mt-4 block">
                  <span class="sr-only">
                    {t('party.nameLabel', { seat: t(`seats.${player.seat}`) })}
                  </span>
                  <input
                    class="w-full rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-base text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
                    value={player.name}
                    onInput={(event) => updatePlayerName(player.id, event.currentTarget.value)}
                    placeholder={t(`seats.${player.seat}`)}
                  />
                </label>
              </article>
            )
          }}
        </For>
      </div>
    </section>
  )
}
