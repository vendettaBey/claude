<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\QuoteRequestStatus;
use App\Mail\QuoteRequestReceived;
use App\Models\QuoteRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Teklif talebinin iş mantığı.
 *
 * Controller yalnızca isteği alır ve yanıtı döner; kayıt, bildirim ve
 * loglama sorumluluğu burada toplanır.
 */
class QuoteRequestService
{
    /**
     * @param  array<string, mixed>  $data  Doğrulanmış form verisi
     */
    public function create(array $data, ?string $ipAddress): QuoteRequest
    {
        $quoteRequest = DB::transaction(function () use ($data, $ipAddress): QuoteRequest {
            return QuoteRequest::create([
                'full_name' => $data['full_name'],
                'company_name' => $data['company_name'] ?? null,
                'email' => $data['email'],
                'phone' => $data['phone'],
                'service_type' => $data['service_type'],
                'budget_range' => $data['budget_range'],
                'preferred_contact_method' => $data['preferred_contact_method'],
                'project_description' => $data['project_description'],
                'status' => QuoteRequestStatus::New,
                'ip_address' => $ipAddress,
            ]);
        });

        $this->notify($quoteRequest);

        // Kişisel veri loglanmaz — yalnızca kaydın kimliği tutulur.
        Log::info('Yeni teklif talebi alındı.', [
            'quote_request_id' => $quoteRequest->id,
            'service_type' => $quoteRequest->service_type->value,
        ]);

        return $quoteRequest;
    }

    /**
     * Bildirim gönderimi, talebin kaydedilmesini engellememelidir:
     * mail sunucusu geçici olarak erişilemezse kullanıcı yine de
     * "talebiniz alındı" yanıtını alır, hata sessizce loglanır.
     */
    private function notify(QuoteRequest $quoteRequest): void
    {
        $recipient = config('mail.quote_requests.recipient');

        if (! is_string($recipient) || $recipient === '') {
            Log::warning('Teklif bildirimi gönderilemedi: alıcı adresi tanımlı değil.', [
                'quote_request_id' => $quoteRequest->id,
            ]);

            return;
        }

        try {
            Mail::to($recipient)->send(new QuoteRequestReceived($quoteRequest));
        } catch (Throwable $exception) {
            Log::error('Teklif bildirimi gönderilemedi.', [
                'quote_request_id' => $quoteRequest->id,
                'exception' => $exception->getMessage(),
            ]);
        }
    }
}
