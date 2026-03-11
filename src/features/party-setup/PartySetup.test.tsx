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

    await fireEvent.click(screen.getByTestId('team-name-north-south'))
    expect(screen.getByText(/adjust team 1 name and color/i)).toBeInTheDocument()
    await fireEvent.input(screen.getByTestId('team-editor-name-north-south'), {
      target: { value: 'Alpha Team' },
    })
    await waitFor(() => {
      expect(screen.getByTestId('team-label-north-south')).toHaveTextContent('Alpha Team')
    })
    expect(screen.getByText(/adjust alpha team name and color/i)).toBeInTheDocument()
    await fireEvent.click(screen.getByTestId('team-editor-color-violet'))
    await waitFor(() => {
      expect(screen.getByTestId('team-name-north-south').className).toContain('ring-fuchsia-300/60')
    })
    expect(screen.getByTestId('team-editor-color-violet').className).toContain('ring-2')
    expect(screen.getByTestId('team-editor-dialog').firstElementChild?.className).toContain('from-fuchsia-400/22')
    expect(screen.getByTestId('team-editor-close-button').className).toContain('bg-fuchsia-400')

    expect(screen.getByTestId('team-label-north-south')).toHaveTextContent('Alpha Team')
    expect(screen.getByTestId('team-name-north-south')).toHaveTextContent('Alpha Team')
    expect(screen.getByTestId('team-name-north-south').className).toContain('ring-fuchsia-300/60')
    expect(screen.getByTestId('bench-recent-Morgan')).toBeInTheDocument()
    expect(screen.getByTestId('bench-recent-Nova')).toBeInTheDocument()
    expect(screen.getByTestId('team-editor-color-teal')).toBeInTheDocument()
    expect(screen.getByTestId('team-editor-color-orange')).toBeInTheDocument()
    expect(screen.getAllByTestId(/team-editor-color-/)).toHaveLength(7)
    await fireEvent.click(within(screen.getByTestId('team-editor-dialog')).getByText(/close team editor/i))

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

    await fireEvent.click(screen.getByTestId('team-name-east-west'))
    expect(screen.getByTestId('team-editor-color-violet')).toBeDisabled()
    expect(screen.getByTestId('team-editor-color-amber')).toBeDisabled()
    expect(screen.getByTestId('team-editor-color-sky')).not.toBeDisabled()
    await fireEvent.click(screen.getByTestId('team-editor-color-rose'))
    await waitFor(() => {
      expect(screen.getByTestId('team-name-east-west').className).toContain('ring-rose-300/60')
    })
    await fireEvent.click(within(screen.getByTestId('team-editor-dialog')).getByText(/close team editor/i))

    await waitFor(() => {
      expect(screen.getByTestId('team-name-east-west')).toHaveTextContent('Team 2')
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
    expect(screen.getByTestId('party-editor-dialog').className).toContain('max-h-dvh')
  })

  it('opens team editing in a dedicated dialog sheet', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByTestId('team-name-east-west'))

    expect(screen.getByTestId('team-editor-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('team-editor-dialog').className).toContain('max-h-dvh')
    expect(within(screen.getByTestId('team-editor-dialog')).getByText(/close team editor/i)).toBeInTheDocument()
  })

  it('renders large seat overlays for every table target', async () => {
    render(() => <App />)

    expect(screen.getByTestId('seat-overlay-north')).toHaveTextContent('N')
    expect(screen.getByTestId('seat-overlay-west')).toHaveTextContent('W')
    expect(screen.getByTestId('seat-overlay-east')).toHaveTextContent('E')
    expect(screen.getByTestId('seat-overlay-south')).toHaveTextContent('S')
    expect(within(screen.getByTestId('seat-north')).queryByText('North')).not.toBeInTheDocument()
    expect(within(screen.getByTestId('seat-west')).queryByText('West')).not.toBeInTheDocument()
  })

  it('applies an armed recent player to a seat target', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByTestId('bench-recent-Morgan'))
    await fireEvent.click(screen.getByTestId('seat-west'))

    expect(within(screen.getByTestId('seat-west')).getByText('Morgan')).toBeInTheDocument()
  })
})
