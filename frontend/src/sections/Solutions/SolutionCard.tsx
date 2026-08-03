import { ArrowRight, Check, Target } from 'lucide-react'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/cn'
import type { ProjectScenario } from '@/types'
import { ProjectVisual } from './ProjectVisual'

type SolutionCardProps = {
  project: ProjectScenario
}

/**
 * Örnek çözüm senaryosu kartı.
 *
 * Hover; görseli yakınlaştırır ve teknoloji etiketleriyle CTA'yı öne çıkarır.
 * Dokunmatik cihazlarda bu içerikler zaten görünür durumdadır — bilgi hiçbir
 * zaman yalnızca hover'ın arkasında saklı kalmaz.
 */
export function SolutionCard({ project }: SolutionCardProps) {
  const { allowPointer } = useMotionProfile()

  const handleCta = () => {
    window.dispatchEvent(new CustomEvent('uy:select-service', { detail: 'emin-degilim' }))
    scrollToSection('#iletisim')
  }

  return (
    <SpotlightCard as="article" accent={project.accent} className="flex h-full flex-col">
      <div className="relative shrink-0">
        <ProjectVisual
          kind={project.visual}
          accent={project.accent}
          className="h-52 border-b border-white/8 sm:h-56"
        />
        {/* Bu bir gerçekleştirilmiş referans değil, olası bir senaryodur —
            kartın kendisi bunu açıkça söyler. Gerçek proje referansları
            eklendiğinde bu rozet kaldırılır (bkz. Proof bölümü). */}
        <span className="annotation absolute top-3 right-3 rounded-full border border-dashed border-white/25 bg-ink-950/70 px-2 py-1 text-[0.58rem] text-fg-dim backdrop-blur-sm">
          Örnek Senaryo
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span
          className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[0.65rem] font-medium tracking-wide uppercase"
          style={{ background: `${project.accent}1f`, color: project.accent }}
        >
          {project.type}
        </span>

        <h3 className="mt-4 font-display text-lg font-semibold text-fg">{project.title}</h3>

        {/* Çözülen problem */}
        <p className="mt-3 flex gap-2.5 text-sm leading-relaxed text-fg-muted">
          <Target
            className="mt-0.5 size-4 shrink-0"
            style={{ color: project.accent }}
            aria-hidden="true"
          />
          <span>
            <span className="font-medium text-fg">Çözdüğü problem: </span>
            {project.problem}
          </span>
        </p>

        {/* Örnek kullanım senaryosu */}
        <p className="mt-3 border-l-2 pl-3 text-sm leading-relaxed text-fg-dim italic"
          style={{ borderColor: `${project.accent}55` }}
        >
          {project.scenario}
        </p>

        {/* Tek sütun: üç sütunlu ızgarada kart daraldığı için iki sütunlu
            liste metinleri sıkıştırıyordu. */}
        <ul className="mt-5 grid gap-2">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-[0.82rem] text-fg-muted">
              <Check
                className="mt-0.5 size-3.5 shrink-0"
                style={{ color: project.accent }}
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* Teknoloji etiketleri — hover'da yukarı kayarak belirir */}
        <div
          className={cn(
            'mt-5 flex flex-wrap gap-1.5 transition-all duration-400 ease-out',
            allowPointer &&
              'translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100',
          )}
        >
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[0.65rem] text-fg-dim"
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCta}
          // Dokunma hedefi en az 44px.
          className="group/link mt-4 -mx-2 inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-2 text-sm font-medium transition-colors"
          style={{ color: project.accent }}
        >
          Benzer Bir Proje İstiyorum
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover/link:translate-x-1"
            aria-hidden="true"
          />
        </button>
      </div>
    </SpotlightCard>
  )
}
