import { useCallback, useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, MousePointerClick, Sparkles } from 'lucide-react'
import { AnimatedHeading } from '@/components/motion/AnimatedHeading'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Button } from '@/components/ui/Button'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { scrollToSection } from '@/lib/scroll'
import { HeroVisual } from './HeroVisual'

export function Hero() {
  const { reduced, allowHeavy, allowPointer } = useMotionProfile()
  const sectionRef = useRef<HTMLElement>(null)

  /* -----------------------------------------------------------------------
     Kaydırma koreografisi.

     Metin ve maket farklı hızlarda çıkar: metin daha yavaş yükselir ve
     sönerken maket geriye doğru yatıp uzaklaşır. Aradaki hız farkı, hero'nun
     kaydırmayla "kapanan bir sahne" gibi okunmasını sağlar. Arka plandaki 3B
     katman (bkz. `SceneBackdrop`) aynı kaydırmayı okuyup kamerayı ileri
     sürdüğü için üç katman aynı hareketin parçası gibi davranır.
  ----------------------------------------------------------------------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', allowHeavy ? '22%' : '0%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, allowHeavy ? 0.15 : 1])
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', allowHeavy ? '-8%' : '0%'])
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, allowHeavy ? 0.86 : 1])
  const visualRotate = useTransform(scrollYProgress, [0, 1], [0, allowHeavy ? 14 : 0])

  /* -----------------------------------------------------------------------
     İşaretçiye bağlı 3B eğim.

     Ölçüm hero'nun tamamında yapılır, yalnızca maketin üzerinde değil: fare
     başlığın üzerindeyken de maket tepki verir, sahne tek parça gibi durur.
     Yay yumuşatması olmadan hareket fareye yapışık ve sinirli görünüyordu.
  ----------------------------------------------------------------------- */
  const springConfig = { stiffness: 110, damping: 18, mass: 0.5 }
  const pointerX = useSpring(useMotionValue(0), springConfig)
  const pointerY = useSpring(useMotionValue(0), springConfig)

  const tiltY = useTransform(pointerX, [-1, 1], [-9, 9])
  const tiltX = useTransform(pointerY, [-1, 1], [7, -7])

  // Kaydırma eğimi ile işaretçi eğimi aynı eksende (X) toplanır. İkisi ayrı
  // `rotateX` olarak verilseydi biri diğerini ezerdi; tek değerde birleştiriyoruz.
  const rotateX = useTransform([visualRotate, tiltX], ([scroll, tilt]: number[]) =>
    allowPointer ? scroll + tilt : scroll,
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!allowPointer) return
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1)
      pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1)
    },
    [allowPointer, pointerX, pointerY],
  )

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  return (
    <section
      id="ana-sayfa"
      ref={sectionRef}
      aria-labelledby="hero-baslik"
      onPointerMove={allowPointer ? handlePointerMove : undefined}
      onPointerLeave={allowPointer ? handlePointerLeave : undefined}
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-28 pb-16 sm:pt-32 lg:min-h-screen lg:pt-24 lg:pb-24"
    >
      {/* Izgara ve aurora katmanı. 3B sahne devredeyse kendini geri çeker. */}
      <AmbientBackground intensity="strong" fadeBottom={false} />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-page relative"
      >
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Metin sütunu */}
          <div className="max-w-2xl">
            <motion.span
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.7rem] font-medium tracking-[0.14em] text-brand-400 uppercase sm:text-xs"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Kurumsal Web Siteleri
              <span aria-hidden="true" className="text-fg-dim">
                ·
              </span>
              Özel Yazılımlar
              <span aria-hidden="true" className="text-fg-dim">
                ·
              </span>
              Web Uygulamaları
            </motion.span>

            <AnimatedHeading
              as="h1"
              id="hero-baslik"
              delay={0.25}
              segments={[
                { text: 'İşletmenize sadece bir web sitesi değil,' },
                { text: 'çalışan bir dijital sistem', highlight: true },
                { text: 'geliştiriyoruz.' },
              ]}
              className="mt-7 text-[2.1rem] leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-[3.6rem]"
            />

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              Kurumsal web sitelerinden işletmenize özel web uygulamalarına kadar; hızlı, güvenli,
              mobil uyumlu ve uzun vadede geliştirilebilir dijital çözümler hazırlıyoruz.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.68 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button href="#iletisim" size="lg" className="w-full sm:w-auto">
                Ücretsiz Ön Görüşme
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button href="#hizmetler" variant="secondary" size="lg" className="w-full sm:w-auto">
                Hizmetleri İncele
              </Button>
            </motion.div>

            <motion.p
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="mt-5 flex items-start gap-2 text-sm text-fg-dim"
            >
              <MousePointerClick className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden="true" />
              İhtiyacınızı dinliyor, projenize özel uygulanabilir bir yol haritası oluşturuyoruz.
            </motion.p>
          </div>

          {/* Görsel sütunu — kaydırmada yatarak uzaklaşır, işaretçiyle eğilir. */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={
              reduced
                ? undefined
                : {
                    y: visualY,
                    scale: visualScale,
                    rotateX,
                    rotateY: allowPointer ? tiltY : 0,
                    transformPerspective: 1400,
                    transformStyle: 'preserve-3d',
                  }
            }
            className="relative mt-6 will-change-transform lg:mt-0"
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* Kaydırma ipucu — sayfanın devam ettiğini sezdirir. */}
        <motion.a
          href="#hizmetler"
          onClick={(event) => {
            event.preventDefault()
            scrollToSection('#hizmetler')
          }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-14 hidden items-center justify-center gap-2 text-[0.65rem] font-medium tracking-[0.22em] text-fg-dim uppercase transition-colors hover:text-fg-muted lg:flex"
        >
          Keşfetmek için kaydır
          <ArrowDown
            className={reduced ? 'size-3.5' : 'size-3.5 animate-scroll-hint'}
            aria-hidden="true"
          />
        </motion.a>
      </motion.div>
    </section>
  )
}
