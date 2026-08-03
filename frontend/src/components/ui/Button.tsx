import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useCallback, useRef, type MouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/cn'

/** Router bağlantısını modül seviyesinde sarmalıyoruz — her render'da yeniden
 *  oluşturulursa React ağacı gereksiz yere sıfırlanır. */
const MotionLink = motion.create(Link)

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'whitespace-nowrap select-none transition-colors duration-300 ' +
  'disabled:cursor-not-allowed disabled:opacity-55'

const variants: Record<Variant, string> = {
  primary:
    'text-white shadow-[0_10px_36px_-12px_rgba(61,155,255,0.85)] ' +
    'bg-[linear-gradient(100deg,#2563eb_0%,#3d9bff_45%,#22d3ee_100%)] ' +
    'hover:shadow-[0_16px_48px_-12px_rgba(61,155,255,0.95)]',
  secondary:
    'border border-white/12 bg-white/[0.04] text-fg hover:border-white/25 hover:bg-white/[0.08]',
  outline:
    'border border-brand-500/40 bg-transparent text-brand-400 hover:border-brand-400 hover:bg-brand-500/10 hover:text-white',
  ghost: 'text-fg-muted hover:text-fg',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-8 text-base',
}

export type ButtonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /**
   * '#bolum'  → sayfa içi yumuşak kaydırma
   * '/sayfa'  → React Router bağlantısı
   * 'https:'  → dış bağlantı (yeni sekme)
   */
  href?: string
  magnetic?: boolean
  /** Butonun üzerinden geçen ışık efekti (yalnızca primary). */
  shimmer?: boolean
  onClick?: (event: MouseEvent<HTMLElement>) => void
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-label'?: string
  'aria-busy'?: boolean
  'aria-controls'?: string
}

/**
 * Tek buton bileşeni: <button>, router <Link> ve <a> çıktısı verebilir.
 * Anlamlı HTML kullanılır — link linktir, buton butondur.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  magnetic = true,
  shimmer = true,
  onClick,
  type = 'button',
  disabled,
  ...aria
}: ButtonProps) {
  const { allowPointer } = useMotionProfile()
  const localRef = useRef<HTMLElement | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })
  // İçerik kabuktan daha az hareket ederek derinlik hissi verir.
  const innerX = useTransform(springX, (v) => v * 0.35)
  const innerY = useTransform(springY, (v) => v * 0.35)

  const useMagnet = magnetic && allowPointer && !disabled

  const handleMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!useMagnet) return
      const el = localRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const relX = event.clientX - (rect.left + rect.width / 2)
      const relY = event.clientY - (rect.top + rect.height / 2)
      // Hareketi sınırlayarak butonun imleçten kaçmasını engelliyoruz.
      x.set(Math.max(-14, Math.min(14, relX * 0.26)))
      y.set(Math.max(-10, Math.min(10, relY * 0.32)))
    },
    [useMagnet, x, y],
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      handleLeave()
      if (href?.startsWith('#')) {
        const moved = scrollToSection(href)
        if (moved) event.preventDefault()
      }
      onClick?.(event)
    },
    [handleLeave, href, onClick],
  )

  const content = (
    <>
      {shimmer && variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/25 blur-md transition-transform duration-700 ease-out group-hover/btn:translate-x-[400%] motion-reduce:hidden" />
        </span>
      )}
      <motion.span
        style={useMagnet ? { x: innerX, y: innerY } : undefined}
        className="relative inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </>
  )

  const classes = cn(base, variants[variant], sizes[size], className)
  const motionStyle = useMagnet ? { x: springX, y: springY } : undefined
  const handlers = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick: handleClick,
  }

  // Sayfa içi çapa veya dış bağlantı
  if (href && (href.startsWith('#') || /^(https?:|mailto:|tel:)/.test(href))) {
    const isExternal = /^https?:/.test(href)
    return (
      <motion.a
        ref={(node) => {
          localRef.current = node
        }}
        href={href}
        className={classes}
        style={motionStyle}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...handlers}
        {...aria}
      >
        {content}
      </motion.a>
    )
  }

  // Uygulama içi rota
  if (href) {
    return (
      <MotionLink
        ref={(node: HTMLAnchorElement | null) => {
          localRef.current = node
        }}
        to={href}
        className={classes}
        style={motionStyle}
        {...handlers}
        {...aria}
      >
        {content}
      </MotionLink>
    )
  }

  return (
    <motion.button
      ref={(node) => {
        localRef.current = node
      }}
      type={type}
      disabled={disabled}
      className={classes}
      style={motionStyle}
      {...handlers}
      {...aria}
    >
      {content}
    </motion.button>
  )
}
