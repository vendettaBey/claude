/**
 * Gerçek güven unsurları.
 *
 * Bu dosya bilinçli olarak BOŞ başlar. Uydurma müşteri yorumu, sahte istatistik
 * veya hayali referans eklenmez — bunlar kısa vadede satış gibi görünüp ilk
 * doğrulamada güveni tamamen bitirir.
 *
 * Elinizde gerçek veri oluştukça buraya ekleyin; ilgili bölümler dizi dolduğu
 * anda kendiliğinden görünür hâle gelir, boşken hiç render edilmez.
 */

export type CaseStudy = {
  id: string
  /** Müşterinin yayımlanmasına izin verdiği isim. İzin yoksa sektör yazın. */
  client: string
  sector: string
  /** Çözülen somut problem. */
  challenge: string
  /** Yapılan iş. */
  work: string
  /**
   * Ölçülebilir sonuç. Yalnızca gerçekten ölçtüğünüz değerleri yazın
   * (ör. "Lighthouse performans 41 → 96", "form gönderimi 3 kat arttı").
   */
  outcome: string
  /** public/ altına konan ekran görüntüsü yolu. */
  image?: string
  imageAlt?: string
  stack: string[]
}

export type Testimonial = {
  id: string
  quote: string
  author: string
  role: string
  company: string
}

/** Gerçek proje vakaları — yayımlanmaya hazır olanları ekleyin. */
export const caseStudies: CaseStudy[] = []

/** Müşteri yorumları — yalnızca yazılı izin alınmış olanlar. */
export const testimonials: Testimonial[] = []

export const hasCaseStudies = caseStudies.length > 0
export const hasTestimonials = testimonials.length > 0
