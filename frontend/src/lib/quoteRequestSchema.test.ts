import { describe, expect, it } from 'vitest'
import { quoteRequestSchema } from './quoteRequestSchema'

const valid = {
  project_description:
    'Hastalarımızın internet üzerinden randevu alabileceği bir sistem istiyoruz.',
  full_name: 'Ayşe Yılmaz',
  company_name: 'Örnek Klinik',
  email: 'ayse@ornek-klinik.test',
  phone: '+90 555 000 00 00',
  service_type: 'web-uygulamasi',
  budget_range: 'orta',
  preferred_contact_method: 'eposta',
}

describe('quoteRequestSchema', () => {
  it('geçerli veriyi kabul eder', () => {
    expect(quoteRequestSchema.safeParse(valid).success).toBe(true)
  })

  it('firma adı isteğe bağlıdır', () => {
    const { company_name: _omitted, ...withoutCompany } = valid
    expect(quoteRequestSchema.safeParse(withoutCompany).success).toBe(true)
  })

  it('20 karakterden kısa açıklamayı reddeder', () => {
    const result = quoteRequestSchema.safeParse({ ...valid, project_description: 'kısa' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Projenizi biraz daha anlatın (en az 20 karakter).',
      )
    }
  })

  it('geçersiz e-postayı reddeder', () => {
    const result = quoteRequestSchema.safeParse({ ...valid, email: 'gecersiz' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'email')).toBe(true)
    }
  })

  it('harf içeren telefon numarasını reddeder', () => {
    const result = quoteRequestSchema.safeParse({ ...valid, phone: 'telefonum yok' })
    expect(result.success).toBe(false)
  })

  it('parantezli ve boşluklu telefon biçimini kabul eder', () => {
    expect(
      quoteRequestSchema.safeParse({ ...valid, phone: '+90 (555) 123 45 67' }).success,
    ).toBe(true)
  })

  it('tanımsız hizmet türünü reddeder', () => {
    const result = quoteRequestSchema.safeParse({ ...valid, service_type: 'olmayan' })
    expect(result.success).toBe(false)
  })

  it('honeypot alanı doluysa reddeder', () => {
    const result = quoteRequestSchema.safeParse({ ...valid, website: 'https://spam.example' })
    expect(result.success).toBe(false)
  })
})
