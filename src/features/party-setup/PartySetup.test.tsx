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

  it('can reroll a name and move the player with the seat picker', async () => {
    render(() => <App />)

    const northSeat = screen.getByTestId('seat-north')
    const northNameBefore = (within(northSeat).getByRole('textbox') as HTMLInputElement).value

    await fireEvent.click(within(northSeat).getByRole('button', { name: /reroll random name/i }))

    const rerolledName = (within(northSeat).getByRole('textbox') as HTMLInputElement).value
    expect(rerolledName).not.toBe(northNameBefore)

    await fireEvent.change(screen.getByLabelText(/seat picker for north/i), {
      target: { value: 'west' },
    })

    expect(within(screen.getByTestId('seat-west')).getByDisplayValue(rerolledName)).toBeInTheDocument()
  })
})
