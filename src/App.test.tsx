import { render, screen } from '@solidjs/testing-library'
import App from './App'

describe('App', () => {
  it('renders the project shell headline', () => {
    render(() => <App />)

    expect(
      screen.getByRole('heading', {
        name: /mobile-first tichu scorekeeping/i,
      }),
    ).toBeInTheDocument()
  })
})
