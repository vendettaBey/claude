import { http, normalizeApiError } from './http'
import type {
  ApiSuccess,
  ApiErrorShape,
  QuoteRequestPayload,
  QuoteRequestResult,
} from '@/types'

export const QUOTE_REQUEST_ENDPOINT = '/api/v1/quote-requests'

export type SubmitResult =
  | { ok: true; message: string; requestId: number }
  | { ok: false; error: ApiErrorShape }

/**
 * Teklif talebini Laravel API'sine gönderir.
 * Hata fırlatmaz — çağıran taraf tek bir sonuç nesnesi üzerinden durumu yönetir.
 */
export async function submitQuoteRequest(
  payload: QuoteRequestPayload,
  signal?: AbortSignal,
): Promise<SubmitResult> {
  try {
    const response = await http.post<ApiSuccess<QuoteRequestResult>>(
      QUOTE_REQUEST_ENDPOINT,
      payload,
      { signal },
    )

    return {
      ok: true,
      message: response.data.message,
      requestId: response.data.data.request_id,
    }
  } catch (error) {
    return { ok: false, error: normalizeApiError(error) }
  }
}
