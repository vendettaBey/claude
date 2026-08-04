import {
  Cpu,
  Ear,
  Eye,
  Gauge,
  Headset,
  Layers,
  LifeBuoy,
  Network,
  Puzzle,
  Search,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { FaqItem, ValueProp } from '@/types'

/** Hero altındaki güven şeridi. */
export const trustItems: { label: string; icon: LucideIcon }[] = [
  { label: 'Mobil uyumlu tasarım', icon: Smartphone },
  { label: 'Güçlü performans', icon: Gauge },
  { label: 'Güvenli altyapı', icon: ShieldCheck },
  { label: 'SEO uyumlu yapı', icon: Search },
  { label: 'Kolay yönetim', icon: SlidersHorizontal },
  { label: 'İhtiyaca özel geliştirme', icon: Puzzle },
  { label: 'Satış sonrası teknik destek', icon: Headset },
  { label: 'Ölçeklenebilir mimari', icon: Network },
]

export const valueProps: ValueProp[] = [
  {
    title: 'Önce sorunu netleştiririz',
    description: 'Hedefinizi, kullanıcıyı ve bugün zaman kaybettiren adımları birlikte çıkarırız.',
    icon: Ear,
    accent: '#3d9bff',
  },
  {
    title: 'Aracı ihtiyaca göre seçeriz',
    description:
      'Teknolojiyi popülerliğine değil; hız, güvenlik ve bakım maliyetine göre belirleriz.',
    icon: Cpu,
    accent: '#a78bfa',
  },
  {
    title: 'Kullanıcıyı bekletmeyiz',
    description:
      'Telefon, tablet ve masaüstünde hızlı açılan, akıcı çalışan ekranlar geliştiririz.',
    icon: Zap,
    accent: '#22d3ee',
  },
  {
    title: 'Büyümeye hazır kurarız',
    description:
      'Yeni özellikler eklenirken baştan yazılmak zorunda kalmayan bir altyapı bırakırız.',
    icon: Layers,
    accent: '#34d399',
  },
  {
    title: 'Sürpriz bırakmayız',
    description: 'Aşamaları, kararları ve kapsam değişikliklerini anlaşılır biçimde paylaşırız.',
    icon: Eye,
    accent: '#f472b6',
  },
  {
    title: 'Yayından sonra devam ederiz',
    description:
      'Bakım, teknik destek ve yeni özelliklerde aynı sistem bilgisiyle yanınızda kalırız.',
    icon: LifeBuoy,
    accent: '#fbbf24',
  },
]

export const industries: string[] = [
  'Yeni kurulan işletmeler',
  'KOBİ’ler',
  'Kurumsal firmalar',
  'Hizmet sektörü işletmeleri',
  'Üretim firmaları',
  'Sağlık kuruluşları',
  'Eğitim kurumları',
  'Danışmanlık şirketleri',
  'Emlak ve inşaat firmaları',
  'Turizm işletmeleri',
  'Dijital ürün fikri olan girişimler',
  'Mevcut sistemini yenilemek isteyen şirketler',
]

export const faqItems: FaqItem[] = [
  {
    question: 'Bir web sitesi ne kadar sürede hazırlanır?',
    answer:
      'Süre projenin kapsamına göre belirlenir. İhtiyaç analizinden sonra aşamaları ve tahmini teslim tarihini net bir planla paylaşırız.',
  },
  {
    question: 'Web sitesi fiyatları nasıl belirlenir?',
    answer:
      'Fiyatı sayfa sayısı, özel tasarım, yönetim paneli, entegrasyonlar ve ihtiyaç duyulan işlevler belirler.',
  },
  {
    question: 'Hazır tema mı kullanıyorsunuz?',
    answer:
      'Projenin bütçesi ve hedefi belirleyicidir; markayı hazır bir temaya uydurmayız. Özel ihtiyaçlarda arayüzü ve işlevleri sıfırdan tasarlarız.',
  },
  {
    question: 'Web sitemi kendim yönetebilir miyim?',
    answer:
      'Evet. İçerik, görsel ve hizmetleri kod bilgisi olmadan güncelleyebileceğiniz bir yönetim paneli geliştirebiliriz.',
  },
  {
    question: 'Mobil uyumlu olacak mı?',
    answer: 'Evet. Tüm projeleri telefon, tablet ve masaüstü ekranlarda test ederek teslim ederiz.',
  },
  {
    question: 'SEO çalışması yapılıyor mu?',
    answer:
      'Evet. Temel teknik SEO altyapısını kurarız; içerik ve sıralama çalışmasını ihtiyaç hâlinde ayrıca planlarız.',
  },
  {
    question: 'Web sitesi yayınlandıktan sonra destek veriyor musunuz?',
    answer:
      'Evet. Bakım, güvenlik güncellemeleri, hata giderme ve yeni özellik geliştirme desteği sunarız.',
  },
  {
    question: 'Mevcut web sitemi yenileyebilir misiniz?',
    answer:
      'Evet. Tasarım, hız, mobil uyumluluk ve teknik altyapıyı inceleyip öncelikli bir yenileme planı çıkarırız.',
  },
  {
    question: 'Proje tesliminden sonra kaynak kod ve tasarım bana mı ait olur?',
    answer:
      'Evet. Kaynak kodu, tasarım dosyalarını ve erişim bilgilerini size teslim ederiz; bize bağımlı kalmazsınız.',
  },
  {
    question: 'Alan adı ve barındırma (hosting) hizmetini siz mi sağlıyorsunuz?',
    answer:
      'Hesaplar sizin adınıza açılır; kurulumunu ve teknik yönetimini biz yaparız. Mevcut hesaplarınız varsa onları da kullanabiliriz.',
  },
  {
    question: 'İstanbul dışındayım, süreç uzaktan nasıl işliyor?',
    answer:
      'Süreci video görüşmeleri ve yazılı onaylarla tamamen uzaktan yürütebiliriz. Fiziksel toplantı gerekmez.',
  },
  {
    question: 'Proje sürerken ek bir özellik istersem ne olur?',
    answer:
      'Önce talebin süre ve maliyet etkisini paylaşırız. Onayınızdan sonra kapsama ekleriz; sürpriz fatura çıkarmazız.',
  },
]
