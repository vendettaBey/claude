import { services } from '@/constants/services'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal3D } from '@/components/motion/Reveal3D'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { ServiceCard } from './ServiceCard'

export function Services() {
  return (
    <Section id="hizmetler" labelledBy="hizmetler-baslik">
      <AmbientBackground grid orbs={false} fadeBottom={false} />

      <div className="container-page">
        <SectionHeading
          id="hizmetler-baslik"
          index="01"
          eyebrow="Hizmetler"
          segments={[{ text: 'İhtiyacınıza uygun' }, { text: 'dijital çözümler', highlight: true }]}
          description="Her işletmenin ihtiyacı farklıdır. Bu nedenle hazır kalıplar sunmak yerine projenin hedeflerine, kullanıcılarına ve iş süreçlerine göre çözümler geliştiriyoruz."
        />

        {/* Bento grid: bazı kartlar iki sütun kaplar, mobilde hepsi tek sütuna iner */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {services.map((service, index) => {
            // Kartlar bulundukları sütunun yönünden derinlikten gelir: soldaki
            // soldan, sağdaki sağdan. Ortadaki sütun doğrudan öne çıkar.
            // Tek tip giriş kullanıldığında ızgara blok hâlinde "zıplıyordu".
            const column = index % 3
            const offsetX = column === 0 ? -46 : column === 2 ? 46 : 0

            return (
              <Reveal3D
                key={service.id}
                delay={(index % 3) * 0.09}
                offsetX={offsetX}
                tilt={column === 1 ? 16 : 10}
                depth={110}
                className={service.span === 'wide' ? 'lg:col-span-2' : undefined}
              >
                <ServiceCard service={service} wide={service.span === 'wide'} />
              </Reveal3D>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
