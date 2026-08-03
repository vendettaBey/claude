<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Cloudflare / Nginx arkasında gerçek ziyaretçi IP'sini doğru okuyabilmek
        // için proxy başlıklarına güveniyoruz. Üretimde TRUSTED_PROXIES değişkenini
        // yalnızca kendi proxy aralığınızla sınırlayın.
        $middleware->trustProxies(at: env('TRUSTED_PROXIES', '*'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // /api/* altındaki tüm hatalar HTML yerine JSON döner.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
