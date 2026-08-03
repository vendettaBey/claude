import { useEffect, useState } from 'react'

/**
 * Görünür bölümün id'sini döndürür — header'daki aktif menü vurgusu için.
 * Scroll dinleyicisi yerine IntersectionObserver kullanır.
 */
export function useActiveSection(ids: string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const visibility = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (best) setActive(best)
      },
      {
        // Header yüksekliği kadar üstten kırp, alt yarıyı hesaba katma
        rootMargin: '-88px 0px -45% 0px',
        threshold: [0, 0.15, 0.3, 0.5, 0.75],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, enabled])

  // Kapalıyken saklanan değeri sıfırlamak yerine doğrudan null döneriz;
  // böylece etkide gereksiz bir setState zinciri oluşmaz.
  return enabled ? active : null
}
