import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'

type ParallaxProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /**
   * Katmanın kaydırmaya göre ne kadar kayacağı.
   * Pozitif = zeminden yavaş (geride durur), negatif = daha hızlı (önde durur).
   * 0.2 civarı fark edilir ama rahatsız etmez.
   */
  speed?: number
  /** Kaydırma boyunca uygulanacak toplam dönüş (derece). */
  rotate?: number
  /** Görünürken uygulanacak ölçek aralığı, [giriş, çıkış]. */
  scale?: [number, number]
  /** Kenarlarda saydamlaşsın mı? */
  fade?: boolean
  as?: 'div' | 'span' | 'li'
  /** Dekoratif katmanlarda erişilebilirlik ağacından çıkarmak için. */
  'aria-hidden'?: boolean
}

/**
 * Kaydırmaya bağlı katman kaydırması.
 *
 * Ölçüm öğenin kendisine bağlıdır (`useScroll({ target })`), sayfanın tamamına
 * değil; böylece aynı bileşen sayfanın herhangi bir yerinde doğru davranır.
 *
 * Yaylı yumuşatma bilinçli: ham `scrollYProgress` Lenis ile birlikte
 * kullanıldığında katmanlar birbirinden bağımsız titriyordu.
 */
export function Parallax({
  children,
  className,
  style,
  speed = 0.18,
  rotate = 0,
  scale,
  fade = false,
  as: Tag = 'div',
  'aria-hidden': ariaHidden,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { allowHeavy } = useMotionProfile()

  const { scrollYProgress } = useScroll({
    target: ref,
    // Öğe ekranın altından girerken 0, üstünden çıkarken 1.
    offset: ['start end', 'end start'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  // `speed` yüzdeye çevrilir: 0.18 → öğe yüksekliğinin %18'i kadar yol.
  const y = useTransform(smooth, [0, 1], [`${speed * 50}%`, `${-speed * 50}%`])
  const rotateZ = useTransform(smooth, [0, 1], [rotate, -rotate])
  const scaleValue = useTransform(smooth, [0, 0.5, 1], scale ? [scale[0], scale[1], scale[0]] : [1, 1, 1])
  const opacity = useTransform(smooth, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.35])

  const MotionTag = motion[Tag] as typeof motion.div

  if (!allowHeavy) {
    const Plain = Tag as 'div'
    // Ref burada da bağlanır: bağlanmazsa `useScroll` hedefini bulamaz ve
    // Framer her mobil render'ında konsola uyarı basar.
    return (
      <Plain ref={ref} className={className} style={style} aria-hidden={ariaHidden}>
        {children}
      </Plain>
    )
  }

  return (
    <MotionTag
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn('will-change-transform', className)}
      style={{
        ...style,
        y,
        ...(rotate ? { rotate: rotateZ } : null),
        ...(scale ? { scale: scaleValue } : null),
        ...(fade ? { opacity } : null),
      }}
    >
      {children}
    </MotionTag>
  )
}
