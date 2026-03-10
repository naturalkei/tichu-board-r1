export const inGameRoutes = ['party', 'round', 'results', 'history'] as const
export const appRoutes = ['start', ...inGameRoutes] as const

export type AppRoute = (typeof appRoutes)[number]
export type InGameRoute = (typeof inGameRoutes)[number]

export function isAppRoute(value: string): value is AppRoute {
  return appRoutes.includes(value as AppRoute)
}

export function isInGameRoute(value: AppRoute): value is InGameRoute {
  return inGameRoutes.includes(value as InGameRoute)
}

export function getDefaultRoute(hasStartedGame: boolean): AppRoute {
  return hasStartedGame ? 'party' : 'start'
}

export function getRouteFromHash(hash: string, hasStartedGame: boolean): AppRoute {
  const normalized = hash.replace(/^#\/?/, '')

  if (isAppRoute(normalized)) {
    return hasStartedGame || normalized === 'start' ? normalized : 'start'
  }

  return getDefaultRoute(hasStartedGame)
}

export function getHashForRoute(route: AppRoute) {
  return `#/${route}`
}

export function getAdjacentRoute(route: InGameRoute, direction: 'next' | 'previous'): InGameRoute {
  const currentIndex = inGameRoutes.indexOf(route)
  const targetIndex =
    direction === 'next'
      ? Math.min(inGameRoutes.length - 1, currentIndex + 1)
      : Math.max(0, currentIndex - 1)

  return inGameRoutes[targetIndex]!
}
