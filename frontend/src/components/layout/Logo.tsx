import { cn } from '@/lib/cn'

type LogoProps = {
  className?: string
  /** Yalnızca işaret göster. */
  compact?: boolean
}

/** Marka işareti — SVG olarak gömülü, ek ağ isteği gerektirmez. */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid size-9 shrink-0 place-items-center">
        <svg viewBox="0 0 36 36" className="size-9" role="img" aria-label="Ülkü Yazılım logosu">
          <defs>
            <linearGradient id="uy-logo-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="55%" stopColor="#3d9bff" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="34" height="34" rx="10" fill="url(#uy-logo-gradient)" opacity="0.16" />
          <rect
            x="1"
            y="1"
            width="34"
            height="34"
            rx="10"
            fill="none"
            stroke="url(#uy-logo-gradient)"
            strokeWidth="1.4"
            opacity="0.75"
          />
          {/* Stilize "Ü": iki ayak, tabanda birleşen kavis ve iki nokta */}
          <path
            d="M12 12.5v8.2a6 6 0 0 0 12 0V12.5"
            fill="none"
            stroke="url(#uy-logo-gradient)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="14.4" cy="9" r="1.35" fill="#7cc4ff" />
          <circle cx="21.6" cy="9" r="1.35" fill="#22d3ee" />
        </svg>
      </span>
      {!compact && (
        // `whitespace-nowrap`: dar başlıkta marka adı iki satıra düşüp
        // header'ın yüksekliğini bozuyordu.
        <span className="font-display text-[1.05rem] font-semibold tracking-tight whitespace-nowrap text-fg">
          Ülkü <span className="text-gradient">Yazılım</span>
        </span>
      )}
    </span>
  )
}
