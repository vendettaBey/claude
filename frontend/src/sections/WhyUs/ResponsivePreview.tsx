import { useEffect, useRef, useState } from 'react'
import { Menu, Monitor, Smartphone, Tablet } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * "Canlı önizleme" — duyarlı tasarım iddiasının somut kanıtı.
 *
 * Orhun gibi ajans siteleri bunu sabit cihaz fotoğraflarıyla (laptop/tablet/
 * telefon maketi) anlatır. Burada ziyaretçi kaydırıcıyı kendi eliyle sürükler
 * ve aynı arayüzün yalnızca küçülmediğini, belirli genişliklerde gerçekten
 * yeniden kurulduğunu (kolon sayısı, gezinme menüsü) görür — iddia yerine kanıt.
 *
 * Genişlik mutlak piksel yerine oran (`ratio`) olarak tutulur: pencere yeniden
 * boyutlandığında kart hangi oranda duruyorsa (ör. "tablet" bandının ortası)
 * orada kalmaya devam eder, `ResizeObserver` her ölçümde konumu sıfırlamaz.
 */

type Bucket = 'mobile' | 'tablet' | 'desktop'

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
      <span className="size-2.5 shrink-0 rounded-full bg-brand-400" />
      <span className="h-1.5 w-10 shrink-0 rounded-full bg-white/20" />
      <span className="flex-1" />
      {bucket === 'desktop' && (
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-8 rounded-full bg-white/14" />
          ))}
          <span className="h-5 w-14 rounded-full bg-brand-400/80" />
        </div>
      )}
      {bucket === 'tablet' && (
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-7 rounded-full bg-white/14" />
          <span className="h-5 w-12 rounded-full bg-brand-400/80" />
        </div>
      )}
      {bucket === 'mobile' && <Menu className="size-3.5 text-fg-dim" aria-hidden="true" />}
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
            <span className="block size-4 rounded bg-brand-400/70" />
            <Bar w="100%" tone="dim" />
            {bucket !== 'mobile' && <Bar w="70%" tone="dim" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResponsivePreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [maxWidth, setMaxWidth] = useState(640)
  // Kaydırıcının konumu 0–1 arası oran olarak tutulur — mutlak piksel değil.
  // Pencere yeniden boyutlanınca kart "hangi banttaysa" orada kalmaya devam eder.
  const [ratio, setRatio] = useState(0.62)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => setMaxWidth(Math.round(el.clientWidth))
    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Alt sınır, konteynerin oranına göre esner: küçük bir kartta sabit 220px
  // neredeyse tüm aralığı yer kaplardı.
  const minWidth = Math.max(140, Math.round(maxWidth * 0.4))
  const width = Math.round(minWidth + ratio * (maxWidth - minWidth))

  const bucket: Bucket = ratio < 0.5 ? 'mobile' : ratio < 0.78 ? 'tablet' : 'desktop'
  const { label: bucketLabel, icon: BucketIcon } = BUCKET_META[bucket]

  return (
    <div className="card-surface corner-marks relative overflow-hidden p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="annotation text-brand-400">Canlı Önizleme</span>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-fg sm:text-xl">
            Aynı arayüz, her ekranda kendini yeniden kurar
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
            Aşağıdaki kaydırıcıyı sürükleyin. Panel yalnızca küçülmüyor —
            menü daralıyor, kart ızgarası sütun değiştiriyor.
          </p>
        </div>
        <span className="annotation flex shrink-0 items-center gap-1.5 text-fg-dim tabular-nums">
          <BucketIcon className="size-3.5" aria-hidden="true" />
          {width}px · {bucketLabel}
        </span>
      </div>

      <div ref={containerRef} className="mt-6 flex justify-center">
        <div
          className="overflow-hidden rounded-xl border border-white/10 bg-ink-950/80 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-[width] duration-150 ease-out"
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
        onChange={(event) => setRatio(Number(event.target.value) / 100)}
        aria-label="Önizleme genişliğini ayarla"
        className={cn(
          'mt-6 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-400',
          '[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-400',
          '[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(61,155,255,0.18)]',
          '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-400',
        )}
      />
    </div>
  )
}
