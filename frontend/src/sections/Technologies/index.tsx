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

function TechChip({ tech }: { tech: Technology }) {
  return (
    <Tooltip content={tech.description}>
      <button
        type="button"
        // Klavye ile de odaklanılabilir: açıklama yalnızca fareyle erişilebilir değil.
        className="group/tech flex shrink-0 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
      >
        <span
          className="transition-transform duration-300 group-hover/tech:scale-110"
          style={{ color: tech.color }}
        >
          <TechMarkIcon mark={tech.mark} className="size-6" />
        </span>
        <span className="text-sm font-medium whitespace-nowrap text-fg-muted transition-colors group-hover/tech:text-fg">
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
    <div ref={skewRef} className="mask-fade-x group overflow-hidden py-1.5 will-change-transform">
      <div
        className={cn(
          'flex w-max gap-4',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          // Üzerine gelince akış belirgin biçimde yavaşlar (durmaz).
          'group-hover:[animation-duration:150s]',
        )}
        style={{ '--marquee-duration': duration } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 gap-4"
            // İkinci kopya yalnızca kesintisiz akış için var. `aria-hidden` tek
            // başına yetmez: içindeki butonlar klavye odağı almaya devam eder.
            // `inert` hem odağı hem erişilebilirlik ağacını kapatır.
            aria-hidden={copy === 1 || undefined}
            inert={copy === 1}
          >
            {items.map((tech) => (
              <TechChip key={`${copy}-${tech.name}`} tech={tech} />
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
            { text: 'Güncel, güvenli ve' },
            { text: 'sürdürülebilir teknolojiler', highlight: true },
          ]}
          description="Her proje için tek bir teknoloji kalıbı kullanmak yerine ihtiyaca en uygun araçları seçiyoruz. Hedefimiz yalnızca güncel görünen değil; hızlı, güvenli, sürdürülebilir ve geliştirilebilir sistemler kurmak."
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
                    <span className="text-sm font-medium text-fg">{tech.name}</span>
                  </span>
                  <p className="mt-2.5 text-xs leading-relaxed text-fg-dim">{tech.description}</p>
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
          <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-fg-dim">
            Teknoloji seçimini modaya göre değil, projenin gerçek ihtiyacına göre yapıyoruz.
            Amacımız uzun vadede desteklenebilen, ekibinizin devralabileceği bir altyapı bırakmak.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
