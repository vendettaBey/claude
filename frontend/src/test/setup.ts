import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

/**
 * jsdom bu API'leri sağlamaz. Testlerde varsayılan olarak "hareket azaltma
 * kapalı, dokunmatik olmayan masaüstü" profilini taklit ediyoruz.
 */
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

if (!window.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
}

if (!window.ResizeObserver) {
  class MockResizeObserver implements ResizeObserver {
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
  }
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
}

// jsdom scrollTo'yu uygulamaz; testlerde gereksiz uyarı üretmemesi için susturuyoruz.
window.scrollTo = (() => {}) as typeof window.scrollTo

// Radix bileşenleri jsdom'da bulunmayan bu API'leri çağırır.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}
