import { LegalPage } from './LegalPage'
import { site } from '@/constants/site'

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      metaTitle="Gizlilik Politikası | Ülkü Yazılım"
      description="Ülkü Yazılım web sitesinde toplanan kişisel verilerin hangi amaçlarla işlendiğini, nasıl saklandığını ve haklarınızı açıklayan gizlilik politikası."
      path="/gizlilik-politikasi"
      updatedAt="1 Ocak 2026"
      intro={
        <p>
          Bu politika, {site.url} adresindeki web sitesini ziyaret ettiğinizde veya iletişim /
          teklif formunu doldurduğunuzda paylaştığınız bilgilerin nasıl işlendiğini açıklar.
        </p>
      }
      sections={[
        {
          heading: 'Hangi verileri topluyoruz?',
          paragraphs: [
            'Yalnızca talebinizi değerlendirebilmek için gereken bilgileri topluyoruz. Formu doldurmadığınız sürece sizden kişisel veri istemiyoruz.',
          ],
          bullets: [
            'Teklif formunda paylaştığınız ad soyad, firma adı, e-posta adresi ve telefon numarası',
            'Seçtiğiniz hizmet türü, tahmini bütçe aralığı ve tercih ettiğiniz iletişim yöntemi',
            'Projenizle ilgili yazdığınız açıklama metni',
            'Kötüye kullanımı önlemek amacıyla, talebin gönderildiği IP adresi ve zaman bilgisi',
          ],
        },
        {
          heading: 'Verileri hangi amaçla kullanıyoruz?',
          bullets: [
            'Talebinizi değerlendirmek ve size dönüş yapmak',
            'Proje kapsamı ve teklif hazırlamak',
            'Sözleşme kurulması hâlinde iş ilişkisini yürütmek',
            'Form üzerinden gelen otomatik ve kötü niyetli gönderimleri engellemek',
          ],
          paragraphs: [
            'Verileriniz, açık rızanız olmadan pazarlama amaçlı toplu e-posta gönderimlerinde kullanılmaz.',
          ],
        },
        {
          heading: 'Verileri kimlerle paylaşıyoruz?',
          paragraphs: [
            'Kişisel verilerinizi üçüncü taraflara satmıyor veya reklam amacıyla paylaşmıyoruz. Verileriniz yalnızca hizmetin sunulabilmesi için gereken altyapı sağlayıcılarında (sunucu barındırma ve e-posta gönderim hizmetleri) işlenir.',
            'Yasal bir zorunluluk hâlinde yetkili kamu kurumlarıyla paylaşım yapılabilir.',
          ],
        },
        {
          heading: 'Verileri ne kadar süre saklıyoruz?',
          paragraphs: [
            'Teklif talepleri, talebin değerlendirilmesi ve olası bir iş ilişkisinin kurulması amacıyla makul bir süre saklanır. Saklama amacı ortadan kalktığında kayıtlar silinir veya anonim hâle getirilir.',
          ],
        },
        {
          heading: 'Güvenlik',
          bullets: [
            'Site HTTPS üzerinden sunulur; form verileri şifreli bağlantı ile iletilir.',
            'Form gönderimlerinde doğrulama, oran sınırlama ve spam koruması uygulanır.',
            'Hassas bilgiler uygulama günlüklerine açık biçimde yazılmaz.',
          ],
        },
        {
          heading: 'Haklarınız',
          paragraphs: [
            'Kişisel verilerinize erişme, düzeltilmesini isteme, silinmesini talep etme ve işlemeye itiraz etme haklarına sahipsiniz. Ayrıntılı bilgi için KVKK Aydınlatma Metni sayfamıza bakabilirsiniz.',
          ],
        },
        {
          heading: 'Değişiklikler',
          paragraphs: [
            'Bu politika, hizmetlerimizdeki veya mevzuattaki değişikliklere bağlı olarak güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.',
          ],
        },
      ]}
    />
  )
}
