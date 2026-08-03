import { useEffect, useRef, useState, type RefObject } from 'react'

type Options = {
  /** Gözlem alanının kenar payı. */
  rootMargin?: string
  /**
   * Gözlemci hiç tetiklenmezse içeriği yine de açan güvenlik zamanlayıcısı (ms).
   * 0 verilirse devre dışı kalır.
   */
  failsafeMs?: number
  /** false ise gözlem kurulmaz ve doğrudan görünür kabul edilir. */
  enabled?: boolean
}

/**
 * Bir öğe ilk kez görünür alana girdiğinde true döner ve gözlemi bırakır.
 *
 * Üç katmanlı güvence:
 *  1. Bağlandığı anda öğe zaten ekrandaysa gözlemci beklenmez,
 *  2. IntersectionObserver desteklenmiyorsa doğrudan görünür kabul edilir,
 *  3. Gözlemci sessiz kalırsa zamanlayıcı devreye girer.
 *
 * Böylece scroll ile açılan içerik hiçbir koşulda `opacity: 0` durumunda
 * kilitli kalmaz (tam sayfa ekran görüntüsü, yazdırma, eklenti senaryoları).
 */
export function useInViewOnce<T extends HTMLElement>(
  options: Options = {},
): [RefObject<T | null>, boolean] {
  const { rootMargin = '0px 0px -5% 0px', failsafeMs = 1200, enabled = true } = options

  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return

    /* Bu senkron setState kuralın meşru istisnasıdır: dış bir yetenekle
       (IntersectionObserver desteği) tek seferlik eşitleme yapıyoruz ve
       `inView` true olduktan sonra etki erken çıktığı için zincirleme render
       oluşmuyor. */
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    if (!enabled || typeof IntersectionObserver === 'undefined') return setInView(true)

    const el = ref.current
    if (!el) return

    /* Not: burada "öğe zaten ekranda mı" diye ölçüm YAPILMAZ. Bu ölçüm mount
       anında çalışır ve sayfa yerleşimi henüz oturmadığı için ekranın çok
       altındaki öğeler de görünür sanılır; sonuç olarak tüm scroll
       animasyonları açılışta birden tetiklenir. IntersectionObserver ilk
       bildirimini zaten doğru konumla gönderir. */

    // IntersectionObserver, gözlenen her öğe için ilk anda bir geri bildirim
    // gönderir (öğe ekran dışındaysa `isIntersecting: false` olarak). Bu ilk
    // bildirimin hiç gelmemesi, gözlemcinin çalışmadığı anlamına gelir.
    let observerResponded = false

    const observer = new IntersectionObserver(
      (entries) => {
        observerResponded = true
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 },
    )
    observer.observe(el)

    // 3) Güvenlik ağı YALNIZCA gözlemci hiç yanıt vermediyse devreye girer.
    //    Koşulsuz açmak, ekran altındaki tüm içeriğin kendiliğinden
    //    görünmesine ve scroll animasyonunun tamamen kaybolmasına yol açar.
    const failsafe =
      failsafeMs > 0
        ? window.setTimeout(() => {
            if (!observerResponded) setInView(true)
          }, failsafeMs)
        : 0

    return () => {
      observer.disconnect()
      if (failsafe) window.clearTimeout(failsafe)
    }
  }, [enabled, failsafeMs, rootMargin, inView])

  return [ref, inView]
}
