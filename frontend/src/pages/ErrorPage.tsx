import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { mailtoUrl, site } from '@/constants/site'
import { Seo } from '@/components/common/Seo'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Button } from '@/components/ui/Button'

type ErrorPageProps = {
  /** Hata sınırından gelen yeniden deneme fonksiyonu. */
  onRetry?: () => void
}

/**
 * 500 / beklenmeyen hata sayfası.
 * Teknik ayrıntı göstermez — kullanıcıya ne yapabileceğini söyler.
 */
export default function ErrorPage({ onRetry }: ErrorPageProps) {
  return (
    <>
      <Seo
        title="Bir sorun oluştu | Ülkü Yazılım"
        description="Beklenmeyen bir hata nedeniyle sayfa görüntülenemedi. Sayfayı yenileyebilir veya bizimle iletişime geçebilirsiniz."
        path="/500"
        noIndex
      />

      <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-32">
        <AmbientBackground intensity="soft" fadeBottom={false} />

        <div className="relative w-full max-w-xl text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-amber-400/25 bg-amber-400/10 text-amber-300">
            <AlertTriangle className="size-7" aria-hidden="true" />
          </span>

          <p className="mt-8 font-mono text-sm tracking-[0.2em] text-fg-dim uppercase">Hata 500</p>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Beklenmeyen bir sorun oluştu.</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-fg-muted">
            Sayfayı görüntülerken bir hatayla karşılaştık. Sorun bizde olabilir; sayfayı yenilemeyi
            deneyebilir ya da doğrudan bize yazabilirsiniz.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => (onRetry ? onRetry() : window.location.reload())}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Tekrar Dene
            </Button>
            <Button href="/" variant="secondary" size="lg" className="w-full sm:w-auto">
              <Home className="size-4" aria-hidden="true" />
              Ana Sayfa
            </Button>
          </div>

          <p className="mt-8 text-sm text-fg-dim">
            Sorun devam ederse{' '}
            <a href={mailtoUrl} className="text-brand-400 underline-offset-4 hover:underline">
              {site.email}
            </a>{' '}
            adresine yazabilirsiniz.
          </p>
        </div>
      </div>
    </>
  )
}
