import { ArrowRight, CircleCheck, ExternalLink } from 'lucide-react'
import { featuredReference } from '@/constants/proof'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { Reveal3D } from '@/components/motion/Reveal3D'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Button } from '@/components/ui/Button'

/** Ana sayfadaki gerçek ve canlı proje vitrini. */
export function Proof() {
  const project = featuredReference

  return (
    <Section
      id="referanslar"
      labelledBy="referanslar-baslik"
      className="bg-ink-900/45 overflow-hidden border-y border-white/6"
    >
      <AmbientBackground grid={false} intensity="soft" fadeBottom={false} />

      <div className="container-page relative">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <SectionHeading
            id="referanslar-baslik"
            index="03"
            eyebrow="Referansımız"
            align="left"
            segments={[
              { text: 'Tasarladık, geliştirdik,' },
              { text: 'şimdi gerçek kullanıcılar kullanıyor.', highlight: true },
            ]}
            description="Hatice & Ömer için davet, katılım bildirimi ve etkinlik bilgilerini tek akışta buluşturan canlı bir web uygulaması geliştirdik."
          />

          <Reveal direction="left" className="flex items-center gap-3 lg:pb-2">
            <span className="font-display text-fg text-5xl font-semibold sm:text-6xl">01</span>
            <span className="text-fg-dim max-w-24 font-mono text-[0.65rem] leading-relaxed tracking-[0.16em] uppercase">
              Yayındaki proje
            </span>
          </Reveal>
        </div>

        <div className="mt-12 grid items-start gap-7 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)] lg:items-stretch">
          <Reveal3D offsetX={-46} tilt={7} depth={110} className="min-w-0 lg:h-full">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} projesini yeni sekmede aç`}
              className="reference-showcase group/reference relative block overflow-hidden lg:flex lg:h-full lg:flex-col"
            >
              <span className="reference-browser-bar text-fg-dim flex h-11 items-center justify-between gap-4 px-4 font-mono text-[0.65rem] tracking-wide">
                <span className="flex gap-1.5" aria-hidden="true">
                  <i className="size-2 rounded-full bg-red-400/70" />
                  <i className="size-2 rounded-full bg-amber-300/70" />
                  <i className="size-2 rounded-full bg-emerald-400/70" />
                </span>
                <span className="truncate">haticeveomer.com</span>
                <span className="flex items-center gap-2 text-emerald-300">
                  <i className="size-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_10px_currentColor]" />
                  CANLI
                </span>
              </span>

              <div className="reference-preview relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  width={1265}
                  height={712}
                  loading="lazy"
                  decoding="async"
                  className="reference-preview-image"
                />
                <span className="bg-ink-950/82 absolute top-4 left-4 inline-flex items-center gap-2 border border-emerald-300/25 px-3 py-2 font-mono text-[0.65rem] tracking-[0.12em] text-emerald-200 uppercase backdrop-blur-md">
                  <i className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_currentColor]" />
                  Canlı proje
                </span>
                <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 border border-white/14 bg-[#10131d]/82 px-4 py-2.5 text-sm font-medium text-[#fff] opacity-0 backdrop-blur-md transition-all duration-300 group-hover/reference:translate-y-0 group-hover/reference:opacity-100 motion-safe:translate-y-2">
                  Siteyi incele <ExternalLink className="size-4" aria-hidden="true" />
                </span>
              </div>
            </a>
          </Reveal3D>

          <Reveal3D offsetX={46} tilt={7} depth={110} delay={0.08} className="h-full">
            <article className="reference-details flex h-full flex-col p-6">
              <div className="text-fg-dim flex flex-wrap items-center justify-between gap-3 font-mono text-[0.65rem] tracking-[0.13em] uppercase">
                <span>01 / 01</span>
                <span>
                  {project.year} · {project.location}
                </span>
              </div>

              <p className="text-brand-400 mt-5 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
                {project.type}
              </p>
              <h3 className="font-display text-fg mt-2 text-4xl font-semibold tracking-tight lg:text-[2.65rem]">
                Hatice <em className="text-brand-400 font-light">&</em> Ömer
              </h3>
              <p className="text-fg-muted mt-4 text-sm leading-relaxed">{project.description}</p>

              <ul className="mt-5 grid gap-3 lg:grid-cols-2 lg:gap-x-4">
                {project.features.map((feature) => (
                  <li key={feature} className="text-fg-muted flex items-start gap-3 text-sm">
                    <CircleCheck
                      className="text-brand-400 mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Proje özellikleri">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="text-fg-dim border border-white/10 bg-white/[0.035] px-2.5 py-1.5 font-mono text-[0.62rem] tracking-wide uppercase"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={project.url} size="sm" magnetic={false}>
                  Canlı projeyi aç <ExternalLink className="size-4" aria-hidden="true" />
                </Button>
                <Button href="#iletisim" variant="secondary" size="sm" magnetic={false}>
                  Benzer proje <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </article>
          </Reveal3D>
        </div>
      </div>
    </Section>
  )
}
