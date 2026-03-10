import { fireEvent, render, screen, within } from '@solidjs/testing-library'
import App from '../../App'
import { seedStartedGameState } from '../../test/game-state'

describe('RoundEntry', () => {
  beforeEach(() => {
    localStorage.clear()
    seedStartedGameState()
  })

  it('saves a round and updates cumulative totals', async () => {
    render(() => <App />)

    const northSouthInput = screen.getByRole('spinbutton', {
      name: /north \+ south/i,
    })
    const eastWestInput = screen.getByRole('spinbutton', {
      name: /east \+ west/i,
    })

    await fireEvent.input(northSouthInput, { target: { value: '60' } })
    await fireEvent.input(eastWestInput, { target: { value: '40' } })
    await fireEvent.click(screen.getAllByRole('radio', { name: /first out/i })[0]!)
    await fireEvent.click(screen.getByRole('button', { name: /save round/i }))

    expect(screen.getByText(/round saved/i)).toBeInTheDocument()
    expect(screen.getByText(/round history/i)).toBeInTheDocument()
    expect(within(screen.getByTestId('team-total-north-south')).getByText('60')).toBeInTheDocument()
    expect(within(screen.getByTestId('team-total-east-west')).getByText('40')).toBeInTheDocument()
  })
})
