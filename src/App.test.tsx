import { fireEvent, render, screen } from '@solidjs/testing-library'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the landing screen before a game starts', () => {
    render(() => <App />)

    expect(screen.getByRole('heading', { name: /tichuboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start scoring/i })).toBeInTheDocument()
  })

  it('enters the scoring screen after pressing start', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /start scoring/i }))

    expect(screen.getByText(/party setup/i)).toBeInTheDocument()
  })
})
