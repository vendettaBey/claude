import { valueProps } from '@/constants/content'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { Reveal3D } from '@/components/motion/Reveal3D'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { ResponsivePreview } from './ResponsivePreview'

export function WhyUs() {
  return (
    <Section id="neden-biz" labelledBy="neden-biz-baslik" className="bg-ink-900/30">
      <div className="container-page">
        <SectionHeading
          id="neden-biz-baslik"
          index="02"
          eyebrow="Neden Ülkü Yazılım?"
          align="left"
          segments={[
            { text: 'Hazır kalıplar değil,' },
            { text: 'işletmenize uygun çözümler', highlight: true },
          ]}
          description="Projeyi teslim edip kaybolmak yerine, ihtiyacı anlamaktan yayın sonrası desteğe kadar süreci birlikte yürütüyoruz."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {valueProps.map((item, index) => (
            <Reveal3D
              as="li"
              key={item.title}
              // Satır içindeki sıraya göre gecikme: kartlar soldan sağa
              // dizilerek gelir, ızgara tek parça hâlinde belirmez.
              delay={(index % 3) * 0.08}
              offsetX={index % 3 === 0 ? -38 : index % 3 === 2 ? 38 : 0}
              tilt={11}
              depth={95}
            >
              <SpotlightCard accent={item.accent} tilt className="h-full p-6">
                <span
                  className="grid size-11 place-items-center rounded-xl border border-white/10"
                  style={{
                    background: `linear-gradient(140deg, ${item.accent}26, transparent 70%)`,
                    color: item.accent,
                  }}
                >
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold text-fg sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.description}</p>
              </SpotlightCard>
            </Reveal3D>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-8">
          <ResponsivePreview />
        </Reveal>
      </div>
    </Section>
  )
}
