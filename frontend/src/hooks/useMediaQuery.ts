import { useCallback, useSyncExternalStore } from 'react'

/**
 * Hydration güvenli medya sorgusu — ilk render'da da doğru değeri döner.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** Fare/trackpad gibi hassas bir işaretçi var mı? */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/** lg kırılımı ve üzeri. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}
