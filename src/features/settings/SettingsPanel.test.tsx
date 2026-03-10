import { fireEvent, render, screen } from '@solidjs/testing-library'
import App from '../../App'

describe('SettingsPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.dataset.theme = 'dark'
  })

  it('switches language to Korean', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /korean/i }))

    expect(
      screen.getByRole('heading', { name: /실전 플레이를 위한 빠른 티츄 점수 계산기/i }),
    ).toBeInTheDocument()
  })

  it('applies the selected theme to the document root', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /light/i }))

    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
