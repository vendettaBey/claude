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
            <i /> WEB TASARIM / ÖZEL YAZILIM
          </span>

          <h1 id="hero-baslik" aria-label="Markanızı dijitalde büyüten deneyimler üretiyoruz.">
            <span className="studio-heading" aria-hidden="true">
              <span>Markanızı</span>
              <span>dijitalde büyüten</span>
              <span>deneyimler üretiyoruz.</span>
            </span>
          </h1>

          <p>
            Markanızı güçlü biçimde anlatan web siteleri ve iş süreçlerinizi kolaylaştıran özel
            yazılımlar tasarlıyor, geliştiriyor ve yayına alıyoruz.
          </p>

          <div className="studio-hero-actions">
            <a
              className="studio-button"
              href="#iletisim"
              onClick={(event) => {
                if (scrollToSection('#iletisim')) event.preventDefault()
              }}
            >
              Birlikte üretelim <ArrowDownRight aria-hidden="true" />
            </a>
            <a
              className="studio-button studio-button-ghost"
              href="#hizmetler"
              onClick={(event) => {
                if (scrollToSection('#hizmetler')) event.preventDefault()
              }}
            >
              Neler yapıyoruz? <ArrowRight aria-hidden="true" />
            </a>
          </div>

          <div className="studio-trust-note">
            <span />
            <p>Tek ekipte strateji, arayüz, yazılım ve yayın sonrası gelişim.</p>
          </div>

          <div className="studio-credentials" aria-label="Çalışma yaklaşımımız">
            <span>
              <b>01</b> Strateji
            </span>
            <span>
              <b>02</b> Tasarım
            </span>
            <span>
              <b>03</b> Yazılım
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
        <span>DENEYİMİ KEŞFET</span>
        <i />
      </a>
    </section>
  )
}
