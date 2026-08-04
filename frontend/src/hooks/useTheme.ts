import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'uy:theme'

function readInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const applied = document.documentElement.dataset.theme
    if (applied === 'light' || applied === 'dark') return applied
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }

  return 'dark'
}

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement

  if (animate) root.classList.add('theme-transitioning')
  root.dataset.theme = theme
  root.style.colorScheme = theme

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  themeColor?.setAttribute('content', theme === 'light' ? '#f4f6fa' : '#02040a')

  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* Depolama kapalıysa tema yine mevcut oturumda çalışır. */
  }

  if (animate) {
    window.setTimeout(() => root.classList.remove('theme-transitioning'), 520)
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    applyTheme(theme, false)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next, true)
    setTheme(next)
  }, [theme])

  return { theme, toggleTheme } as const
}
