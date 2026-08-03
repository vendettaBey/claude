<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Herkese açık uçta yalnızca kaydın kimliği ve durumu döner.
 * Kişisel veriler kasıtlı olarak yanıta dahil edilmez.
 *
 * @mixin QuoteRequest
 */
class QuoteRequestResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'request_id' => $this->id,
            'status' => $this->status->value,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
