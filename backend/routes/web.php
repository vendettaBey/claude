<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\QuoteRequestController as AdminQuoteRequestController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web rotaları
|--------------------------------------------------------------------------
| Bu uygulama yalnızca API katmanıdır; arayüz React tarafında üretilir ve
| Nginx tarafından sunulur. Burada Blade sayfası yayınlanmaz.
|
| Kök adres, servisin ayakta olduğunu doğrulayan küçük bir yanıt döner.
| (Ayrıntılı sağlık kontrolü için Laravel'in /up ucu kullanılır.)
*/

Route::get('/', fn (): JsonResponse => response()->json([
    'service' => 'ulku-yazilim-api',
    'status' => 'ok',
]));

Route::middleware('guest')->group(function (): void {
    Route::get('/yonetim/giris', [AuthController::class, 'create'])->name('login');
    Route::post('/yonetim/giris', [AuthController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('admin.login.store');
});

Route::prefix('yonetim')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function (): void {
        Route::get('/', [AdminQuoteRequestController::class, 'index'])
            ->name('requests.index');
        Route::patch('/talepler/{quoteRequest}', [AdminQuoteRequestController::class, 'update'])
            ->name('requests.update');
        Route::post('/cikis', [AuthController::class, 'destroy'])->name('logout');
    });
