import {
  getAppBasePath,
  getDefaultRoute,
  getPathForRoute,
  getRouteFromPath,
  getRouteSegment,
} from '@/shared/routes'

describe('routes', () => {
  it('builds real site paths for each app route', () => {
    expect(getPathForRoute('start')).toBe(`${getAppBasePath()}start`)
    expect(getPathForRoute('party')).toBe(`${getAppBasePath()}party`)
    expect(getPathForRoute('round')).toBe(`${getAppBasePath()}round`)
    expect(getPathForRoute('results')).toBe(`${getAppBasePath()}results`)
    expect(getPathForRoute('history')).toBe(`${getAppBasePath()}history`)
  })

  it('maps the app base path to the default route', () => {
    expect(getRouteFromPath(getAppBasePath(), false)).toBe(getDefaultRoute(false))
    expect(getRouteFromPath(getAppBasePath(), true)).toBe(getDefaultRoute(true))
  })

  it('keeps explicit in-game paths even when no game has started', () => {
    expect(getRouteFromPath(getPathForRoute('round'), true)).toBe('round')
    expect(getRouteFromPath(getPathForRoute('round'), false)).toBe('round')
    expect(getRouteFromPath(getPathForRoute('party'), false)).toBe('party')
  })

  it('falls back to the default route for unknown paths', () => {
    expect(getRouteFromPath(`${getAppBasePath()}unknown`, false)).toBe('start')
    expect(getRouteFromPath(`${getAppBasePath()}unknown`, true)).toBe('party')
  })

  it('exposes stable route segments for URL structure', () => {
    expect(getRouteSegment('start')).toBe('start')
    expect(getRouteSegment('party')).toBe('party')
    expect(getRouteSegment('round')).toBe('round')
    expect(getRouteSegment('results')).toBe('results')
    expect(getRouteSegment('history')).toBe('history')
  })
})
