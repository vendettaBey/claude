import type { TechMark as TechMarkKind } from '@/types'

/**
 * Teknoloji işaretleri.
 *
 * Marka logolarını birebir kopyalamak yerine, her teknoloji için tanınabilir
 * ama tek elden çizilmiş geometrik işaretler kullanıyoruz. Böylece ikon seti
 * tutarlı kalıyor, ek dosya indirilmiyor ve marka varlıkları izinsiz
 * çoğaltılmıyor. Renk `currentColor` üzerinden gelir.
 */
export function TechMarkIcon({ mark, className }: { mark: TechMarkKind; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (mark) {
    // Laravel: köşeli, akan "L" hattı
    case 'laravel':
      return (
        <svg {...common}>
          <path d="M3 7.5 7.5 5l4.5 2.5v5L7.5 15 3 12.5v-5Z" />
          <path d="M12 12.5 16.5 10 21 12.5v5L16.5 20 12 17.5v-5Z" />
        </svg>
      )
    // PHP: elips içinde dil işareti
    case 'php':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="10" ry="6.2" />
          <path d="M7.6 14.4 9 9.6h1.9c.9 0 1.4.5 1.2 1.4-.2.9-.9 1.4-1.8 1.4H9" />
          <path d="M14 14.4l1.4-4.8h1.9c.9 0 1.4.5 1.2 1.4-.2.9-.9 1.4-1.8 1.4h-1.3" />
        </svg>
      )
    // React: çekirdek + üç yörünge
    case 'react':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      )
    // TypeScript: kare içinde "TS"
    case 'typescript':
      return (
        <svg {...common}>
          <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
          <path d="M7 11h4M9 11v6" />
          <path d="M17.5 11.6c-.4-.5-1-.8-1.7-.8-1 0-1.7.5-1.7 1.4 0 1.9 3.6 1 3.6 3 0 1-.8 1.6-1.9 1.6-.8 0-1.5-.3-1.9-.9" />
        </svg>
      )
    // JavaScript: kare içinde "JS"
    case 'javascript':
      return (
        <svg {...common}>
          <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
          <path d="M10.2 11v4.6c0 1-.6 1.6-1.5 1.6-.7 0-1.3-.4-1.6-1" />
          <path d="M17.4 11.7c-.4-.5-1-.8-1.7-.8-1 0-1.6.5-1.6 1.3 0 1.8 3.5 1 3.5 2.9 0 .9-.8 1.5-1.8 1.5-.8 0-1.5-.3-1.9-.9" />
        </svg>
      )
    // Tailwind: iki akan dalga
    case 'tailwind':
      return (
        <svg {...common}>
          <path d="M3 11c1-3 2.7-4.5 5-4.5 3.5 0 3.9 4.5 6.5 4.5 1.5 0 2.4-.8 3-2" />
          <path d="M3 17c1-3 2.7-4.5 5-4.5 3.5 0 3.9 4.5 6.5 4.5 1.5 0 2.4-.8 3-2" />
        </svg>
      )
    // MySQL: veritabanı silindiri
    case 'mysql':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      )
    // REST API: iki uç arasında veri akışı
    case 'restapi':
      return (
        <svg {...common}>
          <rect x="2" y="8" width="6" height="8" rx="2" />
          <rect x="16" y="8" width="6" height="8" rx="2" />
          <path d="M8 10.5h8M16 13.5H8" />
          <path d="m14 8.5 2 2-2 2M10 15.5l-2-2 2-2" />
        </svg>
      )
    // Git: dal grafiği
    case 'git':
      return (
        <svg {...common}>
          <circle cx="6" cy="18" r="2.4" />
          <circle cx="6" cy="6" r="2.4" />
          <circle cx="18" cy="10" r="2.4" />
          <path d="M6 8.4v7.2" />
          <path d="M15.6 10H12a6 6 0 0 0-6 6" />
        </svg>
      )
    // Docker: istiflenmiş konteynerler
    case 'docker':
      return (
        <svg {...common}>
          <rect x="3" y="12" width="4" height="4" />
          <rect x="8" y="12" width="4" height="4" />
          <rect x="13" y="12" width="4" height="4" />
          <rect x="8" y="7.5" width="4" height="4" />
          <path d="M3 16.5c0 2.5 2 4 5.5 4 5 0 8.5-2.5 9.5-6 1.5.3 2.6 0 3-1-1-.7-2.2-.7-3.4-.2" />
        </svg>
      )
    // Redis: istiflenmiş bellek katmanları
    case 'redis':
      return (
        <svg {...common}>
          <path d="M3 7.5 12 4l9 3.5L12 11 3 7.5Z" />
          <path d="m3 12 9 3.5L21 12" />
          <path d="m3 16.5 9 3.5 9-3.5" />
        </svg>
      )
    // Vite: şimşek
    case 'vite':
      return (
        <svg {...common}>
          <path d="M3.5 5.5 12 21l8.5-15.5L12 8 3.5 5.5Z" />
          <path d="m12 8 .6 5.4L15 10" />
        </svg>
      )
    // Nginx: altıgen (sunucu)
    case 'nginx':
      return (
        <svg {...common}>
          <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z" />
          <path d="M9 16V9l6 6V9" />
        </svg>
      )
    // Cloudflare: bulut + kalkan hattı
    case 'cloudflare':
      return (
        <svg {...common}>
          <path d="M17 17H7.5A4.5 4.5 0 0 1 7 8.05 6 6 0 0 1 18.4 9.3 3.9 3.9 0 0 1 17.8 17" />
          <path d="M10 13h8.5" />
        </svg>
      )
    // HTML5: kalkan + 5
    case 'html5':
      return (
        <svg {...common}>
          <path d="M4 3h16l-1.5 16.5L12 21.5 5.5 19.5 4 3Z" />
          <path d="M15.5 8H9l.4 3.5h5.7l-.4 3.6-2.7.8-2.7-.8" />
        </svg>
      )
    // CSS3: kalkan + eğik hat
    case 'css3':
      return (
        <svg {...common}>
          <path d="M4 3h16l-1.5 16.5L12 21.5 5.5 19.5 4 3Z" />
          <path d="M16 8H8.6l.3 3h6.5l-.4 3.8-3 .9-3-.9" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}
