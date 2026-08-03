import { motion } from 'framer-motion'
import { Activity, Code2, Smartphone, Zap } from 'lucide-react'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'

/**
 * Hero görselinin DOM tabanlı sürümü.
 *
 * Bu bileşen hem mobilde/düşük güçlü cihazlarda tek başına kullanılır, hem de
 * WebGL sahnesinin arkasında duran "ürün" katmanı olarak görev yapır: gerçek
 * arayüz parçalarını (tarayıcı penceresi, dashboard kartı, mobil ekran, kod
 * satırı) gösterir. Stok fotoğraf yoktur, her şey vektörel ve ölçeklenebilirdir.
 */
export function HeroVisual({ className }: { className?: string }) {
  const { reduced } = useMotionProfile()

  const float = (delay: number, distance = 10) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -distance, 0] },
          transition: {
            duration: 7 + delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay,
          },
        }

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-lg lg:max-w-none',
        // Sahnenin tamamı hafifçe 3B süzülür: maket düz bir görsel değil,
        // uzayda duran bir nesne gibi okunur.
        !reduced && 'animate-scene-float [transform-style:preserve-3d]',
        className,
      )}
      aria-hidden="true"
    >
      {/* ------------------------------------------------------------------
          Ölçü kotları — teknik çizim anotasyonları.
          Sahneyi "ürün görseli" olmaktan çıkarıp "pafta"ya çevirir.
          Yalnızca geniş ekranda; dar ekranda yer kalmadığı için gizlenir.
      ------------------------------------------------------------------ */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Üst yatay kot: |—— 12 KOLON ——| */}
        <div className="absolute -top-7 right-28 left-0 flex items-center gap-2">
          <span className="h-2 w-px bg-brand-500/50" />
          <span className="h-px flex-1 bg-brand-500/25" />
          <span className="annotation text-[0.56rem] text-brand-400/75">12 kolon</span>
          <span className="h-px flex-1 bg-brand-500/25" />
          <span className="h-2 w-px bg-brand-500/50" />
        </div>

        {/* Sol dikey kot */}
        <div className="absolute top-1 -left-8 flex h-24 flex-col items-center gap-1.5">
          <span className="h-px w-2 bg-brand-500/50" />
          <span className="w-px flex-1 bg-brand-500/25" />
          <span className="annotation text-[0.5rem] text-brand-400/75 [writing-mode:vertical-rl]">
            1:1
          </span>
          <span className="w-px flex-1 bg-brand-500/25" />
          <span className="h-px w-2 bg-brand-500/50" />
        </div>

        {/* Dashboard kartına gösterme çizgisi (leader line) */}
        <div className="absolute top-6 right-2 flex items-center gap-1.5">
          <span className="annotation text-[0.5rem] text-cyan-glow/70">canlı veri</span>
          <span className="h-px w-6 bg-cyan-glow/40" />
          <span className="size-1 rounded-full bg-cyan-glow/70" />
        </div>
      </div>

      {/* Ana tarayıcı penceresi */}
      <motion.div
        {...float(0, 8)}
        className="glass-panel relative z-10 overflow-hidden rounded-2xl shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]"
      >
        {/* Pencere çubuğu */}
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
          <span className="size-2.5 rounded-full bg-rose-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <div className="ml-3 flex h-6 flex-1 items-center rounded-md border border-white/8 bg-ink-950/60 px-3">
            <span className="font-sans text-[0.6rem] tracking-wide text-fg-dim">
              ulkuyazilim.com
            </span>
          </div>
        </div>

        {/* Pencere içeriği */}
        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <div className="h-2.5 w-1/3 rounded-full bg-gradient-to-r from-brand-500 to-cyan-glow" />
            <div className="h-2 w-3/4 rounded-full bg-white/12" />
            <div className="h-2 w-2/3 rounded-full bg-white/8" />
          </div>

          <div className="flex gap-2">
            <div className="h-7 w-24 rounded-full bg-gradient-to-r from-brand-600 to-brand-500" />
            <div className="h-7 w-20 rounded-full border border-white/12" />
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
                className="space-y-2 rounded-lg border border-white/8 bg-white/[0.025] p-3"
              >
                <div
                  className="size-6 rounded-md"
                  style={{
                    background: [
                      'linear-gradient(135deg,#2563eb,#3d9bff)',
                      'linear-gradient(135deg,#22d3ee,#3d9bff)',
                      'linear-gradient(135deg,#8b5cf6,#22d3ee)',
                    ][i],
                  }}
                />
                <div className="h-1.5 w-full rounded-full bg-white/12" />
                <div className="h-1.5 w-2/3 rounded-full bg-white/8" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dashboard kartı */}
      <motion.div
        {...float(1.2, 14)}
        className="glass-panel absolute -top-8 -right-4 z-20 w-44 rounded-xl p-3.5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] sm:-right-10 sm:w-52"
      >
        <div className="flex items-center justify-between">
          <span className="font-sans text-[0.62rem] text-fg-dim">Talepler</span>
          <Activity className="size-3.5 text-cyan-glow" />
        </div>
        <div className="mt-3 flex h-14 items-end gap-1.5">
          {[38, 55, 42, 72, 60, 88, 76].map((h, i) => (
            <motion.span
              key={i}
              initial={reduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.9 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: `${h}%` }}
              className="flex-1 origin-bottom rounded-sm bg-gradient-to-t from-brand-600/70 to-cyan-glow/90"
            />
          ))}
        </div>
      </motion.div>

      {/* Mobil ekran */}
      <motion.div
        {...float(2.1, 12)}
        className="glass-panel absolute -bottom-10 -left-2 z-20 w-28 rounded-2xl p-2 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] sm:-left-8 sm:w-32"
      >
        <div className="rounded-xl border border-white/8 bg-ink-950/70 p-2.5">
          <div className="mx-auto mb-2.5 h-1 w-8 rounded-full bg-white/20" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-gradient-to-r from-brand-500 to-cyan-glow" />
            <div className="h-1.5 w-full rounded-full bg-white/10" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/8" />
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <div className="h-7 rounded-md border border-white/8 bg-white/[0.03]" />
            <div className="h-7 rounded-md border border-white/8 bg-white/[0.03]" />
          </div>
          <div className="mt-2 h-5 rounded-md bg-gradient-to-r from-brand-600 to-brand-500" />
        </div>
        <div className="mt-2 flex items-center justify-center gap-1 text-[0.55rem] text-fg-dim">
          <Smartphone className="size-2.5" />
          Mobil uyumlu
        </div>
      </motion.div>

      {/* Kod / API rozeti */}
      <motion.div
        {...float(0.7, 10)}
        className="glass-panel absolute -bottom-4 right-2 z-20 rounded-xl px-3.5 py-2.5 shadow-[0_20px_50px_-26px_rgba(0,0,0,0.95)] sm:right-0"
      >
        <div className="flex items-center gap-2">
          <Code2 className="size-3.5 text-brand-400" />
          <code className="font-mono text-[0.6rem] text-fg-muted">
            POST /api/v1/quote-requests
          </code>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[0.55rem] text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          201 Created
        </div>
      </motion.div>

      {/* Performans rozeti */}
      <motion.div
        {...float(1.6, 9)}
        // Sol dikey kot ile çakışmaması için biraz aşağı alındı.
        className="glass-panel absolute top-1/2 -left-6 z-0 hidden rounded-xl px-3 py-2 sm:-left-14 lg:block"
      >
        <div className="flex items-center gap-2 text-[0.6rem] text-fg-muted">
          <Zap className="size-3.5 text-amber-300" />
          Hızlı yüklenen arayüz
        </div>
      </motion.div>
    </div>
  )
}
