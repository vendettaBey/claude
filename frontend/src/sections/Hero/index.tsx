import { useCallback, useRef, type PointerEvent } from 'react'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { scrollToSection } from '@/lib/scroll'
import { HeroOrbit } from './HeroOrbit'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const section = sectionRef.current
    if (!section || event.pointerType === 'touch') return
    const rect = section.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12
    section.style.setProperty('--pointer-x', `${x}px`)
    section.style.setProperty('--pointer-y', `${y}px`)
  }, [])

  const handlePointerLeave = useCallback(() => {
    sectionRef.current?.style.setProperty('--pointer-x', '0px')
    sectionRef.current?.style.setProperty('--pointer-y', '0px')
  }, [])

  return (
    <section
      id="ana-sayfa"
      ref={sectionRef}
      aria-labelledby="hero-baslik"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="studio-hero"
    >
      <div className="studio-hero-grid" aria-hidden="true" />

      <aside className="studio-rail" aria-hidden="true">
        <span>DIGITAL STUDIO / 2026</span>
        <i />
        <span>STRATEJİ → TASARIM → YAZILIM</span>
      </aside>

      <div className="studio-hero-layout">
        <div className="studio-hero-copy">
          <span className="studio-eyebrow">
            <i /> WEB SİTESİ / İŞLETME YAZILIMI
          </span>

          <h1
            id="hero-baslik"
            aria-label="Web sitesi değil, işinizi hızlandıran dijital sistemler kuruyoruz."
          >
            <span className="studio-heading" aria-hidden="true">
              <span>Web sitesi değil,</span>
              <span>işinizi hızlandıran</span>
              <span>dijital sistemler.</span>
            </span>
          </h1>

          <p>
            Kurumsal web siteleri, müşteri portalları ve işletmenize özel yönetim yazılımları
            geliştiriyoruz. Ekibiniz daha az manuel iş yapıyor, müşteriniz aradığına daha hızlı
            ulaşıyor.
          </p>

          <div className="studio-hero-actions">
            <a
              className="studio-button"
              href="#iletisim"
              onClick={(event) => {
                if (scrollToSection('#iletisim')) event.preventDefault()
              }}
            >
              İhtiyacımı anlatayım <ArrowDownRight aria-hidden="true" />
            </a>
            <a
              className="studio-button studio-button-ghost"
              href="#hizmetler"
              onClick={(event) => {
                if (scrollToSection('#hizmetler')) event.preventDefault()
              }}
            >
              Çözümleri incele <ArrowRight aria-hidden="true" />
            </a>
          </div>

          <div className="studio-trust-note">
            <span />
            <p>Tek ekip, tek plan: tasarım, yazılım ve yayın sonrası destek.</p>
          </div>

          <div className="studio-credentials" aria-label="Çalışma yaklaşımımız">
            <span>
              <b>01</b> İhtiyaç
            </span>
            <span>
              <b>02</b> Tasarım
            </span>
            <span>
              <b>03</b> Sistem
            </span>
          </div>
        </div>

        <div className="studio-hero-visual">
          <HeroOrbit />
        </div>
      </div>

      <a
        className="studio-hero-bottom"
        href="#hizmetler"
        onClick={(event) => {
          if (scrollToSection('#hizmetler')) event.preventDefault()
        }}
      >
        <span>ÇÖZÜMLERİ İNCELE</span>
        <i />
      </a>
    </section>
  )
}
