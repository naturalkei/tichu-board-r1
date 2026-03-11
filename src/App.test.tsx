import { fireEvent, render, screen } from '@solidjs/testing-library'
import App from '@/App'
import { getPathForRoute } from '@/shared/routes'
import { seedStartedGameState } from '@/test/game-state'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  it('shows the landing screen before a game starts', () => {
    render(() => <App />)

    expect(screen.getByRole('heading', { name: /tichuboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start scoring/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('start'))
    expect(screen.getByTestId('landing-layout')).toBeInTheDocument()
    expect(screen.getByTestId('landing-content').className).toContain('overflow-y-auto')
    expect(screen.getByTestId('app-shell').className).toContain('overflow-hidden')
  })

  it('keeps an explicit party route on direct entry even without a started game', () => {
    window.history.replaceState(null, '', getPathForRoute('party'))

    render(() => <App />)

    expect(screen.getByRole('heading', { name: /party setup/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('party'))
  })

  it('enters the scoring screen after pressing start', async () => {
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /start scoring/i }))

    expect(screen.getByRole('heading', { name: /party setup/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('party'))
    expect(screen.getByRole('button', { name: /open settings/i })).toBeInTheDocument()
  })

  it('renders the correct page when opened from a direct site route', () => {
    seedStartedGameState('results')
    window.history.replaceState(null, '', getPathForRoute('results'))

    render(() => <App />)

    expect(screen.getByRole('heading', { name: /game results/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('results'))
  })

  it('switches pages through the tab bar and keeps route state in the pathname', async () => {
    seedStartedGameState('party')
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /^results$/i }))

    expect(screen.getByRole('heading', { name: /game results/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('results'))
  })

  it('moves to the next page with a left swipe gesture', async () => {
    seedStartedGameState('party')
    render(() => <App />)

    const page = screen.getByTestId('page-party')

    await fireEvent.touchStart(page, {
      changedTouches: [{ clientX: 220, clientY: 140 }],
    })
    await fireEvent.touchEnd(page, {
      changedTouches: [{ clientX: 120, clientY: 142 }],
    })

    expect(screen.getByRole('heading', { name: /round entry/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('round'))
  })

  it('can revisit the landing screen and continue the current game', async () => {
    seedStartedGameState('results')
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /open settings/i }))
    await fireEvent.click(screen.getByRole('button', { name: /show start screen/i }))

    expect(screen.getByRole('button', { name: /continue game/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('start'))

    await fireEvent.click(screen.getByRole('button', { name: /continue game/i }))

    expect(screen.getByRole('heading', { name: /party setup/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe(getPathForRoute('party'))
  })

  it('shows the floating score summary after the first round is saved', async () => {
    seedStartedGameState('round')
    render(() => <App />)

    await fireEvent.click(screen.getByRole('button', { name: /start first round/i }))

    await fireEvent.input(screen.getByTestId('card-points-north-south'), {
      target: { value: '60' },
    })
    await fireEvent.input(screen.getByTestId('card-points-east-west'), {
      target: { value: '40' },
    })
    await fireEvent.click(screen.getAllByRole('radio', { name: /first out/i })[0]!)
    await fireEvent.click(screen.getByTestId('save-round'))

    expect(screen.getByTestId('global-score-summary')).toBeInTheDocument()
    expect(screen.getAllByTestId('share-score-summary').length).toBeGreaterThan(0)
  })
})
