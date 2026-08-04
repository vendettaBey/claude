import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Menu, Monitor, RefreshCw, Smartphone, Tablet } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * "Canlı önizleme" — duyarlı tasarım iddiasını hareketli bir kanıta dönüştürür.
 * Önizleme boşta kaldığında mobil, tablet ve masaüstü eşiklerini otomatik dolaşır;
 * ziyaretçi kaydırıcıya dokunduğunda kontrol geçici olarak ona geçer.
 */

type Bucket = 'mobile' | 'tablet' | 'desktop'

const AUTO_STOPS = [0.22, 0.64, 0.94, 0.64] as const
const AUTO_SPEED = 1 / 5000
const AUTO_HOLD_MS = 850
const AUTO_RESUME_MS = 5200

const BUCKET_META: Record<Bucket, { label: string; icon: typeof Smartphone }> = {
  mobile: { label: 'Mobil', icon: Smartphone },
  tablet: { label: 'Tablet', icon: Tablet },
  desktop: { label: 'Masaüstü', icon: Monitor },
}

function Bar({ w, tone = 'muted' }: { w: string; tone?: 'muted' | 'dim' | 'accent' }) {
  return (
    <span
      className={cn(
        'block h-1.5 rounded-full',
        tone === 'accent' && 'bg-brand-400',
        tone === 'muted' && 'bg-white/16',
        tone === 'dim' && 'bg-white/8',
      )}
      style={{ width: w }}
    />
  )
}

/** Gezinme çubuğu: masaüstünde tam menü, tablette daraltılmış, mobilde hamburger. */
function MockNav({ bucket }: { bucket: Bucket }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-3 py-2.5">
      <span className="bg-brand-400 size-2.5 shrink-0 rounded-full" />
      <span className="h-1.5 w-10 shrink-0 rounded-full bg-white/20" />
      <span className="flex-1" />
      {bucket === 'desktop' && (
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-8 rounded-full bg-white/14" />
          ))}
          <span className="bg-brand-400/80 h-5 w-14 rounded-full" />
        </div>
      )}
      {bucket === 'tablet' && (
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-7 rounded-full bg-white/14" />
          <span className="bg-brand-400/80 h-5 w-12 rounded-full" />
        </div>
      )}
      {bucket === 'mobile' && <Menu className="text-fg-dim size-3.5" aria-hidden="true" />}
    </div>
  )
}

