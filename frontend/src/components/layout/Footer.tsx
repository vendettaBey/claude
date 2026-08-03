import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  footerServiceLinks,
  legalLinks,
  mailtoUrl,
  navItems,
  site,
  telUrl,
  whatsappUrl,
} from '@/constants/site'
import { scrollToSection } from '@/lib/scroll'
import { PointerGlow } from '@/components/motion/PointerGlow'

const currentYear = new Date().getFullYear()

export function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome) return
    event.preventDefault()
    scrollToSection(href)
  }

  /** Alt sayfalardayken çapalar ana sayfaya yönlendirilir. */
  const anchorHref = (href: string) => (isHome ? href : `/${href}`)

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink-900">
      <PointerGlow color="rgba(61,155,255,0.10)" size={560}>
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent_75%)]"
        />

        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div className="max-w-sm">
              <p className="font-display text-xl font-semibold">
                Ülkü <span className="text-gradient">Yazılım</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                İşletmelere özel kurumsal web siteleri, web uygulamaları ve dijital çözümler
                geliştiriyoruz.
              </p>
              <p className="mt-5 text-sm text-fg-dim">{site.workingHours}</p>
            </div>

            <nav aria-labelledby="footer-links">
              <h2 id="footer-links" className="text-sm font-semibold text-fg">
                Hızlı Bağlantılar
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={anchorHref(item.href)}
                      onClick={(event) => handleAnchor(event, item.href)}
                      className="inline-flex min-h-6 items-center py-0.5 text-fg-muted transition-colors hover:text-brand-400"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={anchorHref('#surec')}
                    onClick={(event) => handleAnchor(event, '#surec')}
                    className="inline-flex min-h-6 items-center py-0.5 text-fg-muted transition-colors hover:text-brand-400"
                  >
                    Çalışma Süreci
                  </a>
                </li>
              </ul>
            </nav>

            <nav aria-labelledby="footer-services">
              <h2 id="footer-services" className="text-sm font-semibold text-fg">
                Hizmetler
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {footerServiceLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={anchorHref(item.href)}
                      onClick={(event) => handleAnchor(event, item.href)}
                      className="inline-flex min-h-6 items-center py-0.5 text-fg-muted transition-colors hover:text-brand-400"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-sm font-semibold text-fg">İletişim</h2>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href={mailtoUrl}
                    className="inline-flex min-h-6 items-center gap-2.5 py-0.5 text-fg-muted transition-colors hover:text-brand-400"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden="true" />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={telUrl}
                    className="inline-flex min-h-6 items-center gap-2.5 py-0.5 text-fg-muted transition-colors hover:text-brand-400"
                  >
                    <Phone className="size-4 shrink-0" aria-hidden="true" />
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-6 items-center gap-2.5 py-0.5 text-fg-muted transition-colors hover:text-brand-400"
                  >
                    <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                    WhatsApp
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </li>
                <li className="inline-flex items-center gap-2.5 text-fg-muted">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {site.location}
                </li>
              </ul>
            </div>
          </div>

          {/* Antet bloğu — teknik çizimlerin sağ alt köşesindeki künye.
              "Mavi Baskı" konseptini kapanışta bir kez daha imzalar. */}
          <dl className="mt-14 grid grid-cols-2 border-t border-l border-white/8 sm:grid-cols-4">
            {[
              { k: 'Pafta', v: 'Kurumsal Site' },
              { k: 'Ölçek', v: '1 : 1' },
              { k: 'Revizyon', v: `R-${String(currentYear).slice(-2)}.01` },
              { k: 'Durum', v: 'Yayında' },
            ].map((cell) => (
              <div key={cell.k} className="border-r border-b border-white/8 px-4 py-3">
                <dt className="annotation text-[0.6rem] text-fg-dim/70">{cell.k}</dt>
                <dd className="mt-1 font-mono text-xs text-fg-muted">{cell.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-fg-dim">
                © {currentYear} Ülkü Yazılım. Tüm hakları saklıdır.
              </p>
              <p className="text-xs text-fg-dim/80">Düşünülerek tasarlandı, özenle geliştirildi.</p>
            </div>

            <nav aria-label="Yasal bağlantılar">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="inline-flex min-h-6 items-center py-0.5 text-fg-dim transition-colors hover:text-brand-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </PointerGlow>
    </footer>
  )
}
