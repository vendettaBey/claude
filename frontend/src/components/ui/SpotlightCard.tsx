import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { useCallback, type MouseEvent, type ReactNode } from 'react'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/cn'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  /** Işık huzmesinin rengi. */
  accent?: string
  /** İmleç konumuna göre hafif perspektif değişimi. */
  tilt?: boolean
  /** Hover'da yükselme. */
  lift?: boolean
  /** Kontur çizim sekansı ("önce çizilir, sonra dolar"). */
  draw?: boolean
  as?: 'div' | 'article' | 'li'
}

/** Kart köşe yarıçapı (--radius-card = 1.25rem). Konturun kartla hizalanması için. */
const CARD_RADIUS = 20

/**
 * "Mavi Baskı" kartı.
 *
 * Görünür alana girdiğinde önce SVG konturu çizilir (`stroke-dashoffset`),
 * ardından yüzey dolgusu belirir — kart paftadan inşa ediliyormuş gibi kurulur.
 * İmleç konumuna göre ışık alır; dokunmatik cihazlarda bu efekt hiç kurulmaz.
 */
export function SpotlightCard({
  children,
  className,
  accent = '#3d9bff',
  tilt = false,
  lift = true,
  draw = true,
  as: Tag = 'div',
}: SpotlightCardProps) {
  const { allowPointer, reduced } = useMotionProfile()
  // Aynı ref hem görünürlük tetikleyicisi hem de imleç ölçümü için kullanılır.
  const [ref, inView] = useInViewOnce<HTMLDivElement>({ enabled: !reduced })

  const drawEnabled = draw && !reduced
  const drawn = !drawEnabled || inView

  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 })

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mouseX}px ${mouseY}px, ${accent}22, transparent 72%)`
  const borderGlow = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${accent}70, transparent 70%)`

  const handleMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!allowPointer) return
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const px = event.clientX - rect.left
      const py = event.clientY - rect.top
      mouseX.set(px)
      mouseY.set(py)

      if (tilt) {
        rotateY.set((px / rect.width - 0.5) * 6)
        rotateX.set(-(py / rect.height - 0.5) * 6)
      }
    },
    [allowPointer, mouseX, mouseY, rotateX, rotateY, tilt, ref],
  )

  const handleLeave = useCallback(() => {
    mouseX.set(-500)
    mouseY.set(-500)
    rotateX.set(0)
    rotateY.set(0)
  }, [mouseX, mouseY, rotateX, rotateY])

  // Union'ı tek somut bileşene daraltıyoruz: çalışma zamanında doğru etiket
  // render edilir, tip tarafında ref/olay imzaları tek biçimde kalır.
  const MotionTag = motion[Tag] as typeof motion.div

  return (
    <MotionTag
      ref={ref}
      data-drawn={drawn ? 'true' : 'false'}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={tilt && allowPointer ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
      whileHover={lift && allowPointer ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={cn(
        // Kart tam çerçeve yerine kesit köşe işaretleriyle tanımlanır.
        'corner-marks group relative isolate overflow-hidden rounded-card border',
        drawEnabled ? 'card-draw' : 'card-surface',
        'transition-colors duration-300 hover:border-white/20',
        className,
      )}
    >
      {/* Kontur çizimi. Dash değerleri ve geçiş CSS tarafında (`card-draw`)
          tanımlıdır; burada yalnızca geometri ve renk verilir. Animasyonu
          JS yerine CSS'in sürmesi, SVG özniteliklerinde daha güvenilir. */}
      {drawEnabled && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-[0.5px] h-[calc(100%-1px)] w-[calc(100%-1px)] overflow-visible"
        >
          <rect
            width="100%"
            height="100%"
            rx={CARD_RADIUS - 0.5}
            fill="none"
            stroke={accent}
            strokeWidth={1}
            strokeOpacity={0.55}
            pathLength={1}
          />
        </svg>
      )}

      {allowPointer && (
        <>
          {/* Kenarlıkta gezen ışık */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: borderGlow }}
          />
          {/* Kenar ışığının içeriyi doldurmaması için opak iç yüzey */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-px -z-10 rounded-[inherit] bg-ink-900/95"
          />
          {/* Yüzeyde gezen yumuşak huzme */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
        </>
      )}
      {children}
    </MotionTag>
  )
}
