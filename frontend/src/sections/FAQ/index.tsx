import { faqItems } from '@/constants/content'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { Reveal3D } from '@/components/motion/Reveal3D'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { scrollToSection } from '@/lib/scroll'

export function FAQ() {
  return (
    <Section id="sss" labelledBy="sss-baslik" className="bg-ink-900/30">
      <div className="container-page">
        <SectionHeading
          id="sss-baslik"
          index="07"
          eyebrow="Sık Sorulan Sorular"
          segments={[
            { text: 'Karar vermeden önce' },
            { text: 'bilmeniz gerekenler', highlight: true },
          ]}
          description="Süre, bütçe, yönetim paneli, SEO ve teslim sonrası destek hakkında kısa cevaplar."
        />

        <div className="mx-auto mt-14 max-w-3xl lg:mt-16">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {faqItems.map((item, index) => (
              <Reveal3D
                key={item.question}
                delay={index * 0.05}
                // Sorular dönüşümlü olarak iki yandan gelir; tek yönlü
                // giriş uzun listede monoton bir şerit gibi okunuyordu.
                offsetX={index % 2 === 0 ? -30 : 30}
                tilt={7}
                depth={60}
              >
                <AccordionItem value={`soru-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </Reveal3D>
            ))}
          </Accordion>

          <Reveal delay={0.15}>
            <p className="text-fg-dim mt-10 text-center text-sm">
              Başka bir sorunuz mu var?{' '}
              <button
                type="button"
                onClick={() => scrollToSection('#iletisim')}
                className="text-brand-400 font-medium underline-offset-4 hover:underline"
              >
                Bize sorun
              </button>
              , kısa sürede yanıtlayalım.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
