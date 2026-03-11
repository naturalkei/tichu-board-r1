import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library'
import App from '@/App'
import { seedStartedGameState } from '@/test/game-state'

describe('PartySetup', () => {
  const originalScrollTo = window.scrollTo

  beforeEach(() => {
    localStorage.clear()
    seedStartedGameState('party')
    window.scrollTo = vi.fn()
    const value = localStorage.getItem('tichu-board-r1:v1')

    if (value) {
      const nextState = JSON.parse(value) as { recentPlayerNames: string[] }
      nextState.recentPlayerNames = ['Morgan', 'Nova', 'Riley', 'Jordan', 'Casey', 'Taylor']
      localStorage.setItem('tichu-board-r1:v1', JSON.stringify(nextState))
    }
  })

  afterEach(() => {
    window.scrollTo = originalScrollTo
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
    const seatEast = screen.getByTestId('seat-east')
    const originalElementFromPoint = document.elementFromPoint
    const originalGetBoundingClientRect = playerBenchChip.getBoundingClientRect
    const elementFromPoint = vi.fn(() => seatEast)
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPoint,
    })
    playerBenchChip.getBoundingClientRect = () =>
      ({
        left: 10,
        top: 12,
        right: 130,
        bottom: 60,
        width: 120,
        height: 48,
        x: 10,
        y: 12,
        toJSON: () => ({}),
      }) as DOMRect

    await fireEvent.pointerDown(playerBenchChip, { button: 0, pointerId: 1, clientX: 20, clientY: 20 })
    await fireEvent.pointerMove(window, { pointerId: 1, clientX: 80, clientY: 90 })

    expect(screen.getByTestId('bench-drag-preview')).toHaveTextContent('Alice')
    expect(screen.getByTestId('bench-drag-preview')).toHaveStyle({
      left: '70px',
      top: '82px',
    })

    await fireEvent.pointerUp(window, { pointerId: 1, clientX: 120, clientY: 120 })
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: originalElementFromPoint,
    })
    playerBenchChip.getBoundingClientRect = originalGetBoundingClientRect

    expect(within(screen.getByTestId('seat-east')).getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByTestId('bench-drag-preview')).not.toBeInTheDocument()
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
    expect(screen.getByTestId('bench-recent-Riley')).toBeInTheDocument()
    expect(screen.getByTestId('bench-recent-Jordan')).toBeInTheDocument()
    expect(screen.getByTestId('bench-recent-Casey')).toBeInTheDocument()
    expect(screen.queryByTestId('bench-recent-Taylor')).not.toBeInTheDocument()
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

    expect(screen.getByTestId('seat-map-board').className).toContain('grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]')
    expect(screen.getByTestId('seat-north').className).toContain('w-full')
    expect(screen.getByTestId('seat-north').className).toContain('aspect-square')
    expect(screen.getByTestId('seat-east').className).toContain('w-full')
    expect(within(screen.getByTestId('seat-north')).getByText('Team 1').className).toContain('bg-black/10')
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

  it('shows recent player names in a separate editor section', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByTestId('seat-north'))

    expect(screen.getByText(/recent players|최근 플레이어/i)).toBeInTheDocument()
    expect(screen.getByText(/drag onto a seat|좌석에 드래그/i)).toBeInTheDocument()
    expect(within(screen.getByTestId('party-editor-dialog')).getByRole('button', { name: 'Morgan' })).toBeInTheDocument()
  })

  it('shows stronger drop targets on other seats when a bench player is armed', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByTestId('bench-player-player-1'))

    expect(screen.getByTestId('seat-east').className).toContain('border-2')
    expect(screen.getByTestId('seat-west').className).toContain('border-2')
    expect(screen.getByTestId('seat-south').className).toContain('border-2')
    expect(within(screen.getByTestId('seat-east')).getByText(/drop or tap to place here/i)).toBeInTheDocument()
    expect(within(screen.getByTestId('seat-west')).getByText(/drop or tap to place here/i)).toBeInTheDocument()
    expect(within(screen.getByTestId('seat-north')).queryByText(/drop or tap to place here/i)).not.toBeInTheDocument()
  })

  it('toggles the armed bench player state off when the same player is tapped again', async () => {
    render(() => <App />)

    const benchPlayer = screen.getByTestId('bench-player-player-1')

    await fireEvent.click(benchPlayer)
    expect(benchPlayer.className).toContain('bg-(--color-accent)')
    expect(within(screen.getByTestId('seat-east')).getByText(/drop or tap to place here/i)).toBeInTheDocument()

    await fireEvent.click(benchPlayer)

    expect(benchPlayer.className).not.toContain('bg-(--color-accent)')
    expect(within(screen.getByTestId('seat-east')).queryByText(/drop or tap to place here/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
  })

  it('scrolls the seat map just above the bottom dock when seat move mode starts off-screen', async () => {
    render(() => <App />)

    const seatMapAnchor = screen.getByTestId('seat-map-scroll-anchor')
    const gameTabBar = screen.getByTestId('game-tab-bar')
    const originalInnerHeight = window.innerHeight
    const originalScrollY = window.scrollY
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 700,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 120,
    })
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    seatMapAnchor.getBoundingClientRect = () =>
      ({
        top: 520,
        bottom: 920,
        left: 0,
        right: 320,
        width: 320,
        height: 400,
        x: 0,
        y: 520,
        toJSON: () => ({}),
      }) as DOMRect
    gameTabBar.getBoundingClientRect = () =>
      ({
        top: 640,
        bottom: 736,
        left: 0,
        right: 390,
        width: 390,
        height: 96,
        x: 0,
        y: 640,
        toJSON: () => ({}),
      }) as DOMRect
    window.scrollTo = vi.fn()

    await fireEvent.click(screen.getByTestId('bench-player-player-1'))

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 412,
      behavior: 'smooth',
    })

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: originalScrollY,
    })
    window.matchMedia = originalMatchMedia
  })
})
