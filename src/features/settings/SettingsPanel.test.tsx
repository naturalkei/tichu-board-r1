import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import App from '@/App'
import { SETTINGS_STORAGE_KEY } from '@/storage/game-storage'
import { seedStartedGameState } from '@/test/game-state'

describe('SettingsPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    seedStartedGameState('round')
    document.documentElement.dataset.theme = 'dark'
  })

  it('switches language to Korean', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /open settings/i }))
    await fireEvent.click(screen.getByRole('button', { name: /korean/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/테이블 설정/i)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /설정 닫기/i })).toHaveLength(2)
    expect(
      screen.getByText(/점수 화면을 벗어나지 않고 언어, 테마, 저장된 게임 제어를 조정합니다/i),
    ).toBeInTheDocument()
  })

  it('applies the selected theme to the document root', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /open settings/i }))
    await fireEvent.click(screen.getByRole('button', { name: /light/i }))

    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('persists language and theme across a remount', async () => {
    const view = render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /open settings/i }))
    await fireEvent.click(screen.getByRole('button', { name: /light/i }))
    await fireEvent.click(screen.getByRole('button', { name: /korean/i }))

    expect(document.documentElement.lang).toBe('ko')
    expect(document.documentElement.dataset.theme).toBe('light')
    await waitFor(() => {
      expect(localStorage.getItem(SETTINGS_STORAGE_KEY)).toContain('"language":"ko"')
      expect(localStorage.getItem(SETTINGS_STORAGE_KEY)).toContain('"theme":"light"')
    })

    view.unmount()
    render(() => <App />)

    expect(document.documentElement.lang).toBe('ko')
    expect(document.documentElement.dataset.theme).toBe('light')
    await fireEvent.click(screen.getByRole('button', { name: /설정 열기/i }))
    expect(screen.getByText(/테이블 설정/i)).toBeInTheDocument()
  })
})
