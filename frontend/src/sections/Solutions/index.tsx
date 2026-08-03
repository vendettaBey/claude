import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { projectScenarios } from '@/constants/projects'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal3D } from '@/components/motion/Reveal3D'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Button } from '@/components/ui/Button'
import { SolutionCard } from './SolutionCard'

/** İlk açılışta gösterilen senaryo sayısı. */
const INITIAL_COUNT = 3

export function Solutions() {
  const [expanded, setExpanded] = useState(false)

  // Sayfayı gereksiz uzatmamak için önce üç senaryo gösterilir; kalanlar
  // isteğe bağlı açılır. Böylece içerik eksilmeden sayfa kısalır.
  const visible = expanded ? projectScenarios : projectScenarios.slice(0, INITIAL_COUNT)
  const remaining = projectScenarios.length - INITIAL_COUNT

  return (
    <Section id="projeler" labelledBy="projeler-baslik">
      <AmbientBackground grid={false} intensity="soft" fadeBottom={false} />

      <div className="container-page">
        <SectionHeading
          id="projeler-baslik"
          index="03"
          eyebrow="Örnek Çözüm Senaryoları"
          segments={[
            { text: 'İşletmeniz için' },
            { text: 'neler geliştirebiliriz?', highlight: true },
          ]}
          description="Farklı sektör ve ihtiyaçlara göre oluşturulabilecek örnek dijital çözüm senaryoları. Gerçek proje referansları yayımlandıkça bu bölüm onlarla genişleyecek."
        />

        <div
          id="senaryo-listesi"
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {visible.map((project, index) => {
            // Üç sütunlu düzende kartlar bulundukları sütunun yönünden
            // gelir: soldaki soldan, sağdaki sağdan, ortadaki öne çıkar.
            const column = index % 3
            const offsetX = column === 0 ? -46 : column === 2 ? 46 : 0

            return (
              <Reveal3D
                key={project.id}
                delay={column * 0.1}
                offsetX={offsetX}
                tilt={column === 1 ? 12 : 9}
                depth={100}
              >
                <SolutionCard project={project} />
              </Reveal3D>
            )
          })}
        </div>

        {!expanded && remaining > 0 && (
          <div className="mt-10 flex justify-center">
            <Button
              variant="secondary"
              size="md"
              magnetic={false}
              aria-controls="senaryo-listesi"
              onClick={() => setExpanded(true)}
            >
              {remaining} senaryo daha göster
              <ChevronDown className="size-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </Section>
  )
}
