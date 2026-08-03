import axios, { AxiosError, type AxiosInstance } from 'axios'
import type { ApiErrorShape, ApiFailure } from '@/types'

/**
 * Tek bir axios örneği.
 * VITE_API_BASE_URL boşsa istekler aynı origin'e gider; bu, Nginx arkasında
 * frontend ve API'nin aynı alan adında sunulduğu üretim kurulumudur.
 */
export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

const GENERIC_ERROR =
  'Şu anda mesajınızı alamadık. Kısa bir süre sonra tekrar deneyebilir veya bize doğrudan yazabilirsiniz.'

/**
 * Backend hatalarını kullanıcıya gösterilebilir, güvenli bir şekle dönüştürür.
 * Sunucu tarafındaki teknik ayrıntılar (stack trace, sınıf isimleri) hiçbir
 * zaman doğrudan arayüze taşınmaz.
 */
export function normalizeApiError(error: unknown): ApiErrorShape {
  if (!axios.isAxiosError(error)) {
    return { message: GENERIC_ERROR, fieldErrors: {} }
  }

  const axiosError = error as AxiosError<ApiFailure>
  const status = axiosError.response?.status
  const body = axiosError.response?.data

  // Ağ hatası / zaman aşımı
  if (!axiosError.response) {
    return {
      message:
        'İnternet bağlantınızı kontrol edin. Bağlantı kurulamadığı için form gönderilemedi.',
      fieldErrors: {},
    }
  }

  // Doğrulama hataları — alan bazlı mesajlar formda gösterilir.
  if (status === 422 && body?.errors) {
    const fieldErrors: Record<string, string> = {}
    for (const [field, messages] of Object.entries(body.errors)) {
      if (messages?.length) fieldErrors[field] = messages[0]
    }
    return {
      message: body.message || 'Formdaki bazı alanları kontrol edin.',
      fieldErrors,
    }
  }

  // Oran sınırı
  if (status === 429) {
    const header = axiosError.response.headers?.['retry-after']
    const retryAfter = header ? Number(header) : undefined
    return {
      message:
        'Kısa süre içinde çok fazla gönderim yapıldı. Lütfen biraz bekleyip tekrar deneyin.',
      fieldErrors: {},
      ...(Number.isFinite(retryAfter) ? { retryAfter } : {}),
    }
  }

  // Sunucunun döndürdüğü mesaj yalnızca 4xx aralığında güvenilir kabul edilir.
  if (status && status >= 400 && status < 500 && body?.message) {
    return { message: body.message, fieldErrors: {} }
  }

  return { message: GENERIC_ERROR, fieldErrors: {} }
}
