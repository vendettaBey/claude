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
    title: 'İhtiyacı anlayarak başlarız',
    description:
      'Önce neye ihtiyacınız olduğunu, hedef kitlenizi ve işletme süreçlerinizi anlamaya çalışırız.',
    icon: Ear,
    accent: '#3d9bff',
  },
  {
    title: 'Modern teknolojiler kullanırız',
    description:
      'Projeleri güncel, güvenli ve sürdürülebilir teknolojilerle geliştiririz. Teknoloji seçimlerini yalnızca popüler oldukları için değil, projenin gerçek ihtiyaçlarına göre yaparız.',
    icon: Cpu,
    accent: '#a78bfa',
  },
  {
    title: 'Performansı önemseriz',
    description:
      'Hızlı açılan, mobil cihazlarda iyi çalışan ve kullanıcıyı bekletmeyen deneyimler oluştururuz.',
    icon: Zap,
    accent: '#22d3ee',
  },
  {
    title: 'Geliştirilebilir sistemler kurarız',
    description:
      'Projenin ileride yeni özelliklerle büyüyebilmesini sağlayan düzenli ve ölçeklenebilir altyapılar kurarız.',
    icon: Layers,
    accent: '#34d399',
  },
  {
    title: 'Süreci şeffaf yürütürüz',
    description:
      'Projenin hangi aşamada olduğunu açık biçimde paylaşır, teknik konuları anlaşılır bir dille anlatırız.',
    icon: Eye,
    accent: '#f472b6',
  },
  {
    title: 'Yayından sonra da yanınızdayız',
    description:
      'Proje teslim edildikten sonra bakım, geliştirme ve teknik destek hizmetleri sunarız.',
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
      'Projenin kapsamına göre değişir. Standart bir kurumsal web sitesi ile özel fonksiyonlara sahip bir web uygulamasının geliştirme süreleri aynı değildir. İhtiyaç analizi sonrasında tahmini süre ve proje planı paylaşılır.',
  },
  {
    question: 'Web sitesi fiyatları nasıl belirlenir?',
    answer:
      'Fiyat; sayfa sayısı, özel tasarım ihtiyacı, yönetim paneli, entegrasyonlar, çoklu dil desteği ve özel fonksiyonlara göre belirlenir.',
  },
  {
    question: 'Hazır tema mı kullanıyorsunuz?',
    answer:
      'Projenin bütçesine ve ihtiyacına göre farklı yöntemler değerlendirilebilir. Ancak tasarım ve teknik altyapı markanın ihtiyaçlarına uygun hale getirilir. Özel projelerde tamamen ihtiyaca göre geliştirilen arayüzler hazırlanır.',
  },
  {
    question: 'Web sitemi kendim yönetebilir miyim?',
    answer:
      'İhtiyaç halinde içerikleri, görselleri, hizmetleri veya diğer alanları yönetebileceğiniz kullanıcı dostu bir yönetim paneli geliştirilebilir.',
  },
  {
    question: 'Mobil uyumlu olacak mı?',
    answer: 'Tüm projeler telefon, tablet ve masaüstü ekranlara uyumlu olacak şekilde hazırlanır.',
  },
  {
    question: 'SEO çalışması yapılıyor mu?',
    answer:
      'Projelerde arama motorlarının siteyi doğru şekilde okuyabilmesi için temel teknik SEO altyapısı hazırlanır. Kapsamlı içerik ve sıralama çalışmaları ayrıca planlanabilir.',
  },
  {
    question: 'Web sitesi yayınlandıktan sonra destek veriyor musunuz?',
    answer:
      'Evet. Bakım, teknik destek, güvenlik güncellemeleri ve yeni özellik geliştirme hizmetleri sunulabilir.',
  },
  {
    question: 'Mevcut web sitemi yenileyebilir misiniz?',
    answer:
      'Evet. Mevcut sitenin tasarımı, hızı, mobil uyumluluğu ve teknik altyapısı incelenerek yenileme planı oluşturulabilir.',
  },
  {
    question: 'Proje tesliminden sonra kaynak kod ve tasarım bana mı ait olur?',
    answer:
      'Evet. Proje teslim edildiğinde kaynak kod, tasarım dosyaları ve tüm erişim bilgileri size teslim edilir. Bir başka ekiple devam etmek istemeniz hâlinde bağımlı kalmazsınız.',
  },
  {
    question: 'Alan adı ve barındırma (hosting) hizmetini siz mi sağlıyorsunuz?',
    answer:
      'Alan adı ve barındırma hesapları size ait olacak şekilde açılır; kurulumu ve teknik yönetimini biz üstleniriz. İsterseniz mevcut hesaplarınız üzerinden, isterseniz süreç içinde birlikte açacağımız yeni hesaplarla ilerleriz.',
  },
  {
    question: 'İstanbul dışındayım, süreç uzaktan nasıl işliyor?',
    answer:
      'Görüşmeler, tasarım onayları ve proje takibi tamamen uzaktan yürütülebilir. Video görüşme, e-posta ve yazılı paylaşımlarla süreç aynı şeffaflıkla ilerler; fiziksel bir toplantı şart değildir.',
  },
  {
    question: 'Proje sürerken ek bir özellik istersem ne olur?',
    answer:
      'Kapsamı belirgin biçimde büyütmeyen küçük değişiklik talepleri genellikle sürecin doğal bir parçasıdır. Kapsamı gerçekten büyüten talepler için önce süre ve maliyet etkisini konuşur, birlikte karar veririz — sürpriz fatura olmaz.',
  },
]
