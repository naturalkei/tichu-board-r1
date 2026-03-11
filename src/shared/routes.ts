export const inGameRoutes = ['party', 'round', 'results', 'history'] as const
export const appRoutes = ['start', ...inGameRoutes] as const

export type AppRoute = (typeof appRoutes)[number]
export type InGameRoute = (typeof inGameRoutes)[number]

const appBasePath = normalizeBasePath(import.meta.env.BASE_URL ?? '/')

export const routeDefinitions = {
  start: {
    segment: 'start',
    path: buildRoutePath('start'),
  },
  party: {
    segment: 'party',
    path: buildRoutePath('party'),
  },
  round: {
    segment: 'round',
    path: buildRoutePath('round'),
  },
  results: {
    segment: 'results',
    path: buildRoutePath('results'),
  },
  history: {
    segment: 'history',
    path: buildRoutePath('history'),
  },
} as const

export function isAppRoute(value: string): value is AppRoute {
  return appRoutes.includes(value as AppRoute)
}

export function isInGameRoute(value: AppRoute): value is InGameRoute {
  return inGameRoutes.includes(value as InGameRoute)
}

export function getDefaultRoute(hasStartedGame: boolean): AppRoute {
  return hasStartedGame ? 'party' : 'start'
}

export function getRouteFromPath(pathname: string, hasStartedGame: boolean): AppRoute {
  const normalized = trimBasePath(pathname)

  if (normalized.length === 0) {
    return getDefaultRoute(hasStartedGame)
  }

  if (isAppRoute(normalized)) {
    return normalized
  }

  return getDefaultRoute(hasStartedGame)
}

export function getPathForRoute(route: AppRoute) {
  return routeDefinitions[route].path
}

export function getRouteSegment(route: AppRoute) {
  return routeDefinitions[route].segment
}

export function getAppBasePath() {
  return appBasePath
}

export function getAdjacentRoute(route: InGameRoute, direction: 'next' | 'previous'): InGameRoute {
  const currentIndex = inGameRoutes.indexOf(route)
  const targetIndex =
    direction === 'next'
      ? Math.min(inGameRoutes.length - 1, currentIndex + 1)
      : Math.max(0, currentIndex - 1)

  return inGameRoutes[targetIndex]!
}

function normalizeBasePath(basePath: string) {
  const trimmed = basePath.replace(/^\/+|\/+$/g, '')

  return trimmed.length > 0 ? `/${trimmed}/` : '/'
}

function buildRoutePath(route: AppRoute) {
  return `${appBasePath}${route}`
}

function trimBasePath(pathname: string) {
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/'
  const baseWithoutTrailingSlash = appBasePath.replace(/\/+$/, '') || '/'

  if (normalizedPathname === baseWithoutTrailingSlash) {
    return ''
  }

  if (normalizedPathname.startsWith(appBasePath)) {
    return normalizedPathname.slice(appBasePath.length).replace(/^\/+|\/+$/g, '')
  }

  return normalizedPathname.replace(/^\/+|\/+$/g, '')
}
