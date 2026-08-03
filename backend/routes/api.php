<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\QuoteRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API rotaları
|--------------------------------------------------------------------------
| Tüm uçlar /api önekiyle yayınlanır ve sürümlenir.
| Teklif formu herkese açıktır; kötüye kullanıma karşı oran sınırı uygulanır.
*/

Route::prefix('v1')->group(function (): void {
    Route::post('quote-requests', [QuoteRequestController::class, 'store'])
        ->middleware('throttle:quote-requests')
        ->name('api.v1.quote-requests.store');
});
