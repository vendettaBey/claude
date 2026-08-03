import type { ProjectScenario } from '@/types'

/**
 * Gerçek müşteri projeleri yayımlanana kadar burada örnek çözüm senaryoları
 * gösterilir. Uydurma marka ismi, sahte referans veya sahte istatistik yoktur.
 */
export const projectScenarios: ProjectScenario[] = [
  {
    id: 'kurumsal-firma-sitesi',
    title: 'Kurumsal Firma Web Sitesi',
    type: 'Kurumsal Web Sitesi',
    problem:
      'Firmanın dijitalde güncel bir karşılığı yok; potansiyel müşteriler hizmetleri ve referansları göremiyor.',
    scenario:
      'Teklif almak isteyen bir müşteri hizmet sayfasından ilgili çözümü inceliyor, referansları görüyor ve tek formla talebini iletiyor.',
    summary:
      'Profesyonel hizmetlerini, ekibini, projelerini ve iletişim kanallarını etkili biçimde sunmak isteyen şirketler için.',
    features: [
      'Hizmet ve çözüm sayfaları',
      'Ekip ve kurumsal kimlik bölümü',
      'Referans ve proje vitrini',
      'Blog ve duyuru yönetimi',
      'Teklif formu ve iletişim kanalları',
      'Çok dilli içerik desteği',
    ],
    stack: ['Laravel', 'React', 'TypeScript', 'MySQL'],
    visual: 'corporate',
    accent: '#3d9bff',
  },
  {
    id: 'randevu-rezervasyon',
    title: 'Randevu ve Rezervasyon Sistemi',
    type: 'Web Uygulaması',
    problem:
      'Randevular telefon ve mesajla takip ediliyor; çakışmalar, unutulan kayıtlar ve boş saatler oluşuyor.',
    scenario:
      'Müşteri hizmeti ve personeli seçiyor, uygun saatleri takvimde görüyor, randevusunu oluşturuyor; hatırlatma otomatik gidiyor.',
    summary:
      'Müşterilerin internet üzerinden tarih ve hizmet seçerek rezervasyon oluşturabildiği yönetilebilir sistem.',
    features: [
      'Hizmet ve personel bazlı takvim',
      'Uygunluk ve kapasite kuralları',
      'Otomatik e-posta / SMS hatırlatma',
      'İptal ve erteleme akışı',
      'Yönetim paneli ve günlük ajanda',
      'Doluluk raporları',
    ],
    stack: ['Laravel', 'React', 'MySQL', 'Redis'],
    visual: 'booking',
    accent: '#22d3ee',
  },
  {
    id: 'musteri-portali',
    title: 'Müşteri Yönetim Portalı',
    type: 'Web Uygulaması',
    problem:
      'Müşteri talepleri e-posta ve mesajlaşma uygulamaları arasında dağılıyor; hangi işin hangi aşamada olduğu takip edilemiyor.',
    scenario:
      'Müşteri kendi paneline giriyor, açık taleplerini ve dosyalarını görüyor, süreç ilerledikçe bildirim alıyor.',
    summary:
      'Müşterilerin taleplerini, dosyalarını, ödemelerini ve süreçlerini takip edebildiği özel panel.',
    features: [
      'Rol bazlı kullanıcı yetkilendirme',
      'Talep ve destek kaydı takibi',
      'Dosya ve belge paylaşımı',
      'Ödeme ve bakiye görünümü',
      'Bildirim merkezi',
      'Süreç geçmişi ve kayıt izleme',
    ],
    stack: ['Laravel', 'REST API', 'React', 'MySQL'],
    visual: 'portal',
    accent: '#a78bfa',
  },
  {
    id: 'teklif-siparis',
    title: 'Teklif ve Sipariş Yönetimi',
    type: 'Web Uygulaması',
    problem:
      'Teklifler tablolama dosyalarında hazırlanıyor; onay süreci, revizyonlar ve sipariş durumu tek yerden görülemiyor.',
    scenario:
      'Satış ekibi şablondan teklif üretiyor, müşteri bağlantı üzerinden onaylıyor, teklif otomatik olarak siparişe dönüşüyor.',
    summary:
      'Teklif hazırlama, müşteri onayı, sipariş süreci ve raporlama işlemlerinin tek sistem üzerinden yönetilmesi.',
    features: [
      'Ürün / hizmet ve fiyat listesi yönetimi',
      'Teklif şablonları ve revizyon geçmişi',
      'Online onay akışı',
      'Teklif → sipariş dönüşümü',
      'PDF çıktı ve otomatik e-posta',
      'Dönüşüm ve ciro raporları',
    ],
    stack: ['Laravel', 'React', 'MySQL', 'Queue'],
    visual: 'quotes',
    accent: '#34d399',
  },
  {
    id: 'cok-subeli-sistem',
    title: 'Çok Şubeli İşletme Sistemi',
    type: 'Web Uygulaması',
    problem:
      'Her şube kendi kayıtlarını ayrı tutuyor; merkez, şubeler arasında karşılaştırılabilir bir tablo göremiyor.',
    scenario:
      'Şube yöneticisi yalnızca kendi verisini görüyor, merkez ise tüm şubeleri tek ekranda karşılaştırıyor.',
    summary:
      'Şubelerin, çalışanların, hizmetlerin ve raporların merkezi olarak yönetilebildiği web uygulaması.',
    features: [
      'Şube bazlı yetki ve veri ayrımı',
      'Merkezi hizmet ve fiyat yönetimi',
      'Personel ve vardiya takibi',
      'Şube karşılaştırma raporları',
      'Stok / kaynak görünürlüğü',
      'Merkezden duyuru ve bildirim',
    ],
    stack: ['Laravel', 'React', 'MySQL', 'Docker'],
    visual: 'multibranch',
    accent: '#f472b6',
  },
  {
    id: 'uyelik-platformu',
    title: 'Üyelik Tabanlı Platform',
    type: 'Web Platformu',
    problem:
      'İçerik veya hizmete erişim kontrol edilemiyor; abonelik, yenileme ve ödeme takibi elle yapılıyor.',
    scenario:
      'Kullanıcı kaydoluyor, paketini seçiyor, ödemesi alınınca içeriğe erişimi otomatik açılıyor; süre bitince kapanıyor.',
    summary:
      'Kullanıcı kaydı, abonelik, üyelik paketleri, içerik erişimi ve ödeme özellikleri içeren platform.',
    features: [
      'Kayıt, giriş ve e-posta doğrulama',
      'Üyelik paketleri ve süre yönetimi',
      'Ödeme altyapısı entegrasyonu',
      'İçerik erişim kuralları',
      'Otomatik yenileme ve iptal',
      'Kullanım ve gelir raporları',
    ],
    stack: ['Laravel', 'React', 'MySQL', 'Redis'],
    visual: 'membership',
    accent: '#fbbf24',
  },
  {
    id: 'e-ticaret-sitesi',
    title: 'E-Ticaret Sitesi',
    type: 'E-Ticaret',
    problem:
      'Ürünler yalnızca sosyal medya ve WhatsApp üzerinden satılıyor; stok, sipariş ve ödeme takibi dağınık ve hataya açık.',
    scenario:
      'Müşteri ürünü inceliyor, sepete ekliyor ve online ödeme yapıyor; sipariş otomatik olarak yönetim paneline düşüyor ve kargo süreci başlıyor.',
    summary:
      'Ürünlerini online satmak, stok ve siparişlerini tek yerden yönetmek isteyen işletmeler için uçtan uca e-ticaret altyapısı.',
    features: [
      'Ürün ve kategori yönetimi',
      'Sepet ve online ödeme entegrasyonu',
      'Stok takibi ve varyant yönetimi',
      'Kargo ve teslimat entegrasyonu',
      'Kampanya ve indirim kodu yönetimi',
      'Sipariş ve müşteri yönetim paneli',
    ],
    stack: ['Laravel', 'React', 'MySQL', 'Redis'],
    visual: 'ecommerce',
    accent: '#fb923c',
  },
]
