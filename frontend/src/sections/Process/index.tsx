import { useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { processSteps } from '@/constants/process'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { useGsapContext, gsap, ScrollTrigger } from '@/hooks/useGsap'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'

/**
 * Çalışma süreci timeline'ı.
 *
 * Daha önce bu bölüm ve "Fikirden Ürüne" (Storytelling) aynı şeyi — sürecimizi
 * — iki ayrı görselleştirmeyle anlatıyordu (7 iş adımı + 9 teknik aşama),
 * sayfayı gereksiz uzatıyordu. Tek bölümde birleştirildi: tek sütun, tek ray,
 * yedi net adım. Her adımın "Çıktı" pilli yerine "Elinizde olan" ile
 * çerçevelenmesi bilinçli — aynı bilgi, ama "biz ne yapıyoruz" yerine
 * "siz ne kazanıyorsunuz" diline çevrilmiş hâli daha ikna edici.
 *
 * Scroll ilerledikçe ray GSAP ile dolar ve o ana kadar geçilen adımlar aktif
 * hale gelir. Hareket azaltma tercihinde ray doğrudan dolu gösterilir, tüm
 * adımlar okunur durumda kalır.
 */
export function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const headRef = useRef<HTMLSpanElement>(null)
  const [reachedIndex, setReachedIndex] = useState(-1)
  const { reduced } = useMotionProfile()

  useGsapContext(
    () => {
      // Çizginin ve ucundaki ışığın aynı kaydırma aralığına bağlanması.
      // İkisi tek tetikleyiciyi paylaşır; ayrı tetikleyicilerde ışık ile
      // dolgunun ucu birkaç piksel kayıyordu.
      const railScrollTrigger = {
        trigger: containerRef.current,
        start: 'top 65%',
        end: 'bottom 70%',
        scrub: 0.5,
      } as const

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: railScrollTrigger },
      )

      // Dolgunun ucunda ilerleyen ışık — rayın "çizilmekte olduğunu" gösterir.
      gsap.fromTo(
        headRef.current,
        { top: '0%', opacity: 0 },
        {
          top: '100%',
          opacity: 1,
          ease: 'none',
          scrollTrigger: railScrollTrigger,
        },
      )

      // Adımların sırayla aktifleşmesi
      gsap.utils.toArray<HTMLElement>('[data-process-step]').forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 72%',
          onEnter: () => setReachedIndex((current) => Math.max(current, index)),
          onLeaveBack: () => setReachedIndex(index - 1),
        })
      })
    },
    containerRef,
    !reduced,
    [reduced],
  )

  return (
    <Section id="surec" labelledBy="surec-baslik">
      <AmbientBackground grid orbs={false} fadeBottom={false} />

      <div className="container-page">
        <SectionHeading
          id="surec-baslik"
          index="04"
          eyebrow="Çalışma Süreci"
          segments={[
            { text: 'Ne zaman ne olacağını' },
            { text: 'baştan bilirsiniz', highlight: true },
          ]}
          description="Yedi net adım, her birinde elinize geçen somut bir çıktı. Projenin hangi aşamada olduğunu tahmin etmenize gerek kalmaz."
        />

        <div ref={containerRef} className="relative mx-auto mt-16 max-w-2xl lg:mt-20">
          {/* Dikey ray — tüm ekran genişliklerinde solda, tek sütunlu akış */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-5 w-px bg-white/8"
          >
            <span
              ref={lineRef}
              className={cn(
                'block h-full w-full origin-top bg-[linear-gradient(180deg,#2563eb,#22d3ee,#8b5cf6)]',
                reduced && 'scale-y-100',
              )}
              style={reduced ? undefined : { transform: 'scaleY(0)' }}
            />

            {/* İlerleyen ışık ucu. Hareket azaltmada hiç render edilmez:
                orada ray zaten baştan dolu gösterilir, gezen bir uç anlamsız
                kalırdı. */}
            {!reduced && (
              <span
                ref={headRef}
                className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow opacity-0 shadow-[0_0_14px_4px_rgba(34,211,238,0.55)]"
              />
            )}
          </div>

          <ol className="space-y-6">
            {processSteps.map((step, index) => {
              const isActive = reduced || index <= reachedIndex

              return (
                <li key={step.id} data-process-step className="relative pl-16">
                  {/* Ray üzerindeki nokta */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-1 left-5 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full border transition-all duration-500',
                      isActive
                        ? 'scale-110 border-brand-500/60 bg-ink-950 shadow-[0_0_0_5px_rgba(61,155,255,0.10),0_0_22px_rgba(61,155,255,0.35)]'
                        : 'scale-100 border-white/12 bg-ink-900',
                    )}
                  >
                    <step.icon
                      className={cn(
                        'size-4 transition-colors duration-500',
                        isActive ? 'text-brand-400' : 'text-fg-dim',
                      )}
                    />
                  </span>

                  <Reveal direction="up" delay={0.04}>
                    <div
                      className={cn(
                        'card-surface p-5 transition-all duration-500 sm:p-6',
                        isActive ? 'border-white/14 opacity-100' : 'opacity-60',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'font-mono text-xs tabular-nums transition-colors duration-500',
                            isActive ? 'text-brand-400' : 'text-fg-dim',
                          )}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-display text-base font-semibold text-fg sm:text-lg">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                        {step.description}
                      </p>
                      {/* "Çıktı" değil "Elinizde olan": aynı bilgi, ama işletme
                          sahibinin bakış açısından — biz ne yaptığımız değil,
                          onun eline ne geçtiği. */}
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs text-emerald-300">
                        <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                        Elinizde olan: {step.output}
                      </p>
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </Section>
  )
}
