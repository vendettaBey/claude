import type { CSSProperties } from 'react'
import { trustItems } from '@/constants/content'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { useVelocitySkew } from '@/hooks/useVelocitySkew'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Hero altındaki güven şeridi.
 *
 * Sonsuz akan marquee; imleç üzerine gelince yavaşlar, hareket azaltma
 * tercihinde tamamen durup sarmalanan bir listeye dönüşür. Sahte istatistik
 * yoktur — yalnızca sunulan yetkinlikler listelenir.
 */
export function Trust() {
  const { reduced } = useMotionProfile()
  // Eğim akan şeride değil, onu saran kapsayıcıya uygulanır: şeridin kendi
  // `transform`'u marquee animasyonuna ait, üzerine yazılsaydı akış dururdu.
  const skewRef = useVelocitySkew<HTMLDivElement>({ maxSkew: 3, maxSquash: 0.06 })

  return (
    <section
      aria-labelledby="guven-baslik"
      className="relative border-y border-white/6 bg-ink-900/40 py-12 sm:py-14"
    >
      <div className="container-page">
        <Reveal>
          <h2
            id="guven-baslik"
            className="text-center font-sans text-xs font-medium tracking-[0.2em] text-fg-dim uppercase"
          >
            İşletmenizin dijital ihtiyaçlarına uçtan uca çözümler
          </h2>
        </Reveal>
      </div>

      {reduced ? (
        // Hareket azaltma: akış yerine sabit, sarmalanan liste
        <ul className="container-page mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {trustItems.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm text-fg-muted">
              <item.icon className="size-4 text-brand-400" aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>
      ) : (
        <div ref={skewRef} className="mask-fade-x group mt-8 overflow-hidden will-change-transform">
          <div
            // Hover'da durmak yerine yavaşlar: süre uzatılır, akış devam eder.
            className="flex w-max animate-marquee gap-8 group-hover:[animation-duration:120s]"
            style={{ '--marquee-duration': '46s' } as CSSProperties}
          >
            {/* İçerik iki kez basılır; -50% ötelemede dikiş görünmez. */}
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex shrink-0 gap-8"
                aria-hidden={copy === 1 || undefined}
                inert={copy === 1}
              >
                {trustItems.map((item) => (
                  <li
                    key={`${copy}-${item.label}`}
                    className="flex shrink-0 items-center gap-2.5 text-sm whitespace-nowrap text-fg-muted"
                  >
                    <span className="grid size-8 place-items-center rounded-lg border border-white/8 bg-white/[0.03]">
                      <item.icon className="size-4 text-brand-400" aria-hidden="true" />
                    </span>
                    {item.label}
                    <span aria-hidden="true" className="ml-6 text-fg-dim/40">
                      /
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
