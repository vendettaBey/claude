<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| CORS yapılandırması
|--------------------------------------------------------------------------
|
| Frontend ve API aynı alan adında sunulduğunda (Nginx arkasında önerilen
| kurulum) CORS'a hiç ihtiyaç duyulmaz. Ayrı alan adı kullanıyorsanız
| FRONTEND_URL değişkenine tam origin'i yazın — joker (*) bırakmayın.
|
*/

$allowedOrigins = array_values(array_filter(
    array_map('trim', explode(',', (string) env('FRONTEND_URL', ''))),
    static fn (string $origin): bool => $origin !== '',
));

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['POST', 'OPTIONS'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Content-Type', 'X-Requested-With'],

    'exposed_headers' => ['Retry-After'],

    'max_age' => 3600,

    // Form herkese açıktır; çerez veya kimlik bilgisi taşınmaz.
    'supports_credentials' => false,

];