/** Gövde: kart ızgarası bucket'a göre 3 → 2 → 1 sütuna iner, düz ölçeklenmez. */
function MockBody({ bucket }: { bucket: Bucket }) {
  const cols = bucket === 'desktop' ? 3 : bucket === 'tablet' ? 2 : 1
  const cards = bucket === 'mobile' ? 3 : cols === 2 ? 4 : 3

  return (
    <div className="space-y-3 p-4">
      <div className="space-y-1.5">
        <Bar w={bucket === 'mobile' ? '70%' : '42%'} tone="accent" />
        <Bar w={bucket === 'mobile' ? '100%' : '68%'} />
        {bucket !== 'mobile' && <Bar w="52%" tone="dim" />}
      </div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="space-y-1.5 rounded-md border border-white/8 bg-white/[0.02] p-2">
            <span className="bg-brand-400/70 block size-4 rounded" />
            <Bar w="100%" tone="dim" />
            {bucket !== 'mobile' && <Bar w="70%" tone="dim" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResponsivePreview() {
  const previewRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion() ?? false
  const [maxWidth, setMaxWidth] = useState(640)
  const [ratio, setRatio] = useState(0.62)
  const ratioRef = useRef(ratio)
  const autoRunningRef = useRef(!reducedMotion)
  const targetIndexRef = useRef(2)
  const holdUntilRef = useRef(0)
  const resumeTimerRef = useRef<number | null>(null)
  const visibleRef = useRef(true)
  const [autoRunning, setAutoRunning] = useState(!reducedMotion)

  const updateRatio = useCallback((next: number) => {
    const safeRatio = Math.min(1, Math.max(0, next))
    ratioRef.current = safeRatio
    setRatio(safeRatio)
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const update = () => setMaxWidth(Math.round(element.clientWidth))
    update()

    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      autoRunningRef.current = false
      return
    }

    const element = previewRef.current
    const observer = element
      ? new IntersectionObserver(
          ([entry]) => {
            visibleRef.current = entry.isIntersecting
          },
          { threshold: 0.12 },
        )
      : null

    if (element) observer?.observe(element)

    let frame = 0
    let previousTime = performance.now()

    const animate = (time: number) => {
      const delta = Math.min(time - previousTime, 50)
      previousTime = time

      if (
        autoRunningRef.current &&
        visibleRef.current &&
        document.visibilityState === 'visible' &&
        time >= holdUntilRef.current
      ) {
        const target = AUTO_STOPS[targetIndexRef.current]
        const current = ratioRef.current
        const distance = target - current
        const step = Math.sign(distance) * Math.min(Math.abs(distance), delta * AUTO_SPEED)
        const next = current + step

        updateRatio(next)

        if (Math.abs(target - next) < 0.001) {
          updateRatio(target)
          targetIndexRef.current = (targetIndexRef.current + 1) % AUTO_STOPS.length
          holdUntilRef.current = time + AUTO_HOLD_MS
        }
      }

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [reducedMotion, updateRatio])

  useEffect(
    () => () => {
      if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current)
    },
    [],
  )

  const startAutomation = useCallback(() => {
    if (reducedMotion) return

    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current)

    const current = ratioRef.current
    targetIndexRef.current = current < 0.5 ? 1 : current < 0.78 ? 2 : 1
    holdUntilRef.current = performance.now() + 240
    autoRunningRef.current = true
    setAutoRunning(true)
  }, [reducedMotion])

  const pauseTemporarily = useCallback(() => {
    if (reducedMotion) return

    autoRunningRef.current = false
    setAutoRunning(false)

    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = window.setTimeout(startAutomation, AUTO_RESUME_MS)
  }, [reducedMotion, startAutomation])

  const toggleAutomation = useCallback(() => {
    if (autoRunningRef.current) {
      if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
      autoRunningRef.current = false
      setAutoRunning(false)
      return
    }

    startAutomation()
  }, [startAutomation])

  const minWidth = Math.max(140, Math.round(maxWidth * 0.4))
  const width = Math.round(minWidth + ratio * (maxWidth - minWidth))
  const bucket: Bucket = ratio < 0.5 ? 'mobile' : ratio < 0.78 ? 'tablet' : 'desktop'
  const { label: bucketLabel, icon: BucketIcon } = BUCKET_META[bucket]

  return (
    <div ref={previewRef} className="card-surface corner-marks relative overflow-hidden p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="annotation text-brand-400">Canlı Önizleme</span>
          <h3 className="font-display text-fg mt-1.5 text-lg font-semibold sm:text-xl">
            Aynı arayüz, her ekranda kendini yeniden kurar
          </h3>
          <p className="text-fg-muted mt-2 max-w-xl text-sm leading-relaxed">
            Önizleme mobil, tablet ve masaüstü ölçülerini otomatik dolaşır. Panel yalnızca
            küçülmüyor — menü daralıyor, kart ızgarası sütun değiştiriyor. İstediğiniz anda
            kaydırıcıyla kontrolü alın.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="annotation text-fg-dim flex items-center gap-1.5 tabular-nums">
            <BucketIcon className="size-3.5" aria-hidden="true" />
            {width}px · {bucketLabel}
          </span>
          {!reducedMotion && (
            <button
              type="button"
              onClick={toggleAutomation}
              aria-pressed={autoRunning}
              aria-label={autoRunning ? 'Otomatik önizlemeyi durdur' : 'Otomatik önizlemeyi başlat'}
              className="annotation text-brand-400 hover:text-brand-500 inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw
                className={cn('size-3.5', autoRunning && 'animate-spin [animation-duration:3.2s]')}
                aria-hidden="true"
              />
              {autoRunning ? 'Otomatik demo' : 'Kontrol sizde'}
            </button>
          )}
        </div>
      </div>

      <div ref={containerRef} className="mt-6 flex justify-center">
        <div
          className="bg-ink-950/80 overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-[width] duration-150 ease-out"
          style={{ width }}
        >
          <MockNav bucket={bucket} />
          <MockBody bucket={bucket} />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(ratio * 100)}
        onChange={(event) => {
          pauseTemporarily()
          updateRatio(Number(event.target.value) / 100)
        }}
        onPointerDown={pauseTemporarily}
        onKeyDown={pauseTemporarily}
        aria-label="Önizleme genişliğini ayarla"
        className={cn(
          'accent-brand-400 mt-6 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10',
          '[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:bg-brand-400 [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(61,155,255,0.18)]',
          '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:bg-brand-400 [&::-moz-range-thumb]:border-0',
        )}
      />
    </div>
  )
}
