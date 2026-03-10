import { fireEvent, render, screen, within } from '@solidjs/testing-library'
import App from '../../App'
import { seedStartedGameState } from '../../test/game-state'

describe('PartySetup', () => {
  beforeEach(() => {
    localStorage.clear()
    seedStartedGameState()
  })

  it('updates player names and swaps seats with drag and drop', async () => {
    render(() => <App />)

    const northInput = screen.getByLabelText(/north player name/i)
    await fireEvent.input(northInput, { target: { value: 'Alice' } })

    expect((northInput as HTMLInputElement).value).toBe('Alice')

    const northSeat = screen.getByTestId('seat-north')
    const eastSeat = screen.getByTestId('seat-east')

    await fireEvent.dragStart(northSeat)
    await fireEvent.drop(eastSeat)

    expect(within(screen.getByTestId('seat-east')).getByDisplayValue('Alice')).toBeInTheDocument()
  })
})
