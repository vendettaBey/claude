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
      <div className="container-page">
        <SectionHeading
          id="sektorler-baslik"
          index="06"
          eyebrow="Kimler İçin Çalışıyoruz?"
          segments={[
            { text: 'Süreçlerini hızlandırmak isteyen' },
            { text: 'işletmeler için', highlight: true },
          ]}
          description="Web sitesini yenilemek, manuel işleri azaltmak veya ekibini tek sistemde çalıştırmak isteyen işletmelerle çalışıyoruz."
        />

        <motion.ul
          ref={cloudRef}
          className="mt-14 flex flex-wrap justify-center gap-3 lg:mt-16"
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
              >
                <button
                  type="button"
                  onClick={() => scrollToSection('#iletisim')}
                  className={cn(
                    'industry-chip rounded-full border px-5 py-2.5 text-sm transition-all duration-300',
                    isHovered
                      ? 'border-brand-500/50 bg-brand-500/10 text-fg scale-105'
                      : 'text-fg-muted hover:text-fg border-white/10 bg-white/[0.03]',
                    isDimmed && 'opacity-40',
                  )}
                >
                  {industry}
                </button>
              </motion.li>
            )
          })}
        </motion.ul>

        <Reveal delay={0.2}>
          <p className="text-fg-dim mt-10 text-center text-sm">
            Listede kendinizi göremediniz mi?{' '}
            <button
              type="button"
              onClick={() => scrollToSection('#iletisim')}
              className="text-brand-400 font-medium underline-offset-4 hover:underline"
            >
              İhtiyacınızı anlatın
            </button>
            , birlikte değerlendirelim.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
