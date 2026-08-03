import { motion } from 'framer-motion'
import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { navItems } from '@/constants/site'
import { useScrolled } from '@/hooks/useScrolled'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/Button'

type HeaderProps = {
  activeSection: string | null
}

export function Header({ activeSection }: HeaderProps) {
  const scrolled = useScrolled(24)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Menü kapanınca odak her zaman onu açan butona döner.
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  /** Ana sayfada yumuşak kaydırma; alt sayfalarda tarayıcı köke gidip çapayı bulur. */
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome) return
    event.preventDefault()
    scrollToSection(href)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/8 bg-ink-950/72 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div
          className={cn(
            'container-page flex items-center justify-between gap-6 transition-[height] duration-300',
            scrolled ? 'h-16' : 'h-20',
          )}
        >
          {isHome ? (
            <a
              href="#ana-sayfa"
              onClick={(event) => handleAnchorClick(event, '#ana-sayfa')}
              aria-label="Ülkü Yazılım – ana sayfa"
              className="rounded-lg"
            >
              <Logo />
            </a>
          ) : (
            <Link to="/" aria-label="Ülkü Yazılım – ana sayfa" className="rounded-lg">
              <Logo />
            </Link>
          )}

          <nav aria-label="Ana menü" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const id = item.href.replace('#', '')
                const isActive = isHome && activeSection === id
                return (
                  <li key={item.href}>
                    <a
                      href={isHome ? item.href : `/${item.href}`}
                      onClick={(event) => handleAnchorClick(event, item.href)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                        isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.06]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Header CTA yalnızca menünün de göründüğü geniş ekranlarda durur.
                Küçük ekranda logo + hamburger + CTA aynı satırda yarışıyordu;
                mobilde çağrıyı alttaki sabit çubuk üstleniyor.
                Not: `display` sınıfı `!` ile yazılmalı — bileşenin temel
                sınıfındaki `inline-flex` aynı katmanda olduğu için aksi hâlde
                `hidden` ezilir. */}
            <Button
              href={isHome ? '#iletisim' : '/#iletisim'}
              size="sm"
              className="!hidden lg:!inline-flex"
            >
              Projenizi Konuşalım
            </Button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              aria-controls="mobil-menu"
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-fg transition-colors hover:bg-white/[0.09] lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        activeSection={activeSection}
        isHome={isHome}
      />
    </>
  )
}
