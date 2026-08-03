import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from '@/hooks/useGsap'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { scrollState } from '@/lib/scrollState'

type Options = {
  /** Doyum noktasındaki eğim (derece). */
  maxSkew?: number
  /** Doyum noktasındaki dikey sıkışma oranı (0 = kapalı). */
  maxSquash?: number
}

/**
 * Kaydırma hızına tepki veren eğim.
 *
 * Hızlı kaydırıldığında öğe hafifçe eğilip dikeyde sıkışır, kaydırma
 * durduğunda kendiliğinden düzelir — hareketin bir ağırlığı varmış gibi durur.
 *
 * Dönüşüm doğrudan `style.transform` üzerine yazılır (React render'ı yok) ve
 * `scrollState` zaten GSAP ticker'ında güncellendiği için ekstra döngü açılmaz.
 * CSS değişkeni yerine doğrudan transform tercih edildi: değişken yazımı tüm
 * belgede stil yeniden hesabı tetiklerken bu yol yalnızca compositor'ı meşgul eder.
 */
export function useVelocitySkew<T extends HTMLElement>(
  options: Options = {},
): RefObject<T | null> {
  const { maxSkew = 4, maxSquash = 0.05 } = options
  const ref = useRef<T>(null)
  const { allowHeavy } = useMotionProfile()

  useEffect(() => {
    const el = ref.current
    if (!el || !allowHeavy) return

    let applied = -1

    const onTick = () => {
      const velocity = scrollState.velocity

      // Yalnızca gözle görülür bir değişimde DOM'a yazıyoruz.
      if (Math.abs(velocity - applied) < 0.004) return
      applied = velocity

      if (velocity === 0) {
        el.style.transform = ''
        return
      }

      const skew = (velocity * maxSkew).toFixed(3)
      const scaleY = (1 - Math.abs(velocity) * maxSquash).toFixed(4)
      el.style.transform = `skewY(${skew}deg) scaleY(${scaleY})`
    }

    gsap.ticker.add(onTick)

    return () => {
      gsap.ticker.remove(onTick)
      el.style.transform = ''
    }
  }, [allowHeavy, maxSkew, maxSquash])

  return ref
}
