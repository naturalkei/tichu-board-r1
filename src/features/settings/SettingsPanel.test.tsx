import { fireEvent, render, screen } from '@solidjs/testing-library'
import App from '../../App'
import { seedStartedGameState } from '../../test/game-state'

describe('SettingsPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    seedStartedGameState()
    document.documentElement.dataset.theme = 'dark'
  })

  it('switches language to Korean', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /korean/i }))

    expect(screen.getByRole('heading', { name: /tichuboard/i })).toBeInTheDocument()
    expect(
      screen.getByText(/실전 플레이를 위한 모바일 중심 티츄 점수 동반 앱으로, 로컬 기록을 안정적으로 유지합니다/i),
    ).toBeInTheDocument()
  })

  it('applies the selected theme to the document root', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /light/i }))

    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
