import type { CSSProperties } from 'react'
import { techRowOne, techRowTwo, technologies } from '@/constants/technologies'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { Tooltip } from '@/components/ui/Tooltip'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { useVelocitySkew } from '@/hooks/useVelocitySkew'
import { cn } from '@/lib/cn'
import type { Technology } from '@/types'
import { TechMarkIcon } from './TechMark'

const MARQUEE_COPIES = 6

function TechChip({ tech, duplicate = false }: { tech: Technology; duplicate?: boolean }) {
  return (
    <Tooltip content={tech.description}>
      <button
        type="button"
        tabIndex={duplicate ? -1 : undefined}
        // Klavye ile de odaklanılabilir: açıklama yalnızca fareyle erişilebilir değil.
        className="tech-chip group/tech flex shrink-0 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
      >
        <span
          className="transition-transform duration-300 group-hover/tech:scale-110"
          style={{ color: tech.color }}
        >
          <TechMarkIcon mark={tech.mark} className="size-6" />
        </span>
        <span className="text-fg-muted group-hover/tech:text-fg text-sm font-medium whitespace-nowrap transition-colors">
          {tech.name}
        </span>
      </button>
    </Tooltip>
  )
}

function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: Technology[]
  reverse?: boolean
  duration: string
}) {
  // İki sıra zıt yönde aktığı için eğim de zıt verilir: hızlı kaydırmada
  // sıralar birbirinden ayrılıyormuş gibi görünür, tek blok gibi durmaz.
  const skewRef = useVelocitySkew<HTMLDivElement>({
    maxSkew: reverse ? -3.5 : 3.5,
    maxSquash: 0.05,
  })

  return (
    <div
      ref={skewRef}
      className="marquee-row mask-fade-x overflow-hidden py-1.5 will-change-transform"
    >
      <div
        className={cn(
          'marquee-track-interactive flex w-max gap-0',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
        style={{ '--marquee-duration': duration } as CSSProperties}
      >
        {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
          <div
            key={copy}
            className="flex shrink-0 gap-4 pr-4"
            // Yalnızca ilk dizi erişilebilirlik ağacında ve klavye sırasındadır.
            // Diğerleri geniş ekranlarda bile kesintisiz doluluk sağlayan görsel
            // kopyalardır; hover tooltip'i çalışır ama Tab sırasını çoğaltmazlar.
            aria-hidden={copy > 0 || undefined}
          >
            {items.map((tech) => (
              <TechChip key={`${copy}-${tech.name}`} tech={tech} duplicate={copy > 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Technologies() {
  const { reduced } = useMotionProfile()

  return (
    <Section id="teknolojiler" labelledBy="teknolojiler-baslik" className="bg-ink-900/30">
      <div className="container-page">
        <SectionHeading
          id="teknolojiler-baslik"
          index="05"
          eyebrow="Teknolojiler"
          segments={[
            { text: 'Doğru teknoloji,' },
            { text: 'daha az teknik borç', highlight: true },
          ]}
          description="Araçları popülerliğine göre değil; hız, güvenlik, bakım maliyeti ve büyüme planınıza göre seçiyoruz."
        />
      </div>

      <div className="mt-14 lg:mt-16">
        {reduced ? (
          // Hareket azaltma: akış yok, düzenli ızgara
          <div className="container-page">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {technologies.map((tech) => (
                <li key={tech.name} className="card-surface p-4">
                  <span className="flex items-center gap-3" style={{ color: tech.color }}>
                    <TechMarkIcon mark={tech.mark} className="size-6" />
                    <span className="text-fg text-sm font-medium">{tech.name}</span>
                  </span>
                  <p className="text-fg-dim mt-2.5 text-xs leading-relaxed">{tech.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            <MarqueeRow items={techRowOne} duration="52s" />
            <MarqueeRow items={techRowTwo} reverse duration="60s" />
          </div>
        )}
      </div>

      <div className="container-page mt-12">
        <Reveal>
          <p className="text-fg-dim mx-auto max-w-2xl text-center text-sm leading-relaxed">
            Sonuç: ekibinizin devralabileceği, yeni özelliklerle büyüyebilen bir altyapı.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
