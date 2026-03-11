import { createSignal } from 'solid-js'
import type { PersistedGameState } from '@/domain/types'
import {
  getDefaultRoute,
  getPathForRoute,
  getRouteFromPath,
  type AppRoute,
} from '@/shared/routes'

export function useAppNavigation(hasStartedGame: () => PersistedGameState['hasStartedGame']) {
  const [route, setRoute] = createSignal<AppRoute>(resolveInitialRoute(hasStartedGame()))

  const syncRouteFromLocation = () => {
    setRoute(getRouteFromPath(window.location.pathname, hasStartedGame()))
  }

  const navigate = (nextRoute: AppRoute, options?: { replace?: boolean }) => {
    const nextPath = getPathForRoute(nextRoute)

    if (window.location.pathname !== nextPath) {
      if (options?.replace) {
        window.history.replaceState(null, '', nextPath)
      } else {
        window.history.pushState(null, '', nextPath)
      }
    }

    setRoute(nextRoute)
  }

  return {
    route,
    navigate,
    syncRouteFromLocation,
  }
}

function resolveInitialRoute(hasStartedGame: boolean): AppRoute {
  if (typeof window === 'undefined') {
    return getDefaultRoute(hasStartedGame)
  }

  return getRouteFromPath(window.location.pathname, hasStartedGame)
}
