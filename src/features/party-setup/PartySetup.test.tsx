import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library'
import App from '@/App'
import { seedStartedGameState } from '@/test/game-state'

describe('PartySetup', () => {
  beforeEach(() => {
    localStorage.clear()
    seedStartedGameState('party')
    const value = localStorage.getItem('tichu-board-r1:v1')

    if (value) {
      const nextState = JSON.parse(value) as { recentPlayerNames: string[] }
      nextState.recentPlayerNames = ['Morgan', 'Nova']
      localStorage.setItem('tichu-board-r1:v1', JSON.stringify(nextState))
    }
  })

  it('updates player names and reassigns seats from the player bench', async () => {
    render(() => <App />)

    const northSeat = screen.getByTestId('seat-north')
    await fireEvent.click(northSeat)
    await fireEvent.input(within(screen.getByTestId('party-editor-dialog')).getByRole('textbox'), {
      target: { value: 'Alice' },
    })
    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(within(screen.getByTestId('seat-north')).getByText('Alice')).toBeInTheDocument()

    const playerBenchChip = screen.getByTestId('bench-player-player-1')
    await fireEvent.dragStart(playerBenchChip)
    await fireEvent.drop(screen.getByTestId('seat-east'))

    expect(within(screen.getByTestId('seat-east')).getByText('Alice')).toBeInTheDocument()
  })

  it('can rename teams, reroll a unique name, disable used team colors, and block duplicate names', async () => {
    render(() => <App />)

    await fireEvent.input(screen.getByTestId('team-label-north-south'), {
      target: { value: 'Alpha Team' },
    })

    expect(screen.getByTestId('team-label-north-south')).toHaveValue('Alpha Team')
    expect(screen.getByTestId('bench-recent-Morgan')).toBeInTheDocument()
    expect(screen.getByTestId('bench-recent-Nova')).toBeInTheDocument()

    const northSeat = screen.getByTestId('seat-north')
    await fireEvent.click(northSeat)

    const northNameBefore = (
      within(screen.getByTestId('party-editor-dialog')).getByRole('textbox') as HTMLInputElement
    ).value
    await fireEvent.click(screen.getByRole('button', { name: /reroll random name/i }))

    const rerolledName = (
      within(screen.getByTestId('party-editor-dialog')).getByRole('textbox') as HTMLInputElement
    ).value
    expect(rerolledName).not.toBe(northNameBefore)

    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(screen.getByTestId('team-name-north-south')).toHaveTextContent(rerolledName)

    expect(screen.getByTestId('team-color-east-west-amber')).toBeDisabled()
    expect(screen.getByTestId('team-color-east-west-amber')).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByTestId('team-color-east-west-sky')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('team-color-north-south-amber')).toHaveAttribute('aria-pressed', 'true')

    await fireEvent.click(screen.getByTestId('team-color-east-west-rose'))

    await waitFor(() => {
      expect(screen.getByTestId('team-color-east-west-rose')).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByTestId('team-color-north-south-rose')).toBeDisabled()
      expect(screen.getByTestId('team-color-north-south-rose')).toHaveAttribute('aria-disabled', 'true')
    })

    await fireEvent.click(screen.getByTestId('seat-east'))
    await fireEvent.input(within(screen.getByTestId('party-editor-dialog')).getByRole('textbox'), {
      target: { value: rerolledName },
    })
    await fireEvent.click(screen.getByRole('button', { name: /apply changes/i }))

    expect(screen.getByText(/player names must be unique/i)).toBeInTheDocument()
  })

  it('uses a higher-contrast editor sheet', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByTestId('seat-north'))

    expect(screen.getByTestId('party-editor-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('party-editor-dialog').className).toContain('min-h-dvh')
  })

  it('renders large seat overlays for every table target', async () => {
    render(() => <App />)

    expect(screen.getByTestId('seat-overlay-north')).toHaveTextContent('N')
    expect(screen.getByTestId('seat-overlay-west')).toHaveTextContent('W')
    expect(screen.getByTestId('seat-overlay-east')).toHaveTextContent('E')
    expect(screen.getByTestId('seat-overlay-south')).toHaveTextContent('S')
  })

  it('applies an armed recent player to a seat target', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByTestId('bench-recent-Morgan'))
    await fireEvent.click(screen.getByTestId('seat-west'))

    expect(within(screen.getByTestId('seat-west')).getByText('Morgan')).toBeInTheDocument()
  })
})
