import { useEffect, useState } from 'react'

/**
 * Sayfa belirtilen eşiği geçtiğinde true döner.
 * Dinleyici passive ve requestAnimationFrame ile sınırlandırılmıştır.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}
