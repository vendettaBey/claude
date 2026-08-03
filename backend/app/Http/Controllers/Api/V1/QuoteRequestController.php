<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequestRequest;
use App\Http\Resources\QuoteRequestResource;
use App\Services\QuoteRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Teklif taleplerini karşılayan herkese açık uç.
 * İş mantığı QuoteRequestService içindedir; burada yalnızca istek/yanıt vardır.
 */
class QuoteRequestController extends Controller
{
    public function __construct(private readonly QuoteRequestService $service) {}

    public function store(StoreQuoteRequestRequest $request): JsonResponse
    {
        try {
            $quoteRequest = $this->service->create(
                $request->validated(),
                $request->ip(),
            );
        } catch (Throwable $exception) {
            // Kullanıcıya teknik ayrıntı sızdırılmaz; ayrıntı yalnızca loga gider.
            Log::error('Teklif talebi kaydedilemedi.', [
                'exception' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Talebiniz şu anda kaydedilemedi. Lütfen kısa bir süre sonra tekrar deneyin.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Mesajınız bize ulaştı. Projenizi inceleyip sizinle iletişime geçeceğiz.',
            'data' => new QuoteRequestResource($quoteRequest),
        ], 201);
    }
}
