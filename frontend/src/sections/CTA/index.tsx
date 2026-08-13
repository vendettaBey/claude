import { ArrowRight, MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/constants/site'
import { AnimatedHeading } from '@/components/motion/AnimatedHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Reveal3D } from '@/components/motion/Reveal3D'
import { Parallax } from '@/components/motion/Parallax'
import { PointerGlow } from '@/components/motion/PointerGlow'
import { Button } from '@/components/ui/Button'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'

export function CTA() {
  const { allowHeavy } = useMotionProfile()

  return (
    <section aria-labelledby="cta-baslik" className="relative py-14 sm:py-18 lg:py-20">
      <div className="container-page">
        <PointerGlow
          color="rgba(124,196,255,0.20)"
          size={620}
          className="overflow-hidden rounded-3xl border border-white/10"
        >
          {/* Animasyonlu gradient zemin */}
          <div aria-hidden="true" className="theme-cta-surface absolute inset-0 -z-20" />
          {/* Işık küresi kaydırmayla metinden bağımsız hareket eder.
              Parallax sarmalayıcı ayrı bir katman olarak duruyor: `y` dönüşümü
              doğrudan küreye verilseydi kürenin `-translate-x-1/2` yatay
              ortalaması ezilir ve küre sağa kayardı. */}
          <Parallax
            aria-hidden
            speed={0.45}
            className="pointer-events-none absolute inset-x-0 -top-28 -z-20 flex justify-center"
          >
            <div
              className={cn(
                'size-[36rem] rounded-full blur-[120px]',
                'bg-[radial-gradient(circle,rgba(37,99,235,0.55)_0%,transparent_65%)]',
                allowHeavy && 'animate-float-slow',
              )}
            />
          </Parallax>

          {/* Izgara ters yönde, daha yavaş kayar — iki katman arasında
              gözle seçilebilir bir derinlik farkı oluşur. */}
          <Parallax
            aria-hidden
            speed={-0.16}
            className="pointer-events-none absolute inset-0 -z-20"
          >
            <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000,transparent_75%)] opacity-60" />
          </Parallax>

          <div className="relative px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-16">
            <AnimatedHeading
              id="cta-baslik"
              segments={[
                { text: 'Sorununuzu anlatın,' },
                { text: 'uygulanabilir çözümü çıkaralım.', highlight: true },
              ]}
              className="mx-auto max-w-3xl text-3xl leading-[1.12] font-semibold text-balance sm:text-4xl lg:text-[2.85rem]"
            />

            <Reveal delay={0.12}>
              <p className="text-fg-muted mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
                Web sitesi, müşteri portalı veya yönetim sistemi: ihtiyacı netleştirip doğru kapsamı
                birlikte belirleyelim.
              </p>
            </Reveal>

            <Reveal3D delay={0.2} tilt={14} depth={70}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="#iletisim" size="lg" className="w-full sm:w-auto">
                  İhtiyacımı Anlatayım
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  href={whatsappUrl}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <MessageCircle className="size-4 text-emerald-400" aria-hidden="true" />
                  WhatsApp'tan Yaz
                </Button>
              </div>
            </Reveal3D>

            <Reveal delay={0.28}>
              <p className="text-fg-dim mx-auto mt-6 max-w-lg text-sm">
                İlk görüşmede uygulanabilir seçenekleri ve sonraki adımı netleştiriyoruz.
              </p>
            </Reveal>
          </div>
        </PointerGlow>
      </div>
    </section>
  )
}
