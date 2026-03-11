import { Show, createSignal } from 'solid-js'
import { useGame } from '@/state/game-context'

export function ShareScoreButton() {
  const { cumulativeScores, state, t, teamNames } = useGame()
  const [statusMessage, setStatusMessage] = createSignal('')

  const handleShare = async () => {
    const svgMarkup = createScoreSummarySvg({
      title: t('app.title'),
      subtitle: t('scoreboard.shareSubtitle'),
      roundsLabel: `${state.rounds.length} ${t('scoreboard.rounds')}`,
      northSouthLabel: teamNames()['north-south'],
      eastWestLabel: teamNames()['east-west'],
      northSouthScore: cumulativeScores()['north-south'],
      eastWestScore: cumulativeScores()['east-west'],
    })
    const file = new File([svgMarkup], 'tichuboard-score-summary.svg', { type: 'image/svg+xml' })

    if (
      typeof navigator !== 'undefined' &&
      'share' in navigator &&
      typeof navigator.share === 'function' &&
      'canShare' in navigator &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: t('app.title'),
        text: t('scoreboard.shareSubtitle'),
        files: [file],
      })
      setStatusMessage(t('scoreboard.shareReady'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = file.name
    link.click()
    URL.revokeObjectURL(objectUrl)
    setStatusMessage(t('scoreboard.shareDownloaded'))
  }

  return (
    <div class="grid justify-items-end gap-2">
      <button
        type="button"
        class="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-xs text-(--color-fg)"
        data-testid="share-score-summary"
        onClick={() => void handleShare()}
      >
        {t('scoreboard.share')}
      </button>
      <Show when={statusMessage()}>
        <p class="text-[11px] text-(--color-muted)">{statusMessage()}</p>
      </Show>
    </div>
  )
}

function createScoreSummarySvg({
  title,
  subtitle,
  roundsLabel,
  northSouthLabel,
  eastWestLabel,
  northSouthScore,
  eastWestScore,
}: {
  title: string
  subtitle: string
  roundsLabel: string
  northSouthLabel: string
  eastWestLabel: string
  northSouthScore: number
  eastWestScore: number
}) {
  const escape = (value: string) =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escape(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12213d" />
      <stop offset="100%" stop-color="#0b1323" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" rx="32" fill="url(#bg)" />
  <rect x="48" y="48" width="1104" height="534" rx="32" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
  <text x="84" y="126" fill="#ffbf69" font-family="Space Grotesk, sans-serif" font-size="24" letter-spacing="4">TICHUBOARD</text>
  <text x="84" y="184" fill="#f5efe5" font-family="Space Grotesk, sans-serif" font-size="56" font-weight="700">${escape(subtitle)}</text>
  <text x="84" y="226" fill="#c5c0b5" font-family="Space Grotesk, sans-serif" font-size="24">${escape(roundsLabel)}</text>
  <rect x="84" y="292" width="486" height="214" rx="28" fill="rgba(255,191,105,0.12)" stroke="rgba(255,191,105,0.24)" />
  <rect x="630" y="292" width="486" height="214" rx="28" fill="rgba(125,211,252,0.12)" stroke="rgba(125,211,252,0.24)" />
  <text x="118" y="360" fill="#c5c0b5" font-family="Space Grotesk, sans-serif" font-size="22">${escape(northSouthLabel)}</text>
  <text x="118" y="446" fill="#f5efe5" font-family="Space Grotesk, sans-serif" font-size="92" font-weight="700">${northSouthScore}</text>
  <text x="664" y="360" fill="#c5c0b5" font-family="Space Grotesk, sans-serif" font-size="22">${escape(eastWestLabel)}</text>
  <text x="664" y="446" fill="#f5efe5" font-family="Space Grotesk, sans-serif" font-size="92" font-weight="700">${eastWestScore}</text>
</svg>`
}
