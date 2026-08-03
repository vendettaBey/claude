# Ülkü Yazılım — Kurumsal Web Sitesi

İşletmelere özel kurumsal web siteleri, web uygulamaları ve dijital çözümler geliştiren
Ülkü Yazılım markasının kurumsal sitesi.

Frontend ve backend birbirinden ayrıdır: React arayüzü tüm kullanıcı deneyimini üstlenir,
Laravel yalnızca REST API katmanı olarak çalışır (Blade ile arayüz üretilmez).

```
.
├── frontend/          React 19 + TypeScript + Vite + Tailwind CSS 4
├── backend/           Laravel 13 + PHP 8.4 REST API
├── docker/            PHP-FPM ve Nginx imajları
└── docker-compose.yml Üretim benzeri kurulum
```

---

## 1. Hızlı başlangıç (yerel geliştirme)

İki terminal gerekir.

**Backend — Laravel API (http://localhost:8000)**

```bash
cd backend && cp .env.example .env && php artisan key:generate && php artisan migrate && php artisan serve
```

**Frontend — Vite dev sunucusu (http://localhost:5173)**

```bash
cd frontend && npm install && npm run dev
```

Vite, `/api` isteklerini `http://localhost:8000` adresine yönlendirir (bkz. `vite.config.ts`),
bu yüzden geliştirmede CORS ayarına ihtiyaç yoktur.

> Yerelde hızlı denemek için `backend/.env` içinde `DB_CONNECTION=sqlite` bırakıp
> `backend/database/database.sqlite` dosyasını oluşturmanız yeterlidir.

---

## 2. Komutlar

### Frontend (`frontend/`)

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Tip kontrolü + production build (`dist/`) |
| `npm run preview` | Build çıktısını yerelde sunar |
| `npm run test` | Vitest test paketi |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run images` | `og-image.png` ve `apple-touch-icon.png` üretir |

### Backend (`backend/`)

| Komut | Açıklama |
| --- | --- |
| `php artisan serve` | Geliştirme sunucusu |
| `php artisan migrate` | Migration'lar |
| `php artisan test` | PHPUnit test paketi |
| `php artisan queue:work` | Kuyruk işçisi (bildirim e-postaları için) |

---

## 3. API

Tek uç vardır; sürümlenmiştir ve herkese açıktır.

```
POST /api/v1/quote-requests
```

**İstek gövdesi**

| Alan | Zorunlu | Not |
| --- | --- | --- |
| `full_name` | ✓ | 2–120 karakter |
| `company_name` | — | en fazla 160 karakter |
| `email` | ✓ | geçerli e-posta |
| `phone` | ✓ | `+()0-9 .-` karakterleri, 10–20 hane |
| `service_type` | ✓ | `ServiceType` enum değeri |
| `budget_range` | ✓ | `BudgetRange` enum değeri |
| `preferred_contact_method` | ✓ | `ContactMethod` enum değeri |
| `project_description` | ✓ | 20–5000 karakter |
| `website` | — | bot tuzağı; dolu gelirse istek reddedilir |

**Başarılı yanıt — 201**

```json
{
  "success": true,
  "message": "Mesajınız bize ulaştı. Projenizi inceleyip sizinle iletişime geçeceğiz.",
  "data": { "request_id": 1, "status": "new", "created_at": "2026-01-01T09:00:00+00:00" }
}
```

**Doğrulama hatası — 422**

```json
{
  "success": false,
  "message": "Formdaki bazı alanları kontrol edin.",
  "errors": { "email": ["Geçerli bir e-posta adresi girin."] }
}
```

Yanıt hiçbir zaman kişisel veri içermez (ad, e-posta, IP dışarı verilmez).

### Güvenlik önlemleri

- Form Request ile sunucu tarafı doğrulama (Zod şemasıyla aynı kurallar)
- Oran sınırı: IP başına dakikada 5, saatte 20 istek (`429` + `Retry-After`)
- Honeypot alanı (`website`)
- IP adresi yalnızca kötüye kullanım incelemesi için saklanır, API yanıtında yer almaz
- Kişisel veriler uygulama günlüklerine yazılmaz
- 5xx hatalarında sunucu mesajı kullanıcıya yansıtılmaz
- CORS yalnızca `FRONTEND_URL` ile tanımlanan origin'lere açılır (joker yok)

---

## 4. Veri modeli

`quote_requests` tablosu:

```
id, full_name, company_name, email, phone, service_type, budget_range,
preferred_contact_method, project_description, status, ip_address,
created_at, updated_at
```

`status` değerleri `App\Enums\QuoteRequestStatus` içinde tanımlıdır:
`new · contacted · evaluating · converted · rejected`

Model ve enum'lar, ileride bir yönetim paneli (Filament veya özel panel)
eklenebilecek şekilde hazırlanmıştır. İlk sürümde panel yoktur.

---

## 5. Üretim kurulumu (Docker)

```bash
cp backend/.env.example backend/.env      # değerleri doldurun
php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"   # APP_KEY üretin
docker compose up -d --build
```

Kurulumda:

- **nginx** — React build'ini sunar, `/api/*` isteklerini PHP-FPM'e iletir
- **app** — Laravel (PHP-FPM), başlangıçta config/route/event cache üretir
- **queue** — bildirim e-postalarını arka planda gönderen kuyruk işçisi
- **mysql** — veritabanı (healthcheck ile beklenir)
- **redis** — önbellek, oturum ve kuyruk

Frontend ve API aynı origin altında sunulduğu için CORS'a gerek kalmaz.

`docker compose` çalıştırmadan önce kök dizinde şu değişkenleri tanımlayın:
`DB_PASSWORD`, `DB_ROOT_PASSWORD`, isteğe bağlı `SITE_URL` ve `HTTP_PORT`.

Migration'lar yalnızca `app` servisinde ve yalnızca `RUN_MIGRATIONS=true` iken çalışır.

### Cloudflare

TLS sonlandırma, CDN, Brotli ve bot koruması Cloudflare tarafında yapılandırılır.
Nginx tarafında HSTS **verilmez**; bu başlık TLS'i sonlandıran katmana aittir.
`/api/*` yolları `Cache-Control: no-store` ile işaretlenir — API yanıtları önbelleğe alınmaz.

---

## 6. Testler

```bash
cd backend  && php artisan test     # 10 test — form akışı, doğrulama, oran sınırı, mail
cd frontend && npm run test         # 20 test — şema, API katmanı, iki adımlı form
```

Kapsanan kritik akış: form doğrulama → adım geçişi → API başarı/hata/oran sınırı →
başarı ekranı → tekrar gönderimin engellenmesi.

---

## 7. Erişilebilirlik ve hareket

- Tüm etkileşimler klavyeyle kullanılabilir; odak halkaları her zaman görünür
- Mobil menü: `aria-modal`, focus trap, `Escape` ile kapanma, odağın tetikleyiciye dönmesi
- Form alanlarında görünür `label`, hata mesajları `role="alert"`, başarı `aria-live` ile duyurulur
- `prefers-reduced-motion` desteklenir: animasyonlar durur, marquee'ler statik listeye döner,
  storytelling bölümü sticky düzen yerine kart akışına geçer
- Three.js sahnesi tamamen dekoratiftir ve erişilebilirlik ağacından gizlenir

**Animasyon kütüphanelerinin görev dağılımı** (aynı iş için tek kütüphane):

| Kütüphane | Sorumluluk |
| --- | --- |
| CSS (`animation-timeline: scroll()`) | Okuma ilerleme çubuğu — destekleyen tarayıcıda hiç JS çalışmaz |
| Framer Motion | Bileşen giriş/çıkışları, hover/tap, sayfa geçişleri, mobil menü, form adımları |
| GSAP + ScrollTrigger | Scroll storytelling, süreç timeline'ının dolması |
| Lenis | Yalnızca yumuşak kaydırma; GSAP ticker'ı ile tek rAF döngüsünde çalışır |
| Three.js (R3F) | Sayfanın tamamının arkasındaki kalıcı 3B katman; ayrı chunk, masaüstünde ve sekme görünürken çalışır |

**Kaydırma tek bir kaynaktan okunur.** `src/lib/scrollState.ts` konum, ilerleme,
hız ve işaretçi konumunu tutar; tek yazıcısı `ScrollSignal` bileşenidir ve o da
kendi rAF döngüsünü açmaz, zaten çalışan GSAP ticker'ına bağlanır. Böylece
sayfada kaydırmayı okuyan tek bir döngü olur ve WebGL sahnesi bu değerleri
React render'ına girmeden `useFrame` içinde okuyabilir.

**Kalıcı 3B katman** (`components/three/SceneBackdrop` → `SiteScene`) sabit
konumda, `z-0` ile durur; `main` ve `footer` `z-10` taşır. Negatif `z-index`
bilinçli olarak kullanılmadı — üst öğelerden herhangi biri yığın bağlamı
oluşturduğunda (tek bir `transform` yeterli) katman zeminin altına gömülüyordu.
Sahnenin üzerinde iki perde katmanı vardır; metin her zaman sahnenin önünde
ve okunabilir kalır.

Ortak hareket bileşenleri: `Parallax` (kaydırmaya bağlı katman kayması),
`Reveal3D` (perspektifli giriş), `ScrubText` (kaydırmayla kelime kelime
aydınlanan metin) ve `useVelocitySkew` (kaydırma hızına tepki veren eğim).
`ScrubText` sönük hâlde bile 0 opaklığa inmez; kaydırma tetikleyicisi hiç
çalışmasa dahi metin okunur kalır.

**Scroll ile açılan içerik asla gizli kalmaz.** `useInViewOnce` üç katmanlı
güvence taşır: (1) öğe bağlandığında zaten ekrandaysa gözlemci beklenmez,
(2) `IntersectionObserver` yoksa animasyon hiç kurulmaz, (3) gözlemci sessiz
kalırsa 1,2 sn sonra zamanlayıcı içeriği açar. Tam sayfa ekran görüntüsü,
yazdırma ve tarayıcı eklentisi senaryolarında içerik `opacity: 0` durumunda
kilitlenmez.

### Bilinen CSS tuzakları (tekrar düşmemek için)

- **`background-clip: text` + dönüşümlü alt öğe:** Gradient'i üst öğeye verip
  alt öğeye `transform` uygularsanız Chromium alanı yeniden boyamaz ve başlık
  görünmez olur. Bu yüzden gradient, metni taşıyan öğenin kendisine uygulanır
  (`AnimatedHeading`); renk sürekliliği `background-position` kaydırılarak korunur.
- **`inline-block` içindeki sondaki boşluk kırpılır.** Kelime kelime canlanan
  başlıklarda boşluk, sarmalayıcının **dışında** render edilmelidir; aksi hâlde
  kelimeler birbirine yapışır ("İşletmenizesadecebir…").
- **`aria-hidden` odağı engellemez.** Marquee kopyaları gibi tekrar eden
  içeriklerde `inert` kullanılır; yoksa klavye kullanıcısı görünmez butonlara takılır.

---

## 8. Performans notları

- Three.js, GSAP, Framer Motion ve Radix ayrı chunk'lara ayrılır
- WebGL sahnesi yalnızca masaüstü + hassas işaretçi + ≥4 çekirdek koşulunda yüklenir
- Sekme arka plandayken sahne kare üretmez (`frameloop="never"`)
- Fontlar yerel olarak paketlenir (Sora + Inter, değişken ağırlık) — harici istek yok
- Animasyonlar `transform` ve `opacity` üzerinden çalışır; scroll dinleyicileri rAF ile sınırlıdır
- Statik varlıklar içerik hash'i taşır ve 1 yıl önbelleklenir; `index.html` önbelleklenmez

---

## 9. SEO

- Sayfaya özel `title`, `description`, canonical, Open Graph ve Twitter Card etiketleri
  (`src/components/common/Seo.tsx` rota değişiminde günceller)
- Yapısal veri: Organization, LocalBusiness, WebSite (statik HTML'de) + FAQPage, Service,
  BreadcrumbList (rota bazlı)
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, 404 ve 500 sayfaları

**Prerender.** Bu bir SPA'dır — `Seo.tsx` başlık/açıklama/OG/JSON-LD'yi
`useEffect` ile JS çalıştıktan sonra yazar. Google JS'i işler, ama WhatsApp/
LinkedIn/Twitter/Slack gibi link önizleme botları JS çalıştırmaz; bu yüzden
alt sayfalar paylaşıldığında hep ana sayfanın önizlemesi görünürdü.

```bash
npm run build       # normal üretim build'i
npm run prerender    # her rotayı gerçek tarayıcıda açıp dist/<rota>/index.html yazar
```

`scripts/prerender.mjs` Playwright ile `vite preview`'i ayağa kaldırır,
`sitemap.xml`'deki her rotayı ziyaret eder, uygulama monte olup `Seo`
etkileri çalıştıktan sonra `document.documentElement.outerHTML`'i doğrudan
`dist/<rota>/index.html` olarak yazar. Nginx zaten
`try_files $uri $uri/ /index.html` kullandığı için (bkz.
`docker/nginx/default.conf`) bu klasör yapısı ek bir sunucu yapılandırması
gerektirmez.

Gerçek ziyaretçiler için risk yoktur: `main.tsx` hâlâ `createRoot` kullanır
(hydration denenmez), yani JS yüklenince mevcut içerik React tarafından
normal şekilde yeniden oluşturulur — tek fark, JS yüklenene kadar ziyaretçinin
artık boş bir kabuk yerine gerçek içerik görmesidir (daha iyi ilk boya).

**Bilinçli olarak `npm run build`'a otomatik bağlanmadı.** Docker imajı
`node:22-alpine` üzerinde kuruluyor (bkz. `docker/nginx/Dockerfile`) ve
Playwright'ın Chromium indirmesi Alpine/musl üzerinde resmi olarak
desteklenmiyor. Docker imajına eklemek istenirse önce `node:22-bookworm-slim`
gibi glibc tabanlı bir imajda ayrıca doğrulanmalı; o adım bilinçli olarak bu
depoya eklenmedi çünkü bu ortamda `docker build` çalıştırıp doğrulamak mümkün
değildi.

---

## 10. Yayına almadan önce yapılacaklar

`frontend/src/constants/site.ts` dosyasındaki yer tutucular gerçek bilgilerle değiştirilmelidir:

- [ ] `phone` / `phoneHref` — şu an geçersiz bir yer tutucu (`+90 555 000 00 00`)
- [ ] `whatsapp` — WhatsApp numarası
- [ ] `email` — kurumsal e-posta adresi
- [ ] `url` — gerçek alan adı (`VITE_SITE_URL` ile de verilebilir)
- [ ] `backend/.env` → `QUOTE_REQUEST_RECIPIENT` ve SMTP bilgileri
- [ ] `frontend/public/sitemap.xml` ve `robots.txt` içindeki alan adı
- [ ] `frontend/index.html` içindeki JSON-LD telefon/e-posta değerleri
- [ ] Yasal metinlerdeki (`Gizlilik`, `Çerez`, `KVKK`) unvan ve adres bilgileri
- [ ] `npm run images` ile OG görselini yeniden üretin (adres değiştiyse)

### Güven unsurlarını güçlendirme (en yüksek etkili adım)

Site şu an "senaryo" seviyesinde konuşuyor. Dönüşümü en çok artıracak şey
teknoloji listesi değil, **gerçek kanıt**. Bunun için altyapı hazır:

`frontend/src/constants/proof.ts` iki boş dizi içerir — `caseStudies` ve
`testimonials`. Doldurduğunuz anda ana sayfadaki "Referanslar" bölümü
kendiliğinden görünür; boşken hiç render edilmez, yani sitede "yakında" yazan
boş bir vitrin oluşmaz.

Her vaka için gereken alanlar: çözülen problem, yapılan iş, **ölçülen sonuç**
(ör. "Lighthouse performans 41 → 96") ve varsa ekran görüntüsü. Yorumlar için
yalnızca yazılı izin alınmış olanları ekleyin.

Sahte istatistik, sahte müşteri yorumu veya uydurma referans bilinçli olarak
kullanılmamıştır — ilk doğrulamada güveni tamamen bitirdiği için.
