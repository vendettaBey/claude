import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { useInViewOnce } from '@/hooks/useInViewOnce'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Kartların sırayla görünmesi için gecikme (saniye). */
  delay?: number
  direction?: Direction
  distance?: number
  as?: 'div' | 'li' | 'span' | 'p'
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
}

/**
 * İçeriği görünür alana girdiğinde yumuşakça getirir.
 * Görünürlük kararını `useInViewOnce` verir; o hook içerik hiçbir koşulda
 * gizli kalmayacak şekilde güvenlik katmanları taşır.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 24,
  as = 'div',
}: RevealProps) {
  const { reduced } = useMotionProfile()
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ enabled: !reduced })

  if (reduced) {
    // Union'ı somut bir etikete daraltıyoruz; çalışma zamanında doğru etiket
    // render edilir, TypeScript de JSX prop'larını çözebilir.
    const Tag = as as 'div'
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as] as typeof motion.div
  const offset = offsets[direction]
  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x * distance, y: offset.y * distance },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}
