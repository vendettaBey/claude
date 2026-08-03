import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Reveal } from '@/components/motion/Reveal'
import { site } from '@/constants/site'

export type LegalSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

type LegalPageProps = {
  title: string
  metaTitle: string
  description: string
  path: string
  updatedAt: string
  intro: ReactNode
  sections: LegalSection[]
}

/**
 * Yasal sayfaların ortak düzeni.
 * Breadcrumb yapısal verisi de burada üretilir.
 */
export function LegalPage({
  title,
  metaTitle,
  description,
  path,
  updatedAt,
  intro,
  sections,
}: LegalPageProps) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: title, item: `${site.url}${path}` },
    ],
  }

  return (
    <>
      <Seo
        title={metaTitle}
        description={description}
        path={path}
        noIndex={false}
        jsonLd={breadcrumb}
      />

      <div className="relative pt-32 pb-20 sm:pt-36 lg:pt-40">
        <AmbientBackground orbs grid intensity="soft" />

        <div className="container-page">
          <nav aria-label="Sayfa yolu">
            <ol className="flex items-center gap-1.5 text-xs text-fg-dim">
              <li>
                <Link to="/" className="transition-colors hover:text-brand-400">
                  Ana Sayfa
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-fg-muted">
                {title}
              </li>
            </ol>
          </nav>

          <Reveal>
            <h1 className="mt-6 max-w-3xl text-3xl leading-tight font-semibold sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>
            <p className="mt-4 text-sm text-fg-dim">Son güncelleme: {updatedAt}</p>
            <div className="mt-6 max-w-3xl text-base leading-relaxed text-fg-muted">{intro}</div>
          </Reveal>

          <div className="mt-14 max-w-3xl space-y-10">
            {sections.map((section, index) => (
              <Reveal key={section.heading} delay={index * 0.04}>
                <section>
                  <h2 className="font-display text-xl font-semibold text-fg">{section.heading}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 leading-relaxed text-fg-muted">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 leading-relaxed text-fg-muted">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="card-surface mt-14 max-w-3xl p-6">
              <p className="text-sm leading-relaxed text-fg-muted">
                Bu metinle ilgili sorularınız veya talepleriniz için{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-brand-400 underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>{' '}
                adresine yazabilirsiniz.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  )
}
