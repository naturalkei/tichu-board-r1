import { render, screen } from '@solidjs/testing-library'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the application heading', () => {
    render(() => <App />)

    expect(
      screen.getByRole('heading', {
        name: /fast tichu scoring for live table play/i,
      }),
    ).toBeInTheDocument()
  })
})
