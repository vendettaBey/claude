/**
 * Klavye kullanıcılarının menüyü atlayıp doğrudan içeriğe geçmesini sağlar.
 * Odaklanana kadar görünmez, odakta tam olarak görünür.
 */
export function SkipLink() {
  return (
    <a
      href="#ana-icerik"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[95] focus:rounded-full focus:border focus:border-white/20 focus:bg-ink-850 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-fg"
    >
      İçeriğe geç
    </a>
  )
}
