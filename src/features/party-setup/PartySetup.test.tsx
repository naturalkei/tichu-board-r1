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

    await fireEvent.click(screen.getByTestId('seat-north'))
    await fireEvent.click(screen.getByRole('button', { name: /move on table/i }))
    await fireEvent.click(screen.getByTestId('seat-east'))

    expect(within(screen.getByTestId('seat-east')).getByText('Alice')).toBeInTheDocument()
  })

  it('can reroll a unique name, keep team colors distinct, and block duplicate names', async () => {
    render(() => <App />)

    const northSeat = screen.getByTestId('seat-north')
    await fireEvent.click(northSeat)

    const northNameBefore = (screen.getByRole('textbox') as HTMLInputElement).value
    await fireEvent.click(screen.getByRole('button', { name: /reroll random name/i }))

    const rerolledName = (screen.getByRole('textbox') as HTMLInputElement).value
    expect(rerolledName).not.toBe(northNameBefore)

    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(screen.getByTestId('team-name-north-south')).toHaveTextContent(rerolledName)

    await fireEvent.click(screen.getByTestId('team-color-east-west-amber'))

    expect(screen.getByTestId('team-color-east-west-amber')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('team-color-north-south-sky')).toHaveAttribute('aria-pressed', 'true')

    await fireEvent.click(screen.getByTestId('seat-east'))
    await fireEvent.input(screen.getByRole('textbox'), { target: { value: rerolledName } })
    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(screen.getByText(/player names must be unique/i)).toBeInTheDocument()
  })
})
