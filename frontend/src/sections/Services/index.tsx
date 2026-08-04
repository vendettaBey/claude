import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { services } from '@/constants/services'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { scrollToSection } from '@/lib/scroll'
import type { Service } from '@/types'

const featuredServiceIds = [
  'kurumsal-web-sitesi',
  'web-uygulamasi',
  'erp-isletme-yonetimi',
] as const

const servicePromises: Record<(typeof featuredServiceIds)[number], string> = {
  'kurumsal-web-sitesi': 'Güven veren bir dijital vitrin',
  'web-uygulamasi': 'Daha hızlı çalışan iş süreçleri',
  'erp-isletme-yonetimi': 'Tüm operasyon tek sistemde',
}

function selectService(service: Service) {
  window.history.replaceState(null, '', '#iletisim')
  window.dispatchEvent(new CustomEvent('uy:select-service', { detail: service.formValue }))
  scrollToSection('#iletisim')
}

export function Services() {
  const featuredServices = featuredServiceIds.map((id) => {
    const service = services.find((item) => item.id === id)
    if (!service) throw new Error(`Öne çıkarılan hizmet bulunamadı: ${id}`)
    return service
  })
  const supportingServices = services.filter(
    (service) => !featuredServiceIds.includes(service.id as (typeof featuredServiceIds)[number]),
  )

  return (
    <Section id="hizmetler" labelledBy="hizmetler-baslik" className="overflow-hidden">
      <AmbientBackground grid orbs={false} fadeBottom={false} />

      <div className="container-page">
        <SectionHeading
          id="hizmetler-baslik"
          index="01"
          eyebrow="Hizmetler"
          segments={[{ text: 'İhtiyacınıza göre' }, { text: 'üç net çözüm', highlight: true }]}
          description="Güven veren bir web sitesi, iş akışını hızlandıran bir uygulama veya operasyonu tek yerde toplayan yönetim sistemi."
        />

        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-3">
          {featuredServices.map((service, index) => {
            const Icon = service.icon
            return (
              <Reveal key={service.id} delay={index * 0.08} className="h-full">
                <SpotlightCard
                  as="article"
                  accent={service.accent}
                  className="premium-glass-card flex h-full flex-col p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="feature-icon-surface grid size-11 shrink-0 place-items-center rounded-xl border border-white/10"
                      style={{
                        color: service.accent,
                        background: `linear-gradient(140deg, ${service.accent}24, transparent 72%)`,
                      }}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="annotation text-fg-dim text-[0.6rem]">0{index + 1}</span>
                  </div>

                  <p className="text-brand-400 mt-5 text-xs font-semibold tracking-[0.08em] uppercase">
                    {servicePromises[service.id as (typeof featuredServiceIds)[number]]}
                  </p>
                  <h3 className="font-display text-fg mt-2 text-xl leading-tight font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-fg-muted mt-3 line-clamp-3 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="mt-5 grid gap-2">
                    {service.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="text-fg-muted flex items-start gap-2 text-sm">
                        <Check
                          className="mt-0.5 size-3.5 shrink-0"
                          style={{ color: service.accent }}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#iletisim"
                    onClick={(event) => {
                      event.preventDefault()
                      selectService(service)
                    }}
                    className="group/link text-brand-400 mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium"
                  >
                    Projeyi konuşalım
                    <ArrowRight
                      className="size-4 transition-transform group-hover/link:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.12} className="mt-5">
          <div className="rounded-card border border-white/8 bg-white/[0.025] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <p className="text-fg flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="text-brand-400 size-4" aria-hidden="true" />
                  Tamamlayıcı uzmanlıklar
                </p>
                <p className="text-fg-dim mt-1.5 text-sm leading-relaxed">
                  Projenin ihtiyacına göre bu hizmetleri ana çözüme ekliyoruz.
                </p>
              </div>

              <div className="flex max-w-3xl flex-wrap gap-2">
                {supportingServices.map((service) => {
                  const Icon = service.icon
                  return (
                    <a
                      key={service.id}
                      href="#iletisim"
                      onClick={(event) => {
                        event.preventDefault()
                        selectService(service)
                      }}
                      className="support-chip group/chip text-fg-muted hover:text-fg inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 text-xs font-medium transition-colors hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      <Icon
                        className="size-3.5"
                        style={{ color: service.accent }}
                        aria-hidden="true"
                      />
                      {service.title}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16} className="mt-5 text-center">
          <p className="text-fg-muted text-sm">
            Neye ihtiyacınız olduğundan emin değil misiniz?{' '}
            <a
              href="#iletisim"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('#iletisim')
              }}
              className="text-brand-400 decoration-brand-400/30 hover:text-fg font-medium underline underline-offset-4 transition-colors"
            >
              İhtiyacınızı anlatın, doğru yolu birlikte seçelim.
            </a>
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
