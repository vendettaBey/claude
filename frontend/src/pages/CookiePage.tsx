import { LegalPage } from './LegalPage'

export default function CookiePage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      metaTitle="Çerez Politikası | Ülkü Yazılım"
      description="Ülkü Yazılım web sitesinde kullanılan çerezler ve tarayıcı depolama alanları hakkında bilgilendirme."
      path="/cerez-politikasi"
      updatedAt="1 Ocak 2026"
      intro={
        <p>
          Bu sayfa, web sitemizde hangi çerezlerin ve tarayıcı depolama alanlarının kullanıldığını
          açıklar. Sitemiz reklam veya profilleme amaçlı üçüncü taraf takip çerezleri kullanmaz.
        </p>
      }
      sections={[
        {
          heading: 'Çerez nedir?',
          paragraphs: [
            'Çerezler, ziyaret ettiğiniz sitelerin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Sitenin sizi hatırlamasını veya tercihlerinizi saklamasını sağlar.',
          ],
        },
        {
          heading: 'Bu sitede neler kullanılıyor?',
          bullets: [
            'Oturum depolaması (sessionStorage): Açılış animasyonunun aynı oturumda tekrar gösterilmemesi için tek bir işaret saklanır. Bu bilgi tarayıcınızdan çıkmaz.',
            'Zorunlu teknik çerezler: Form gönderimlerinde güvenlik ve kötüye kullanım kontrolü için sunucu tarafında geçici oturum bilgisi kullanılabilir.',
            'Barındırma ve güvenlik sağlayıcısı çerezleri: Sitenin önünde çalışan güvenlik/CDN katmanı, saldırı ve bot koruması amacıyla teknik çerezler yerleştirebilir.',
          ],
          paragraphs: [
            'Reklam ağı, sosyal medya piksel takibi veya kullanıcı profilleme amaçlı çerez kullanmıyoruz.',
          ],
        },
        {
          heading: 'Çerezleri nasıl yönetirsiniz?',
          paragraphs: [
            'Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Zorunlu teknik çerezleri engellemeniz hâlinde form gönderimi gibi bazı işlevler beklendiği gibi çalışmayabilir.',
          ],
        },
        {
          heading: 'Analitik kullanımı',
          paragraphs: [
            'İleride ziyaretçi istatistikleri için bir analitik aracı eklenirse, kullanılan araç ve toplanan veri türleri bu sayfada açıkça belirtilecektir.',
          ],
        },
      ]}
    />
  )
}
