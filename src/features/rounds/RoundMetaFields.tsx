import clsx from 'clsx'
import type { TeamId } from '@/domain/types'
import type { TranslationKey } from '@/shared/i18n'
import type { RoundDraft } from './round-entry.shared'

type RoundMetaFieldsProps = {
  draft: RoundDraft
  t: (key: TranslationKey) => string
  onDoubleVictoryChange: (teamId: TeamId | '') => void
  onCardPointsNorthSouthChange: (value: string) => void
  onCardPointsEastWestChange: (value: string) => void
}

export function RoundMetaFields(props: RoundMetaFieldsProps) {
  return (
    <div class="grid gap-4 rounded-3xl border border-white/10 bg-(--color-surface) p-4 sm:grid-cols-3">
      <label class="grid gap-2 text-sm">
        <span class="text-(--color-muted)">{props.t('round.doubleVictory')}</span>
        <select
          class={clsx(
            'rounded-2xl border border-white/10 bg-black/15 px-4 py-3',
            'text-(--color-fg) outline-none focus:border-(--color-accent)',
          )}
          value={props.draft.doubleVictoryTeamId}
          data-testid="double-victory-team"
          onInput={(event) => props.onDoubleVictoryChange(event.currentTarget.value as TeamId | '')}
        >
          <option value="">{props.t('round.noDoubleVictory')}</option>
          <option value="north-south">{props.t('teams.northSouth')}</option>
          <option value="east-west">{props.t('teams.eastWest')}</option>
        </select>
      </label>

      <label class="grid gap-2 text-sm">
        <span class="text-(--color-muted)">{props.t('teams.northSouth')}</span>
        <input
          inputMode="numeric"
          type="number"
          min="0"
          max="100"
          disabled={Boolean(props.draft.doubleVictoryTeamId)}
          class={clsx(
            'rounded-2xl border border-white/10 bg-black/15 px-4 py-3',
            'text-(--color-fg) outline-none transition-opacity',
            'focus:border-(--color-accent)',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
          value={props.draft.cardPointsNorthSouth}
          data-testid="card-points-north-south"
          onInput={(event) => props.onCardPointsNorthSouthChange(event.currentTarget.value)}
        />
      </label>

      <label class="grid gap-2 text-sm">
        <span class="text-(--color-muted)">{props.t('teams.eastWest')}</span>
        <input
          inputMode="numeric"
          type="number"
          min="0"
          max="100"
          disabled={Boolean(props.draft.doubleVictoryTeamId)}
          class={clsx(
            'rounded-2xl border border-white/10 bg-black/15 px-4 py-3',
            'text-(--color-fg) outline-none transition-opacity',
            'focus:border-(--color-accent)',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
          value={props.draft.cardPointsEastWest}
          data-testid="card-points-east-west"
          onInput={(event) => props.onCardPointsEastWestChange(event.currentTarget.value)}
        />
      </label>
    </div>
  )
}
