<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create', function (): int {
    $name = trim((string) $this->ask('Yönetici adı'));
    $email = mb_strtolower(trim((string) $this->ask('E-posta adresi')));
    $password = (string) $this->secret('Şifre (en az 12 karakter)');

    $validator = Validator::make(compact('name', 'email', 'password'), [
        'name' => ['required', 'string', 'max:120'],
        'email' => ['required', 'email', 'max:255'],
        'password' => ['required', 'string', 'min:12'],
    ]);

    if ($validator->fails()) {
        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }

        return self::FAILURE;
    }

    $user = User::query()->updateOrCreate(
        ['email' => $email],
        ['name' => $name, 'password' => $password, 'is_admin' => true],
    );

    $this->info("Yönetici hesabı hazır: {$user->email}");

    return self::SUCCESS;
})->purpose('Yönetim paneli için güvenli bir yönetici hesabı oluşturur');
