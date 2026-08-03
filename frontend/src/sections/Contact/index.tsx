import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { mailtoUrl, site, telUrl, whatsappUrl } from '@/constants/site'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal3D } from '@/components/motion/Reveal3D'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { ContactForm } from './ContactForm'

const channels = [
  { label: 'E-posta', value: site.email, href: mailtoUrl, icon: Mail, external: false },
  { label: 'Telefon', value: site.phone, href: telUrl, icon: Phone, external: false },
  {
    label: 'WhatsApp',
    value: 'Hızlı yanıt için yazın',
    href: whatsappUrl,
    icon: MessageCircle,
    external: true,
  },
]

export function Contact() {
  return (
    <Section id="iletisim" labelledBy="iletisim-baslik">
      <AmbientBackground grid orbs intensity="soft" fadeBottom={false} />

      <div className="container-page">
        <SectionHeading
          id="iletisim-baslik"
          index="08"
          eyebrow="İletişim"
          align="left"
          segments={[{ text: 'Projenizi anlatın,' }, { text: 'birlikte planlayalım', highlight: true }]}
          description="İhtiyacınızı yazın; kapsamı, tahmini süreyi ve uygulanabilir seçenekleri birlikte netleştirelim."
        />

        <div className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* İletişim kanalları */}
          <Reveal3D offsetX={-48} tilt={9} depth={90}>
            <div className="flex h-full flex-col gap-4">
              <ul className="grid gap-3">
                {channels.map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="card-surface flex items-center gap-4 p-4 transition-colors duration-300 hover:border-white/20"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-brand-400">
                        <channel.icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-fg-dim">{channel.label}</span>
                        <span className="block truncate text-sm font-medium text-fg">
                          {channel.value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="card-surface flex flex-col gap-3 p-5">
                <p className="flex items-center gap-2.5 text-sm text-fg-muted">
                  <Clock className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {site.workingHours}
                </p>
                <p className="flex items-center gap-2.5 text-sm text-fg-muted">
                  <MapPin className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {site.location}
                </p>
              </div>

              <div className="card-surface mt-auto p-5">
                <p className="text-sm leading-relaxed text-fg-muted">
                  Ne istediğinizden emin değil misiniz? Sorun değil — ilk görüşmede ihtiyacınızı
                  birlikte netleştirip size uygun seçenekleri anlatıyoruz.
                </p>
              </div>
            </div>
          </Reveal3D>

          {/* Form */}
          <Reveal3D offsetX={48} tilt={9} depth={90} delay={0.1}>
            <ContactForm />
          </Reveal3D>
        </div>
      </div>
    </Section>
  )
}
