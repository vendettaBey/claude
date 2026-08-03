import { z } from 'zod'

/** Türkiye ve uluslararası formatları kapsayan gevşek ama anlamlı telefon kontrolü. */
const phonePattern = /^[+()\d\s.-]{10,20}$/

/**
 * Formun tamamının doğrulama şeması.
 * Backend'deki FormRequest kuralları ile birebir aynı hizada tutulmalıdır.
 */
export const quoteRequestSchema = z.object({
  project_description: z
    .string()
    .trim()
    .min(20, 'Projenizi biraz daha anlatın (en az 20 karakter).')
    .max(5000, 'Açıklama 5000 karakteri aşamaz.'),
  full_name: z
    .string()
    .trim()
    .min(2, 'Adınızı ve soyadınızı yazın.')
    .max(120, 'Ad soyad 120 karakteri aşamaz.'),
  company_name: z.string().trim().max(160, 'Firma adı 160 karakteri aşamaz.').optional(),
  email: z
    .string()
    .trim()
    .min(1, 'E-posta adresinizi girin.')
    .email('Geçerli bir e-posta adresi girin.')
    .max(180, 'E-posta adresi 180 karakteri aşamaz.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Telefon numaranızı girin.')
    .regex(phonePattern, 'Geçerli bir telefon numarası girin.'),
  service_type: z.enum(
    [
      'kurumsal-web-sitesi',
      'ozel-web-sitesi',
      'web-uygulamasi',
      'site-yenileme',
      'yonetim-paneli',
      'api-entegrasyon',
      'bakim-destek',
      'seo-danismanligi',
      'kurumsal-kimlik',
      'emin-degilim',
    ],
    { message: 'Bir hizmet seçin.' },
  ),
  budget_range: z.enum(['baslangic', 'orta', 'genis', 'birlikte'], {
    message: 'Bir bütçe aralığı seçin.',
  }),
  preferred_contact_method: z.enum(['telefon', 'whatsapp', 'eposta', 'online-gorusme'], {
    message: 'Tercih ettiğiniz iletişim yöntemini seçin.',
  }),
  /** Bot tuzağı — gerçek kullanıcıda daima boş kalır, CSS ile gizlidir. */
  website: z.string().max(0).optional(),
})

export type QuoteRequestForm = z.infer<typeof quoteRequestSchema>

/** Adım 1'de yalnızca proje açıklaması doğrulanır. */
export const stepOneFields = ['project_description'] as const

/** Adım 2'de kalan tüm alanlar doğrulanır. */
export const stepTwoFields = [
  'full_name',
  'company_name',
  'email',
  'phone',
  'service_type',
  'budget_range',
  'preferred_contact_method',
] as const
