import { ArrowRight, Check } from 'lucide-react'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/cn'
import type { Service } from '@/types'

type ServiceCardProps = {
  service: Service
  /** Bento grid'de geniş yerleşim — özellikler iki sütuna açılır. */
  wide?: boolean
}

/**
 * Hizmet kartı.
 *
 * Özellik listesi hover'a bağlı DEĞİLDİR — her zaman okunur; hover yalnızca
 * ışık, kenarlık ve ok hareketini güçlendirir. Böylece dokunmatik cihazlarda
 * bilgi kaybı olmaz.
 */
export function ServiceCard({ service, wide = false }: ServiceCardProps) {
  const Icon = service.icon

  return (
    <SpotlightCard
      as="article"
      accent={service.accent}
      tilt
      className="flex h-full flex-col p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(140deg, ${service.accent}26, transparent 70%)`,
            color: service.accent,
          }}
        >
          <Icon className="size-5.5" aria-hidden="true" />
        </span>
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold text-fg sm:text-xl">
        {service.title}
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-muted">{service.description}</p>

      <ul className={cn('mt-6 grid gap-2.5', wide ? 'sm:grid-cols-2' : 'grid-cols-1')}>
        {service.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-fg-muted">
            <Check
              className="mt-0.5 size-4 shrink-0"
              style={{ color: service.accent }}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* Kart CTA'sı: iletişim formuna götürür ve seçili hizmeti önceden doldurur */}
      <a
        href="#iletisim"
        onClick={(event) => {
          event.preventDefault()
          // Form, adres çubuğundaki hizmet parametresini okuyup ilgili seçeneği işaretler.
          window.history.replaceState(null, '', `#iletisim`)
          window.dispatchEvent(
            new CustomEvent('uy:select-service', { detail: service.formValue }),
          )
          scrollToSection('#iletisim')
        }}
        // Dokunma hedefi en az 44px: negatif margin ile görsel hizayı bozmadan
        // tıklanabilir alanı büyütüyoruz.
        className="group/link mt-5 -mx-2 inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-2 text-sm font-medium transition-colors"
        style={{ color: service.accent }}
      >
        {service.cta}
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover/link:translate-x-1"
          aria-hidden="true"
        />
      </a>
    </SpotlightCard>
  )
}
