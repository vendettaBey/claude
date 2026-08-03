import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/cn'

type Reveal3DProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Girişteki eğim (derece). Kart yatay eksende hafifçe yatıp doğrulur. */
  tilt?: number
  /** Derinlikten geliş mesafesi (piksel). */
  depth?: number
  /** Yatay kayma — ızgaralarda sütuna göre yön vermek için. */
  offsetX?: number
  as?: 'div' | 'li' | 'article'
}

/**
 * Perspektifli giriş animasyonu.
 *
 * Düz `Reveal` (opacity + y) yerine öğe gerçekten derinlikten gelir:
 * `rotateX` ile hafifçe yatar, `translateZ` ile yaklaşır. Perspektif
 * sarmalayıcının kendisinde tanımlıdır; ebeveyne `transform-style` bağımlılığı
 * bırakmaz, böylece herhangi bir ızgarada tek başına kullanılabilir.
 *
 * Görünürlük kararını `useInViewOnce` verir — içerik hiçbir koşulda
 * `opacity: 0` durumunda kilitli kalmaz.
 */
export function Reveal3D({
  children,
  className,
  delay = 0,
  tilt = 12,
  depth = 90,
  offsetX = 0,
  as = 'div',
}: Reveal3DProps) {
  const { reduced, allowHeavy } = useMotionProfile()
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ enabled: !reduced })

  if (reduced) {
    const Tag = as as 'div'
    return <Tag className={className}>{children}</Tag>
  }

  // Dar ekranda ve dokunmatikte 3B eğimi kapatıp sade kaydırmaya düşüyoruz:
  // küçük ekranda perspektif dönüşü içeriği bulanık gösteriyor.
  const useDepth = allowHeavy
  const MotionTag = motion[as] as typeof motion.div

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: 34,
      x: useDepth ? offsetX : 0,
      rotateX: useDepth ? tilt : 0,
      z: useDepth ? -depth : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateX: 0,
      z: 0,
      transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <MotionTag
      ref={ref}
      className={cn(useDepth && 'will-change-transform', className)}
      style={useDepth ? { transformPerspective: 1100, transformStyle: 'preserve-3d' } : undefined}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}
