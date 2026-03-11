import { onCleanup, onMount, type Accessor } from 'solid-js'
import {
  getAdjacentRoute,
  isInGameRoute,
  type AppRoute,
  type InGameRoute,
} from '@/shared/routes'

type UseSwipeNavigationOptions = {
  route: Accessor<AppRoute>
  currentGameRoute: Accessor<InGameRoute>
  navigate: (route: AppRoute) => void
}

export function useSwipeNavigation(options: UseSwipeNavigationOptions) {
  let touchStartX = 0
  let touchStartY = 0
  let swipeEnabled = false

  const handleSwipeStart = (event: TouchEvent) => {
    const target = event.target

    swipeEnabled =
      target instanceof HTMLElement &&
      !target.closest('button, input, select, textarea, label, a, [role="dialog"]')

    if (!swipeEnabled) {
      return
    }

    touchStartX = event.changedTouches[0]?.clientX ?? 0
    touchStartY = event.changedTouches[0]?.clientY ?? 0
  }

  const handleSwipeEnd = (event: TouchEvent) => {
    if (!swipeEnabled || !isInGameRoute(options.route())) {
      return
    }

    const touch = event.changedTouches[0]

    if (!touch) {
      return
    }

    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY

    swipeEnabled = false

    if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return
    }

    options.navigate(getAdjacentRoute(options.currentGameRoute(), deltaX < 0 ? 'next' : 'previous'))
  }

  onMount(() => {
    window.addEventListener('touchstart', handleSwipeStart, { passive: true })
    window.addEventListener('touchend', handleSwipeEnd, { passive: true })
  })

  onCleanup(() => {
    window.removeEventListener('touchstart', handleSwipeStart)
    window.removeEventListener('touchend', handleSwipeEnd)
  })
}
