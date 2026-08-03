import { useCallback, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Home, RotateCcw, Terminal } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Button } from '@/components/ui/Button'
import { useMotionProfile } from '@/hooks/useMotionProfile'

const BUILD_LINES = [
  'rota çözümleniyor…',
  'eşleşen sayfa aranıyor…',
  'sonuç: bulunamadı (404)',
]

/**
 * 404 sayfası.
 *
 * Küçük ve hafif bir etkileşim: rakamlar imlece göre derinlik değiştirir,
 * mini terminal "yeniden derleme" denemesi yapar. Hepsi dekoratiftir; sayfanın
 * asıl işi olan "ana sayfaya dön" bağlantısı her koşulda çalışır.
 */
export default function NotFoundPage() {
  const { allowPointer, reduced } = useMotionProfile()
  const containerRef = useRef<HTMLDivElement>(null)
  const [attempt, setAttempt] = useState(0)
  const [running, setRunning] = useState(false)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 120, damping: 20 })
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20 })

  // Rakamlar farklı katsayılarla kaydığı için aralarında derinlik hissi oluşur.
  const frontX = useTransform(springX, (v) => v * 18)
  const frontY = useTransform(springY, (v) => v * 18)
  const backX = useTransform(springX, (v) => v * -26)
  const backY = useTransform(springY, (v) => v * -26)

  const front = { x: frontX, y: frontY }
  const back = { x: backX, y: backY }

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!allowPointer) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
    },
    [allowPointer, pointerX, pointerY],
  )

  const retry = () => {
    if (running) return
    setRunning(true)
    setAttempt((n) => n + 1)
    window.setTimeout(() => setRunning(false), reduced ? 0 : 1400)
  }

  return (
    <>
      <Seo
        title="Sayfa Bulunamadı (404) | Ülkü Yazılım"
        description="Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Ana sayfaya dönerek devam edebilirsiniz."
        path="/404"
        noIndex
      />

      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          pointerX.set(0)
          pointerY.set(0)
        }}
        className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-32"
      >
        <AmbientBackground intensity="strong" fadeBottom={false} />

        <div className="relative w-full max-w-xl text-center">
          {/* Rakamlar */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-2 font-display text-[5.5rem] leading-none font-semibold select-none sm:text-[8rem]"
          >
            <motion.span style={reduced ? undefined : front} className="text-fg/85">
              4
            </motion.span>
            <motion.span
              style={reduced ? undefined : back}
              className="text-gradient drop-shadow-[0_0_28px_rgba(61,155,255,0.45)]"
            >
              0
            </motion.span>
            <motion.span style={reduced ? undefined : front} className="text-fg/85">
              4
            </motion.span>
          </div>

          <h1 className="mt-8 text-2xl font-semibold sm:text-3xl">Bu sayfayı bulamadık.</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-fg-muted">
            Aradığınız sayfa taşınmış, adı değişmiş veya hiç var olmamış olabilir. Buradan devam
            edebilir ya da doğrudan projenizi anlatabilirsiniz.
          </p>

          {/* Mini terminal */}
          <div className="card-surface mx-auto mt-8 max-w-sm p-4 text-left">
            <div className="flex items-center gap-2 border-b border-white/8 pb-2.5">
              <Terminal className="size-3.5 text-brand-400" aria-hidden="true" />
              <span className="font-mono text-[0.65rem] text-fg-dim">router.log</span>
            </div>
            <div className="mt-3 space-y-1.5 font-mono text-[0.68rem]">
              {BUILD_LINES.map((line, index) => (
                <motion.p
                  key={`${attempt}-${line}`}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : index * 0.35, duration: 0.3 }}
                  className={index === BUILD_LINES.length - 1 ? 'text-rose-300' : 'text-fg-dim'}
                >
                  <span className="text-brand-400">›</span> {line}
                </motion.p>
              ))}
              {attempt > 0 && !running && (
                <p className="pt-1 text-fg-muted">
                  <span className="text-brand-400">›</span> {attempt}. deneme de aynı sonucu verdi.
                  Ana sayfa daha iyi bir fikir.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={retry}
              disabled={running}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[0.68rem] text-fg-muted transition-colors hover:bg-white/[0.07] disabled:opacity-60"
            >
              <RotateCcw
                className={running ? 'size-3.5 animate-spin' : 'size-3.5'}
                aria-hidden="true"
              />
              {running ? 'deneniyor…' : 'tekrar dene'}
            </button>
          </div>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg" className="w-full sm:w-auto">
              <Home className="size-4" aria-hidden="true" />
              Ana Sayfaya Dön
            </Button>
            <Button href="/#iletisim" variant="secondary" size="lg" className="w-full sm:w-auto">
              Projemi Anlat
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
