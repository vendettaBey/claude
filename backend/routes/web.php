<?php

declare(strict_types=1);

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
