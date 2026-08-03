import { motion, useScroll, useSpring } from 'framer-motion'
import { useMotionProfile } from '@/hooks/useMotionProfile'

const BAR_CLASS =
  'fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[linear-gradient(90deg,#2563eb,#3d9bff,#22d3ee,#8b5cf6)]'

/** Tarayıcı scroll ile sürülen CSS animasyonlarını destekliyor mu? */
const supportsScrollTimeline =
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('animation-timeline: scroll()')

/**
 * Sayfanın üstündeki okuma ilerleme göstergesi.
 *
 * Modern tarayıcılarda `animation-timeline: scroll()` kullanılır: çubuk
 * doğrudan kaydırma konumuna bağlanır, her karede JavaScript çalışmaz ve
 * animasyon compositor üzerinde ilerler.
 *
 * Desteklemeyen tarayıcılarda Framer Motion tabanlı yedek devreye girer.
 */
export function ScrollProgress() {
  const { reduced } = useMotionProfile()

  if (supportsScrollTimeline) {
    return <div aria-hidden="true" className={`${BAR_CLASS} scroll-progress-css`} />
  }

  return <FramerScrollProgress reduced={reduced} />
}

function FramerScrollProgress({ reduced }: { reduced: boolean }) {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      className={BAR_CLASS}
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
    />
  )
}
