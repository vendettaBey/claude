import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Mail, MessageCircle, Phone, X } from 'lucide-react'
import { mailtoUrl, navItems, site, telUrl, whatsappUrl } from '@/constants/site'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { scrollToSection } from '@/lib/scroll'
import { Logo } from './Logo'
import { Button } from '@/components/ui/Button'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  activeSection: string | null
  /** Ana sayfada değilsek çapa bağlantıları köke yönlendirilir. */
  isHome: boolean
}

/**
 * Tam ekran mobil menü.
 * - Escape ile kapanır, odak menü içinde döner (focus trap),
 * - Açıkken arka plan kaydırması kilitlenir,
 * - `aria-modal` ile arka plan ekran okuyuculardan ayrılır,
 * - Kapanışta odak menüyü açan butona geri döner.
 */
export function MobileMenu({ open, onClose, activeSection, isHome }: MobileMenuProps) {
  const { reduced } = useMotionProfile()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 60)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
      // Odağın menüyü açan butona dönmesini `onClose` üstlenir (Header);
      // böylece odak geri dönüşü activeElement tahminine bağlı kalmaz.
    }
  }, [open, onClose])

  const handleNavigate = (href: string) => {
    onClose()
    // Menü kapanma animasyonu bitince kaydır — iki hareket üst üste binmesin.
    window.setTimeout(() => scrollToSection(href), reduced ? 0 : 240)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          ref={panelRef}
          id="mobil-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menüsü"
          className="fixed inset-0 z-[80] flex flex-col bg-ink-950/97 backdrop-blur-xl lg:hidden"
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            transition: { duration: reduced ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            opacity: 0,
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: reduced ? 0 : 0.28, ease: [0.4, 0, 1, 1] },
          }}
        >
          <div aria-hidden="true" className="bg-dots pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative flex items-center justify-between px-5 py-4">
            <Logo />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Menüyü kapat"
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-fg transition-colors hover:bg-white/[0.09]"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobil ana menü" className="relative flex-1 overflow-y-auto px-5 pt-4 pb-10">
            <ul className="flex flex-col">
              {navItems.map((item, index) => {
                const isActive = isHome && activeSection === item.href.replace('#', '')
                return (
                  <motion.li
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, x: -18 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: reduced ? 0 : 0.1 + index * 0.05,
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }}
                  >
                    <a
                      href={isHome ? item.href : `/${item.href}`}
                      onClick={(event) => {
                        if (!isHome) return
                        event.preventDefault()
                        handleNavigate(item.href)
                      }}
                      aria-current={isActive ? 'true' : undefined}
                      className="flex items-baseline gap-4 border-b border-white/5 py-4 font-display text-2xl font-semibold text-fg transition-colors hover:text-brand-400 aria-[current]:text-brand-400"
                    >
                      <span className="font-sans text-xs text-fg-dim tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </a>
                  </motion.li>
                )
              })}
            </ul>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: reduced ? 0 : 0.42, duration: 0.5 },
              }}
            >
              <Button
                href={isHome ? '#iletisim' : '/#iletisim'}
                size="lg"
                magnetic={false}
                className="w-full"
                onClick={(event) => {
                  if (!isHome) return
                  event.preventDefault()
                  handleNavigate('#iletisim')
                }}
              >
                Projenizi Konuşalım
              </Button>

              <div className="mt-4 grid gap-2 text-sm">
                <a
                  href={telUrl}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-fg-muted transition-colors hover:text-fg"
                >
                  <Phone className="size-4 text-brand-400" aria-hidden="true" />
                  {site.phone}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-fg-muted transition-colors hover:text-fg"
                >
                  <MessageCircle className="size-4 text-emerald-400" aria-hidden="true" />
                  WhatsApp'tan yaz
                </a>
                <a
                  href={mailtoUrl}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-fg-muted transition-colors hover:text-fg"
                >
                  <Mail className="size-4 text-cyan-glow" aria-hidden="true" />
                  {site.email}
                </a>
              </div>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
