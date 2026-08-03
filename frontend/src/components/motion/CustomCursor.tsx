import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useMotionProfile } from '@/hooks/useMotionProfile'

/**
 * İmleç eşlikçisi — "Mavi Baskı" konseptinin imleç karşılığı.
 *
 * Merkezde bir nişangâh (dolu nokta yerine artı işareti), etrafında kesikli
 * bir ölçüm halkası ve yanında canlı piksel koordinatı taşır. Aynı görsel dil
 * (kesikli çizgi, monospace anotasyon, artı işareti) HeroVisual'daki ölçü
 * kotlarında da kullanılıyor; imleç böylece kimliği sayfanın her yerine
 * taşıyan tek noktaya dönüşüyor.
 *
 * Sistem imlecini gizlemez — yalnızca eşlik eder, kullanılabilirlik bozulmaz.
 * Dokunmatik cihazlarda ve hareket azaltma tercihinde render edilmez.
 */
export function CustomCursor() {
  const { allowPointer, allowHeavy } = useMotionProfile()
  const enabled = allowPointer && allowHeavy

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 240, damping: 26, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 240, damping: 26, mass: 0.5 })

  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)
  const coordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)

      // Koordinat metni React state'i tetiklemeden doğrudan DOM'a yazılır —
      // her fare hareketinde render döngüsüne girmemek için (bkz.
      // `useVelocitySkew`, `ScrollSignal` — aynı disiplin burada da geçerli).
      const node = coordRef.current
      if (node) {
        const px = String(Math.round(event.clientX)).padStart(4, '0')
        const py = String(Math.round(event.clientY)).padStart(4, '0')
        node.textContent = `X ${px} · Y ${py}`
      }

      const target = event.target as Element | null
      setActive(
        Boolean(
          target?.closest?.(
            'a, button, [role="button"], input, textarea, select, summary, [data-cursor="active"]',
          ),
        ),
      )
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] hidden lg:block">
      {/* Merkez nişangâh: dolu nokta yerine artı işareti — teknik alet hissi. */}
      <motion.span
        className="absolute top-0 left-0"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: active ? 0.4 : 1 }}
        transition={{ duration: 0.18 }}
      >
        <span className="absolute top-1/2 left-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-brand-400" />
        <span className="absolute top-1/2 left-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-brand-400" />
      </motion.span>

      {/* Ölçüm halkası: kesikli çevre, hedefin üzerine gelince büyür. */}
      <motion.span
        className="absolute top-0 left-0 rounded-full border border-dashed border-brand-400/70"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? (active ? 0.95 : 0.4) : 0,
          width: active ? 44 : 28,
          height: active ? 44 : 28,
          rotate: active ? 45 : 0,
          backgroundColor: active ? 'rgba(61,155,255,0.1)' : 'rgba(61,155,255,0)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      />

      {/* Canlı koordinat okuması — hedefin üzerinde kalabalık etmemesi için
          yalnızca boş alanda gösterilir. */}
      <motion.span
        ref={coordRef}
        className="annotation absolute top-0 left-0 whitespace-nowrap text-brand-400/70"
        style={{ x, y, translateX: '14px', translateY: '14px' }}
        animate={{ opacity: visible && !active ? 0.75 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}
