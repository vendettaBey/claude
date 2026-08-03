import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { http } from './http'
import { submitQuoteRequest } from './quoteRequests'
import type { QuoteRequestPayload } from '@/types'

const payload: QuoteRequestPayload = {
  full_name: 'Ayşe Yılmaz',
  email: 'ayse@ornek.test',
  phone: '+90 555 000 00 00',
  service_type: 'web-uygulamasi',
  budget_range: 'orta',
  preferred_contact_method: 'eposta',
  project_description: 'Randevu sistemi ve kurumsal site istiyoruz.',
}

/** Axios'un ürettiğine benzer bir hata nesnesi kurar. */
function axiosErrorWith(status: number, data: unknown, headers: Record<string, string> = {}) {
  const error = new AxiosError('İstek başarısız', 'ERR_BAD_REQUEST')
  error.response = {
    status,
    statusText: '',
    data,
    headers,
    config: { headers: new AxiosHeaders() },
  } as AxiosError['response']
  return error
}

describe('submitQuoteRequest', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('başarılı yanıtta talep numarasını döndürür', async () => {
    vi.spyOn(http, 'post').mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Mesajınız bize ulaştı.',
        data: { request_id: 42 },
      },
    })

    const result = await submitQuoteRequest(payload)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.requestId).toBe(42)
      expect(result.message).toBe('Mesajınız bize ulaştı.')
    }
  })

  it('422 yanıtında alan bazlı hataları çıkarır', async () => {
    vi.spyOn(http, 'post').mockRejectedValueOnce(
      axiosErrorWith(422, {
        success: false,
        message: 'Formdaki bazı alanları kontrol edin.',
        errors: { email: ['Geçerli bir e-posta adresi girin.'] },
      }),
    )

    const result = await submitQuoteRequest(payload)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.fieldErrors.email).toBe('Geçerli bir e-posta adresi girin.')
      expect(result.error.message).toBe('Formdaki bazı alanları kontrol edin.')
    }
  })

  it('429 yanıtında oran sınırı mesajı ve bekleme süresi döner', async () => {
    vi.spyOn(http, 'post').mockRejectedValueOnce(
      axiosErrorWith(429, { success: false, message: 'Too Many Requests' }, { 'retry-after': '60' }),
    )

    const result = await submitQuoteRequest(payload)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toContain('çok fazla gönderim')
      expect(result.error.retryAfter).toBe(60)
    }
  })

  it('500 yanıtında sunucu mesajını kullanıcıya yansıtmaz', async () => {
    vi.spyOn(http, 'post').mockRejectedValueOnce(
      axiosErrorWith(500, {
        success: false,
        message: 'SQLSTATE[HY000]: veritabanı bağlantısı reddedildi',
      }),
    )

    const result = await submitQuoteRequest(payload)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).not.toContain('SQLSTATE')
      expect(result.error.message).toContain('Şu anda mesajınızı alamadık')
    }
  })

  it('ağ hatasında bağlantı uyarısı döner', async () => {
    const networkError = new AxiosError('Network Error', 'ERR_NETWORK')
    vi.spyOn(http, 'post').mockRejectedValueOnce(networkError)

    const result = await submitQuoteRequest(payload)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toContain('İnternet bağlantınızı')
    }
  })
})
