<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->configureModels();
    }

    /**
     * Teklif formu için oran sınırı.
     *
     * IP başına dakikada 5, saatte 20 istek. Ortak IP arkasındaki kurumsal
     * ağları tamamen kilitlememek için dakikalık sınır makul tutuldu;
     * asıl koruma saatlik sınırdadır.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('quote-requests', function (Request $request): array {
            $key = (string) $request->ip();

            return [
                Limit::perMinute(5)->by('qr-min:'.$key),
                Limit::perHour(20)->by('qr-hour:'.$key),
            ];
        });
    }

    private function configureModels(): void
    {
        // Beklenmeyen alan atamalarını geliştirmede erkenden yakala.
        Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());
    }
}
