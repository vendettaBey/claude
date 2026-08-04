import type { NavItem } from '@/types'

/**
 * Marka ve iletişim bilgileri.
 *
 * ⚠️ YAYINA ALMADAN ÖNCE: telefon, e-posta, WhatsApp numarası ve alan adını
 * gerçek bilgilerinizle değiştirin. Aşağıdaki numara bilinçli olarak geçersiz
 * bir yer tutucudur (555 000 00 00) — yanlışlıkla üçüncü bir kişiye
 * yönlendirmemek için bu şekilde bırakıldı.
 */
export const site = {
  name: 'Ülkü Yazılım',
  tagline: 'Fikrinizi, çalışan bir dijital ürüne dönüştürüyoruz.',
  taglineAlt: 'İşletmenize özel web siteleri ve web uygulamaları geliştiriyoruz.',
  description:
    'İşletmelere özel kurumsal web siteleri, web uygulamaları ve dijital çözümler geliştiriyoruz.',
  url: import.meta.env.VITE_SITE_URL || 'https://ulkuyazilim.com',
  email: 'info@ulkuyazilim.com',
  phone: '+90 555 000 00 00',
  phoneHref: '+905550000000',
  whatsapp: '905550000000',
  whatsappMessage: 'Merhaba, Ülkü Yazılım ile bir web projesi hakkında görüşmek istiyorum.',
  location: 'İstanbul, Türkiye',
  workingHours: 'Hafta içi 09:00 – 18:00',
} as const

/**
 * Yer tutucu iletişim bilgileri yayına çıkarsa ziyaretçi boş bir numarayı arar.
 * Bunu sessizce bırakmamak için geliştirmede yüksek sesle uyarıyoruz.
 */
if (import.meta.env.DEV) {
  const placeholders = [
    site.phoneHref === '+905550000000' && 'telefon',
    site.whatsapp === '905550000000' && 'WhatsApp',
    site.email === 'info@ulkuyazilim.com' && 'e-posta',
  ].filter(Boolean)

  if (placeholders.length > 0) {
    console.warn(
      `⚠️ Ülkü Yazılım: ${placeholders.join(', ')} bilgisi hâlâ yer tutucu. ` +
        'Yayına almadan önce src/constants/site.ts dosyasını güncelleyin.',
    )
  }
}

export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`

export const mailtoUrl = `mailto:${site.email}?subject=${encodeURIComponent('Proje görüşmesi talebi')}`

export const telUrl = `tel:${site.phoneHref}`

/** Header, mobil menü ve footer aynı kaynaktan beslenir. */
export const navItems: NavItem[] = [
  { label: 'Ana Sayfa', href: '#ana-sayfa' },
  { label: 'Hizmetler', href: '#hizmetler' },
  { label: 'Referans', href: '#referanslar' },
  { label: 'Süreç', href: '#surec' },
  { label: 'Teknolojiler', href: '#teknolojiler' },
  { label: 'İletişim', href: '#iletisim' },
]

/** Header'daki aktif bölüm vurgusunun izlediği id listesi. */
export const sectionIds = [
  'ana-sayfa',
  'hizmetler',
  'neden-biz',
  'referanslar',
  'surec',
  'teknolojiler',
  'sektorler',
  'sss',
  'iletisim',
]

export const footerServiceLinks: NavItem[] = [
  { label: 'Kurumsal Web Sitesi', href: '#hizmetler' },
  { label: 'Özel Web Sitesi', href: '#hizmetler' },
  { label: 'Web Uygulaması', href: '#hizmetler' },
  { label: 'İşletme Yönetim Yazılımı (ERP/CRM)', href: '#hizmetler' },
  { label: 'Site Yenileme', href: '#hizmetler' },
  { label: 'Teknik Destek', href: '#hizmetler' },
]

export const legalLinks: NavItem[] = [
  { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
  { label: 'Çerez Politikası', href: '/cerez-politikasi' },
  { label: 'KVKK Aydınlatma Metni', href: '/kvkk-aydinlatma-metni' },
]
