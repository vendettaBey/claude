import type { SelectOption } from '@/types'

export const serviceOptions: SelectOption[] = [
  {
    value: 'kurumsal-web-sitesi',
    label: 'Kurumsal web sitesi',
    hint: 'Kurumsal sitelerde sayfa yapısını, içerik yönetimini ve iletişim akışını birlikte planlıyoruz.',
  },
  {
    value: 'ozel-web-sitesi',
    label: 'Özel web sitesi',
    hint: 'Özel projelerde önce hangi fonksiyonların gerçekten gerekli olduğunu netleştiriyoruz.',
  },
  {
    value: 'web-uygulamasi',
    label: 'Web uygulaması',
    hint: 'Uygulama projelerinde mevcut iş akışınızı dinleyip hangi adımların dijitalleşeceğini belirliyoruz.',
  },
  {
    value: 'site-yenileme',
    label: 'Mevcut siteyi yenileme',
    hint: 'Yenileme projelerinde mevcut sitenin hızını, mobil uyumunu ve SEO durumunu inceleyerek başlıyoruz.',
  },
  {
    value: 'yonetim-paneli',
    label: 'Yönetim paneli',
    hint: 'Panel projelerinde hangi verinin kim tarafından yönetileceğini baştan tanımlıyoruz.',
  },
  {
    value: 'api-entegrasyon',
    label: 'API ve entegrasyon',
    hint: 'Entegrasyonlarda bağlanacak servislerin dokümantasyonunu ve veri akışını birlikte gözden geçiriyoruz.',
  },
  {
    value: 'erp-isletme-yonetimi',
    label: 'İşletme yönetim yazılımı (ERP/CRM)',
    hint: 'CRM, stok, muhasebe, İK, üretim gibi hangi modüllere ihtiyacınız olduğunu birlikte netleştiriyoruz.',
  },
  {
    value: 'bakim-destek',
    label: 'Bakım ve teknik destek',
    hint: 'Bakım hizmetinde mevcut projenin teknik durumunu inceleyip kapsamı netleştiriyoruz.',
  },
  {
    value: 'seo-danismanligi',
    label: 'SEO danışmanlığı',
    hint: 'SEO çalışmasında önce sitenizin teknik ve içerik durumunu inceleyip önceliklendirilmiş bir plan çıkarıyoruz.',
  },
  {
    value: 'kurumsal-kimlik',
    label: 'Kurumsal kimlik ve logo tasarımı',
    hint: 'Kimlik çalışmasında markanızı, hedef kitlenizi ve kullanım alanlarını konuşarak başlıyoruz.',
  },
  {
    value: 'emin-degilim',
    label: 'Henüz emin değilim',
    hint: 'Sorun değil. İhtiyacınızı birlikte konuşup size uygun seçenekleri anlatabiliriz.',
  },
]

export const budgetOptions: SelectOption[] = [
  { value: 'baslangic', label: 'Başlangıç seviyesinde bir proje' },
  { value: 'orta', label: 'Orta kapsamlı proje' },
  { value: 'genis', label: 'Geniş kapsamlı özel yazılım' },
  { value: 'birlikte', label: 'Bütçeyi birlikte belirlemek istiyorum' },
]

export const contactMethodOptions: SelectOption[] = [
  { value: 'telefon', label: 'Telefon' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'eposta', label: 'E-posta' },
  { value: 'online-gorusme', label: 'Online görüşme' },
]
