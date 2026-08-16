import type Lenis from 'lenis'

/**
 * Uygulama genelinde tek bir Lenis örneği tutulur.
 * SmoothScroll bileşeni burayı doldurur; çapa bağlantıları buradan okur.
 */
let lenisInstance: Lenis | null = null

export function setLenisInstance(instance: Lenis | null): void {
  lenisInstance = instance
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Sabit header'ın kapatmaması için hedefin üstünde bırakılan boşluk. */
const HEADER_OFFSET = 84

/**
 * Sayfa içi çapa bağlantıları için yumuşak kaydırma.
 * Lenis varsa onu kullanır, yoksa yerel scrollIntoView'a düşer.
 * Scroll hijacking yapmaz — kullanıcı istediği an kaydırmayı kesebilir.
 */
export function scrollToSection(hash: string): boolean {
  const id = hash.replace(/^#/, '')
  const target = document.getElementById(id)
  if (!target) return false

  const reduced = prefersReducedMotion()
  const lenis = getLenisInstance()

  if (lenis && !reduced) {
    // Uzak bölümlerde dahi geçiş bir saniyenin altında tamamlanır. Önceki
    // 1.1 sn ayarı uzun sayfada dekoratif boşlukların fazla görünmesine yol açıyordu.
    lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 0.78 })
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  // Klavye kullanıcıları için odak da hedefe taşınır.
  target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })

  if (history.replaceState) {
    history.replaceState(null, '', `#${id}`)
  }
  return true
}
