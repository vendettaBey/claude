import { useEffect } from 'react'
import { site } from '@/constants/site'

type SeoProps = {
  title: string
  description: string
  /** Site köküne göreli yol, örn. "/gizlilik-politikasi". */
  path: string
  /** Yasal sayfalar gibi indekslenmesi gerekmeyen sayfalar için. */
  noIndex?: boolean
  /** Sayfaya özel yapısal veri (JSON-LD). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const JSONLD_ID = 'route-jsonld'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Rota bazlı meta yönetimi.
 *
 * SPA olduğumuz için başlık, açıklama, canonical ve OG etiketleri gezinme
 * sırasında burada güncellenir. Sunucuda prerender kullanılırsa aynı değerler
 * ilk HTML'e de basılabilir (bkz. README → SEO notu).
 */
export function Seo({ title, description, path, noIndex, jsonLd }: SeoProps) {
  useEffect(() => {
    const url = `${site.url}${path}`

    document.title = title

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, noIndex])

  useEffect(() => {
    // Önceki rotanın yapısal verisini temizleyip yenisini basıyoruz.
    document.getElementById(JSONLD_ID)?.remove()
    if (!jsonLd) return

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = JSONLD_ID
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    return () => script.remove()
  }, [jsonLd])

  return null
}
