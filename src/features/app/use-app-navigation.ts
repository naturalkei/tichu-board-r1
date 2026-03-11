import { createSignal } from 'solid-js'
import type { PersistedGameState } from '@/domain/types'
import {
  getDefaultRoute,
  getHashForRoute,
  getRouteFromHash,
  type AppRoute,
} from '@/shared/routes'

export function useAppNavigation(hasStartedGame: () => PersistedGameState['hasStartedGame']) {
  const [route, setRoute] = createSignal<AppRoute>(resolveInitialRoute(hasStartedGame()))

  const syncRouteFromLocation = () => {
    setRoute(getRouteFromHash(window.location.hash, hasStartedGame()))
  }

  const navigate = (nextRoute: AppRoute, options?: { replace?: boolean }) => {
    const nextHash = getHashForRoute(nextRoute)

    if (window.location.hash !== nextHash) {
      if (options?.replace) {
        window.history.replaceState(null, '', nextHash)
      } else {
        window.history.pushState(null, '', nextHash)
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

  return getRouteFromHash(window.location.hash, hasStartedGame)
}
