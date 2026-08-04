@extends('admin.layout')

@section('title', 'Yönetici Girişi')

@section('content')
    <div class="login-wrap">
        <section class="login-card" aria-labelledby="login-title">
            <span class="eyebrow">Güvenli erişim</span>
            <h1 id="login-title">Yönetici girişi</h1>
            <p>Teklif formlarını görüntülemek ve durumlarını yönetmek için hesabınızla giriş yapın.</p>

            <form method="POST" action="{{ route('admin.login.store') }}">
                @csrf
                <div class="form-row">
                    <label for="email">E-posta adresi</label>
                    <input class="field" id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="username" required autofocus>
                </div>
                <div class="form-row">
                    <label for="password">Şifre</label>
                    <input class="field" id="password" name="password" type="password" autocomplete="current-password" required>
                </div>
                <label class="remember">
                    <input name="remember" type="checkbox" value="1">
                    Bu cihazda oturumu açık tut
                </label>
                <button class="button" type="submit">Panele giriş yap</button>
            </form>
        </section>
    </div>
@endsection
