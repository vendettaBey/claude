import { useEffect } from 'react'
import { getLenisInstance } from '@/lib/scroll'

/**
 * Mobil menü / modal açıkken arka planın kaymasını engeller.
 * Kaydırma çubuğunun kaybolmasıyla oluşan layout shift telafi edilir ve
 * Lenis çalışıyorsa o da geçici olarak durdurulur.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
    getLenisInstance()?.stop()

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
      getLenisInstance()?.start()
    }
  }, [locked])
}
