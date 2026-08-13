import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { industries } from '@/constants/content'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/cn'

/**
 * "Kimler için çalışıyoruz?"
 *
 * Etkileşimli etiket bulutu: etiketler kaydırmayla sırayla derinlikten gelir,
 * imleç bir etikete yaklaştığında o etiket öne çıkar ve komşuları hafifçe
 * soluklaşır. Etiketler gerçek butondur — tıklanınca iletişim formuna
 * götürür, yani dekoratif değil işlevseldir.
 *
 * Giriş animasyonu `li` üzerinde (variant), hover tepkisi ise içteki `button`
 * üzerinde (CSS geçişi) durur. İkisi aynı öğede toplanırsa Framer'ın `animate`
 * nesnesi ile variant'lar aynı `opacity`/`scale` için yarışıyor ve etiketler
 * hover'da giriş animasyonunu baştan oynatıyordu.
 */
const cloudVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
}

const tagVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.88, rotateX: 18 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Industries() {
  const [hovered, setHovered] = useState<number | null>(null)
  const { reduced, allowPointer } = useMotionProfile()
  const [cloudRef, cloudInView] = useInViewOnce<HTMLUListElement>({ enabled: !reduced })

  return (
    <Section id="sektorler" labelledBy="sektorler-baslik">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="sektorler-baslik"
            index="06"
            eyebrow="Kimler İçin Çalışıyoruz?"
            align="left"
            segments={[
              { text: 'Süreçlerini hızlandırmak isteyen' },
              { text: 'işletmeler için', highlight: true },
            ]}
            description="Web sitesini yenilemek, manuel işleri azaltmak veya ekibini tek sistemde çalıştırmak isteyen işletmelerle çalışıyoruz."
          />

          <Reveal delay={0.16}>
            <p className="text-fg-dim mt-8 max-w-sm text-sm leading-relaxed">
              Sektörünüz listede olmasa da sorun değil.{' '}
              <button
                type="button"
                onClick={() => scrollToSection('#iletisim')}
                className="text-brand-400 font-medium underline-offset-4 hover:underline"
              >
                İhtiyacınızı anlatın
              </button>
              , uygun yolu birlikte değerlendirelim.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="industry-instrument mt-10 max-w-sm" aria-label="Çalışma kapsamımız">
              <div className="industry-instrument-scale" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => (
                  <i key={index} />
                ))}
              </div>
              <dl className="grid grid-cols-3 gap-3 border-y border-white/12 py-4">
                <div>
                  <dt className="annotation text-fg-dim">Profil</dt>
                  <dd className="font-display text-fg mt-1 text-2xl font-semibold">12</dd>
                </div>
                <div>
                  <dt className="annotation text-fg-dim">Çözüm</dt>
                  <dd className="font-display text-fg mt-1 text-2xl font-semibold">03</dd>
                </div>
                <div>
                  <dt className="annotation text-fg-dim">Akış</dt>
                  <dd className="font-display text-fg mt-1 text-2xl font-semibold">01</dd>
                </div>
              </dl>
              <p className="text-fg-dim mt-3 font-mono text-[0.68rem] tracking-[0.12em] uppercase">
                İhtiyaç → kapsam → çalışan sistem
              </p>
            </div>
          </Reveal>
        </div>

        <div className="industry-index relative border-t border-white/12">
          <div className="annotation text-fg-dim flex items-center justify-between border-b border-white/12 py-4">
            <span>Çalışma alanları</span>
            <span>{String(industries.length).padStart(2, '0')} profil</span>
          </div>

          <motion.ul
            ref={cloudRef}
            className="grid sm:grid-cols-2"
            onMouseLeave={() => setHovered(null)}
            style={reduced ? undefined : { perspective: 900 }}
            variants={reduced ? undefined : cloudVariants}
            initial={reduced ? false : 'hidden'}
            animate={reduced ? undefined : cloudInView ? 'visible' : 'hidden'}
          >
            {industries.map((industry, index) => {
              const isDimmed = allowPointer && hovered !== null && hovered !== index
              const isHovered = hovered === index

              return (
                <motion.li
                  key={industry}
                  onMouseEnter={() => setHovered(index)}
                  variants={reduced ? undefined : tagVariants}
                  className="border-b border-white/10 sm:odd:border-r"
                >
                  <button
                    type="button"
                    onClick={() => scrollToSection('#iletisim')}
                    className={cn(
                      'industry-row group flex min-h-20 w-full items-center gap-4 px-3 py-4 text-left transition-all duration-300 sm:px-5',
                      isHovered ? 'bg-brand-500/10 text-fg' : 'text-fg-muted hover:text-fg',
                      isDimmed && 'opacity-45',
                    )}
                  >
                    <span className="text-brand-400/75 font-mono text-[0.72rem] tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[0.95rem] font-medium leading-snug sm:text-base">
                      {industry}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-brand-400 ml-auto translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      ↗
                    </span>
                  </button>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </div>
    </Section>
  )
}
