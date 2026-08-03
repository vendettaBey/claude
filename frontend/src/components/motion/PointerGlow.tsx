import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'

type PointerGlowProps = {
  children: ReactNode
  className?: string
  /** Işığın rengi (rgba dizgesi olarak). */
  color?: string
  size?: number
  /** Işık, imleci yaylı biçimde takip etsin mi? */
  smooth?: boolean
}

/**
 * İçindeki alanda imleci takip eden yumuşak ışık.
 * CTA bölümü ve footer gibi "arka plan tepki versin" istenen yerlerde kullanılır.
 */
export function PointerGlow({
  children,
  className,
  color = 'rgba(61,155,255,0.16)',
  size = 520,
  smooth = true,
}: PointerGlowProps) {
  const { allowPointer } = useMotionProfile()
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(-1000)
  const rawY = useMotionValue(-1000)
  const springX = useSpring(rawX, { stiffness: 120, damping: 24, mass: 0.6 })
  const springY = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.6 })

  const x = smooth ? springX : rawX
  const y = smooth ? springY : rawY
  const glow = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`

  const handleMove = useCallback(
    (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      rawX.set(event.clientX - rect.left)
      rawY.set(event.clientY - rect.top)
    },
    [rawX, rawY],
  )

  useEffect(() => {
    const el = ref.current
    if (!allowPointer || !el) return

    const onLeave = () => {
      rawX.set(-1000)
      rawY.set(-1000)
    }

    el.addEventListener('pointermove', handleMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', handleMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [allowPointer, handleMove, rawX, rawY])

  return (
    <div ref={ref} className={cn('relative isolate', className)}>
      {allowPointer && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: glow }}
        />
      )}
      {children}
    </div>
  )
}
