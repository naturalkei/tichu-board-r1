import { fireEvent, render, screen, within } from '@solidjs/testing-library'
import App from '@/App'
import { seedStartedGameState } from '@/test/game-state'

describe('PartySetup', () => {
  beforeEach(() => {
    localStorage.clear()
    seedStartedGameState('party')
  })

  it('updates player names through the editor and swaps seats with drag and drop', async () => {
    render(() => <App />)

    const northSeat = screen.getByTestId('seat-north')
    await fireEvent.click(northSeat)
    await fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Alice' } })
    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(within(screen.getByTestId('seat-north')).getByText('Alice')).toBeInTheDocument()

    const eastSeat = screen.getByTestId('seat-east')
    await fireEvent.dragStart(northSeat)
    await fireEvent.drop(eastSeat)

    expect(within(screen.getByTestId('seat-east')).getByText('Alice')).toBeInTheDocument()
  })

  it('can reroll a name, move the player, and block duplicate names', async () => {
    render(() => <App />)

    const northSeat = screen.getByTestId('seat-north')
    await fireEvent.click(northSeat)

    const northNameBefore = (screen.getByRole('textbox') as HTMLInputElement).value
    await fireEvent.click(screen.getByRole('button', { name: /reroll random name/i }))

    const rerolledName = (screen.getByRole('textbox') as HTMLInputElement).value
    expect(rerolledName).not.toBe(northNameBefore)

    await fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'west' },
    })
    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(within(screen.getByTestId('seat-west')).getByText(rerolledName)).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('seat-east'))
    await fireEvent.input(screen.getByRole('textbox'), { target: { value: rerolledName } })
    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(screen.getByText(/player names must be unique/i)).toBeInTheDocument()
  })
})
