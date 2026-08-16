import { useEffect } from 'react'
import Lenis from 'lenis'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { setLenisInstance } from '@/lib/scroll'
import { ScrollTrigger, gsap } from '@/hooks/useGsap'

/**
 * Lenis yumuşak kaydırma.
 *
 * - Scroll hijacking yapmaz: tekerlek/klavye/dokunma girdisi normal yönde ve
 *   normal mesafede çalışır, yalnızca hareket yumuşatılır.
 * - Dokunmatik cihazlarda devre dışıdır (yerel kaydırma zaten akıcıdır).
 * - `prefers-reduced-motion` aktifse hiç kurulmaz.
 * - GSAP ScrollTrigger ile aynı rAF döngüsünde çalışır; iki ayrı ticker
 *   olmadığı için scroll sırasında titreme oluşmaz.
 */
export function SmoothScroll() {
  const { reduced, allowHeavy } = useMotionProfile()
  const enabled = !reduced && allowHeavy

  useEffect(() => {
    if (!enabled) {
      setLenisInstance(null)
      return
    }

    const lenis = new Lenis({
      duration: 0.82,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Dokunmatik jestleri tarayıcıya bırakıyoruz.
      syncTouch: false,
      touchMultiplier: 1,
    })

    setLenisInstance(lenis)

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      // GSAP saniye, Lenis milisaniye bekler.
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [enabled])

  return null
}
