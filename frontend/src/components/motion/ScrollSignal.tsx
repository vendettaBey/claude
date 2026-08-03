import { useEffect } from 'react'
import { gsap } from '@/hooks/useGsap'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { scrollState, scrollableDistance } from '@/lib/scrollState'

/**
 * `scrollState`'in tek yazıcısı.
 *
 * Kendi rAF döngüsünü açmaz: GSAP ticker'ı zaten çalışıyor (Lenis de aynı
 * ticker'a bağlı, bkz. `SmoothScroll`). Böylece sayfada kaydırmayı okuyan
 * tek bir döngü kalır ve okuma/yazma sırası her karede aynıdır.
 *
 * Hızı burada yumuşatıyoruz: ham kare farkı sıçramalı olduğu için doğrudan
 * kullanılırsa skew efektleri titrer.
 */
export function ScrollSignal() {
  const { reduced, allowPointer } = useMotionProfile()

  useEffect(() => {
    // Hareket azaltma tercihinde hız/işaretçi türevleri hep 0 kalır; konum
    // yine de yazılır çünkü bazı bileşenler yalnızca ilerlemeyi okur.
    let previousY = window.scrollY
    let smoothedVelocity = 0

    const onTick = () => {
      const y = window.scrollY
      const distance = scrollableDistance()

      scrollState.y = y
      scrollState.progress = Math.min(1, Math.max(0, y / distance))

      if (reduced) {
        scrollState.velocity = 0
        previousY = y
        return
      }

      // Kare başına piksel farkını -1…1 bandına oturtuyoruz. 60 piksel/kare
      // hızlı ama makul bir tavan; üzeri zaten doyuma ulaşmış sayılır.
      const raw = Math.max(-1, Math.min(1, (y - previousY) / 60))
      previousY = y

      // Üstel yumuşatma: ani sıçramaları yutar, yön değişimini korur.
      smoothedVelocity += (raw - smoothedVelocity) * 0.12
      // Çok küçük artıkları sıfıra çekiyoruz; aksi hâlde sayfa dururken
      // CSS değişkeni sonsuza kadar mikro güncellenir.
      if (Math.abs(smoothedVelocity) < 0.0015) smoothedVelocity = 0

      scrollState.velocity = smoothedVelocity
    }

    gsap.ticker.add(onTick)
    // İlk değerleri ticker'ın ilk karesini beklemeden yazıyoruz.
    onTick()

    return () => {
      gsap.ticker.remove(onTick)
      scrollState.velocity = 0
    }
  }, [reduced])

  useEffect(() => {
    if (!allowPointer) {
      scrollState.pointerX = 0
      scrollState.pointerY = 0
      return
    }

    // Olay içinde yalnızca ham değer saklanır; normalize etme işi ticker'da
    // yapılmaz çünkü pointermove zaten kare hızından seyrek gelir.
    const onPointerMove = (event: PointerEvent) => {
      scrollState.pointerX = (event.clientX / window.innerWidth) * 2 - 1
      scrollState.pointerY = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [allowPointer])

  return null
}
