import { Quote, TrendingUp } from 'lucide-react'
import { caseStudies, testimonials, hasCaseStudies, hasTestimonials } from '@/constants/proof'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal3D } from '@/components/motion/Reveal3D'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

/**
 * Gerçek referanslar ve müşteri yorumları.
 *
 * Veri yoksa bölüm hiç render edilmez — böylece sitede "yakında" yazan boş bir
 * vitrin oluşmaz. `constants/proof.ts` doldurulduğu anda bölüm devreye girer.
 */
export function Proof() {
  if (!hasCaseStudies && !hasTestimonials) return null

  return (
    <Section id="referanslar" labelledBy="referanslar-baslik" className="bg-ink-900/30">
      <div className="container-page">
        <SectionHeading
          id="referanslar-baslik"
          eyebrow="Referanslar"
          segments={[{ text: 'Yayına aldığımız' }, { text: 'gerçek projeler', highlight: true }]}
          description="Çözülen problem, yapılan iş ve ölçülen sonuç."
        />

        {hasCaseStudies && (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {caseStudies.map((study, index) => (
              <Reveal3D
                key={study.id}
                delay={(index % 2) * 0.1}
                offsetX={index % 2 === 0 ? -50 : 50}
                tilt={9}
                depth={100}
              >
                <SpotlightCard as="article" className="h-full overflow-hidden">
                  {study.image && (
                    <img
                      src={study.image}
                      alt={study.imageAlt ?? `${study.client} projesinden ekran görüntüsü`}
                      width={1200}
                      height={750}
                      loading="lazy"
                      decoding="async"
                      className="aspect-16/10 w-full border-b border-white/8 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <span className="text-xs tracking-wide text-fg-dim uppercase">
                      {study.sector}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold text-fg">
                      {study.client}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{study.challenge}</p>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{study.work}</p>
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/8 px-3 py-1.5 text-xs text-emerald-300">
                      <TrendingUp className="size-3.5" aria-hidden="true" />
                      {study.outcome}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {study.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[0.65rem] text-fg-dim"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </SpotlightCard>
              </Reveal3D>
            ))}
          </div>
        )}

        {hasTestimonials && (
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <Reveal3D
                as="li"
                key={item.id}
                delay={(index % 3) * 0.08}
                offsetX={index % 3 === 0 ? -34 : index % 3 === 2 ? 34 : 0}
                tilt={10}
                depth={85}
              >
                <figure className="card-surface h-full p-6">
                  <Quote className="size-5 text-brand-400" aria-hidden="true" />
                  <blockquote className="mt-4 text-sm leading-relaxed text-fg-muted">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="block font-medium text-fg">{item.author}</span>
                    <span className="block text-xs text-fg-dim">
                      {item.role} · {item.company}
                    </span>
                  </figcaption>
                </figure>
              </Reveal3D>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}
