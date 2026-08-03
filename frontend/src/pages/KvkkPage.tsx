import { LegalPage } from './LegalPage'
import { site } from '@/constants/site'

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      metaTitle="KVKK Aydınlatma Metni | Ülkü Yazılım"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Ülkü Yazılım tarafından yapılan kişisel veri işleme faaliyetlerine ilişkin aydınlatma metni."
      path="/kvkk-aydinlatma-metni"
      updatedAt="1 Ocak 2026"
      intro={
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, veri sorumlusu sıfatıyla
          Ülkü Yazılım tarafından kişisel verilerinizin nasıl işlendiğine ilişkin olarak sizi
          bilgilendirmek isteriz.
        </p>
      }
      sections={[
        {
          heading: 'Veri sorumlusu',
          paragraphs: [
            `Veri sorumlusu: Ülkü Yazılım — ${site.location}. İletişim: ${site.email}`,
          ],
        },
        {
          heading: 'İşlenen kişisel veriler',
          bullets: [
            'Kimlik bilgisi: ad ve soyad',
            'İletişim bilgisi: e-posta adresi, telefon numarası',
            'Müşteri işlem bilgisi: firma adı, talep edilen hizmet, bütçe aralığı, proje açıklaması',
            'İşlem güvenliği bilgisi: talebin gönderildiği IP adresi ve işlem zamanı',
          ],
        },
        {
          heading: 'İşleme amaçları',
          bullets: [
            'Talebinizin alınması, değerlendirilmesi ve yanıtlanması',
            'Teklif hazırlanması ve sözleşme süreçlerinin yürütülmesi',
            'Hizmetlerimizin sunulması ve müşteri ilişkilerinin yönetilmesi',
            'Bilgi güvenliğinin sağlanması ve kötüye kullanımın önlenmesi',
          ],
        },
        {
          heading: 'Hukuki sebep',
          paragraphs: [
            'Kişisel verileriniz; sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, veri sorumlusunun meşru menfaati ve hukuki yükümlülüklerin yerine getirilmesi hukuki sebeplerine dayanarak, KVKK m.5 kapsamında işlenmektedir.',
          ],
        },
        {
          heading: 'Toplama yöntemi',
          paragraphs: [
            'Kişisel verileriniz; web sitemizdeki teklif/iletişim formu, e-posta, telefon ve mesajlaşma uygulamaları aracılığıyla elektronik ortamda toplanmaktadır.',
          ],
        },
        {
          heading: 'Aktarım',
          paragraphs: [
            'Kişisel verileriniz; sunucu barındırma, e-posta gönderimi ve güvenlik hizmeti aldığımız tedarikçilerle sınırlı olarak, hizmetin sunulabilmesi amacıyla paylaşılabilir. Yasal yükümlülük hâlinde yetkili kamu kurum ve kuruluşlarına aktarım yapılabilir.',
          ],
        },
        {
          heading: 'KVKK m.11 kapsamındaki haklarınız',
          bullets: [
            'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
            'İşlenmişse buna ilişkin bilgi talep etme',
            'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
            'Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme',
            'Şartların oluşması hâlinde silinmesini veya yok edilmesini isteme',
            'Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme',
            'Otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
            'Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
          ],
        },
        {
          heading: 'Başvuru',
          paragraphs: [
            `Yukarıdaki haklarınıza ilişkin taleplerinizi ${site.email} adresine iletebilirsiniz. Talebiniz, niteliğine göre en kısa sürede ve en geç otuz gün içinde sonuçlandırılır.`,
          ],
        },
      ]}
    />
  )
}
