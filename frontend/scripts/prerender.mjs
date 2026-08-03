/**
 * Build sonrası her rotayı gerçek bir tarayıcıda açıp DOM'un son hâlini
 * statik HTML olarak yazar.
 *
 * Neden gerekli: Bu bir SPA'dır. Başlık, açıklama, canonical, Open Graph ve
 * yapısal veri `Seo.tsx` içinde `useEffect` ile JS çalıştıktan sonra yazılır.
 * Google gibi arama motorları JS'i işler, ama WhatsApp/LinkedIn/Twitter/Slack
 * gibi link önizleme botları JS ÇALIŞTIRMAZ — yalnızca ilk HTML'i okur. Bu
 * yüzden alt sayfalar (gizlilik politikası, çerez politikası, KVKK metni)
 * paylaşıldığında şu ana kadar hep ana sayfanın önizlemesini gösteriyordu.
 *
 * Bu script Vite'ın `preview` sunucusunu ayağa kaldırır, her rotayı Playwright
 * ile ziyaret eder, uygulama monte olup `Seo` etkileri çalıştıktan sonra
 * `document.documentElement.outerHTML`'i doğrudan `dist/<rota>/index.html`
 * dosyasına yazar. Nginx zaten `try_files $uri $uri/ /index.html` kullandığı
 * için (bkz. docker/nginx/default.conf) bu klasör yapısı ek bir sunucu
 * yapılandırması gerektirmez — `/gizlilik-politikasi` isteği otomatik olarak
 * `dist/gizlilik-politikasi/index.html`'e düşer.
 *
 * Bilinçli olarak `npm run build`'a otomatik bağlanmadı: bu depo Docker
 * imajını `node:22-alpine` üzerinde kuruyor (bkz. docker/nginx/Dockerfile) ve
 * Playwright'ın Chromium indirmesi Alpine/musl üzerinde resmi olarak
 * desteklenmiyor. `npm run build` sonrası ayrı bir adım olarak (`npm run
 * prerender`) çalıştırılması, mevcut Docker kurulumunu bozma riskini sıfıra
 * indirir. Docker imajına eklemek istenirse önce `node:22-bookworm-slim` gibi
 * glibc tabanlı bir imajda ayrıca doğrulanmalı.
 *
 * Gerçek ziyaretçiler için risk yok: `main.tsx` hâlâ `createRoot` kullanıyor,
 * yani tarayıcıda JS yüklenince mevcut prerender edilmiş içerik React
 * tarafından yeniden oluşturulur (hydration denenmez). Bu, hydration uyuşmazlığı
 * riskini tamamen ortadan kaldırır; tek fark, JS yüklenene kadar ziyaretçinin
 * artık boş bir kabuk yerine gerçek içerik görmesidir (daha iyi ilk boya).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))
const frontendRoot = resolve(here, '..')

/** sitemap.xml ile birebir aynı olmalı — orada olmayan bir rota burada da olmamalı. */
const ROUTES = ['/', '/gizlilik-politikasi', '/cerez-politikasi', '/kvkk-aydinlatma-metni']

const PORT = 4319

/** '/' → dist/index.html, '/gizlilik-politikasi' → dist/gizlilik-politikasi/index.html */
function outputPathFor(route) {
  if (route === '/') return resolve(frontendRoot, 'dist/index.html')
  const trimmed = route.replace(/^\/|\/$/g, '')
  return resolve(frontendRoot, 'dist', trimmed, 'index.html')
}

async function main() {
  const server = await preview({
    root: frontendRoot,
    preview: { port: PORT, host: '127.0.0.1', strictPort: true },
  })
  const baseUrl = `http://127.0.0.1:${PORT}`

  const browser = await chromium.launch()

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

    for (const route of ROUTES) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })

      // Uygulamanın monte olduğunu doğrula; Seo'nun useEffect'leri React'in
      // commit'inden hemen sonra çalışır, bu yüzden kısa bir güvenlik payı
      // networkidle'ın önündeki her türlü mikro-görevi de kapsar.
      await page.waitForSelector('#ana-icerik', { timeout: 10_000 })
      await page.waitForTimeout(200)

      const html = await page.evaluate(() => document.documentElement.outerHTML)
      const outputPath = outputPathFor(route)

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, `<!doctype html>\n${html}\n`, 'utf-8')

      const title = await page.title()
      console.log(`✓ ${route.padEnd(28)} → ${outputPath.replace(frontendRoot + '\\', '')}  ("${title}")`)
    }
  } finally {
    await browser.close()
    await new Promise((res) => server.httpServer.close(res))
  }
}

main().catch((error) => {
  console.error('Prerender başarısız oldu:', error)
  process.exitCode = 1
})
