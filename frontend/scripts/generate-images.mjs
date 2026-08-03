/**
 * Sosyal paylaşım görselini (og-image.png) ve apple-touch-icon.png dosyasını
 * SVG kaynağından üretir.
 *
 * Çalıştırma:  npm run images
 *
 * Görseller `public/` altına yazılır ve depoya dahil edilir; böylece normal
 * build sürecinde ek bir adım gerekmez.
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, '../public')

const BG = '#05060A'

/** 1200×630 Open Graph kartı. */
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="50%" stop-color="#3d9bff"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="120" cy="90" r="380" fill="url(#glowA)"/>
  <circle cx="1090" cy="560" r="340" fill="url(#glowB)"/>

  <!-- Logo işareti -->
  <g transform="translate(90, 92)">
    <rect x="0" y="0" width="76" height="76" rx="22" fill="url(#brand)" fill-opacity="0.16"/>
    <rect x="0" y="0" width="76" height="76" rx="22" fill="none" stroke="url(#brand)" stroke-width="2.6" stroke-opacity="0.8"/>
    <path d="M25 26v18a13 13 0 0 0 26 0V26" fill="none" stroke="url(#brand)" stroke-width="5.6" stroke-linecap="round"/>
    <circle cx="30" cy="18" r="3" fill="#7cc4ff"/>
    <circle cx="46" cy="18" r="3" fill="#22d3ee"/>
  </g>
  <text x="188" y="146" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="600" fill="#eef2f8">
    Ülkü Yazılım
  </text>

  <!-- Ana başlık — satır uzunlukları 1200px genişliğe göre ayarlandı -->
  <text x="90" y="296" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700" fill="#eef2f8">
    İşletmenize sadece bir web sitesi değil,
  </text>
  <text x="90" y="368" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="700" fill="url(#brand)">
    çalışan bir dijital sistem.
  </text>

  <text x="90" y="436" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#a8b4c6">
    Kurumsal web siteleri · Özel yazılımlar · Web uygulamaları
  </text>

  <!-- Alt şerit -->
  <rect x="90" y="506" width="340" height="3" rx="1.5" fill="url(#brand)"/>
  <text x="90" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="23" fill="#8494ab">
    ulkuyazilim.com · İstanbul
  </text>
</svg>`

/** 180×180 iOS ana ekran ikonu. */
const touchIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="55%" stop-color="#3d9bff"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="40" fill="${BG}"/>
  <path d="M60 62v41a30 30 0 0 0 60 0V62" fill="none" stroke="url(#g)" stroke-width="14" stroke-linecap="round"/>
  <circle cx="72" cy="45" r="7" fill="#7cc4ff"/>
  <circle cx="108" cy="45" r="7" fill="#22d3ee"/>
</svg>`

async function main() {
  await mkdir(publicDir, { recursive: true })

  const og = await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(resolve(publicDir, 'og-image.png'), og)

  const icon = await sharp(Buffer.from(touchIconSvg)).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(resolve(publicDir, 'apple-touch-icon.png'), icon)

  // 192×192 ve 512×512 — site.webmanifest için. Android/Chrome PWA kurulum
  // istemi ve bazı Lighthouse denetimleri SVG-yalnızca ikonu yeterli saymıyor;
  // aynı vektör kaynaktan üretildiği için ekstra tasarım gerekmiyor.
  const icon192 = await sharp(Buffer.from(touchIconSvg))
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(resolve(publicDir, 'icon-192.png'), icon192)

  const icon512 = await sharp(Buffer.from(touchIconSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(resolve(publicDir, 'icon-512.png'), icon512)

  console.log('✓ public/og-image.png (1200×630)')
  console.log('✓ public/apple-touch-icon.png (180×180)')
  console.log('✓ public/icon-192.png (192×192)')
  console.log('✓ public/icon-512.png (512×512)')
}

main().catch((error) => {
  console.error('Görseller üretilemedi:', error)
  process.exitCode = 1
})
