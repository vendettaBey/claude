<!doctype html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>@yield('title', 'Yönetim') · Ülkü Yazılım</title>
    <style>
        :root{color-scheme:dark;--bg:#07080d;--panel:#10121a;--panel-2:#151824;--line:#292d3c;--text:#f3f4f8;--muted:#9ca3b5;--dim:#6f768a;--blue:#6f83ff;--cyan:#67d9ff;--green:#52d69a;--red:#ff7f8d;--amber:#f6c968}
        *{box-sizing:border-box}html{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:var(--text)}body{margin:0;min-height:100vh;background:radial-gradient(circle at 75% 10%,rgba(82,108,255,.13),transparent 30%),var(--bg)}a{color:inherit}button,input,select{font:inherit}
        .shell{width:min(1380px,calc(100% - 32px));margin-inline:auto}.topbar{position:sticky;top:0;z-index:20;border-bottom:1px solid var(--line);background:rgba(7,8,13,.86);backdrop-filter:blur(18px)}.topbar-inner{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-weight:750;letter-spacing:-.02em}.brand-mark{display:grid;width:38px;height:38px;place-items:center;border:1px solid rgba(103,217,255,.36);border-radius:10px;color:var(--cyan);box-shadow:0 0 22px rgba(82,108,255,.18)}.admin-label{padding:5px 9px;border:1px solid var(--line);color:var(--muted);font:650 10px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase}.top-actions{display:flex;align-items:center;gap:14px}.user{color:var(--muted);font-size:13px}.link-button{cursor:pointer;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--text);padding:9px 14px}.link-button:hover{border-color:#49506a;background:rgba(255,255,255,.04)}
        main{padding-block:44px 72px}.flash{margin-bottom:20px;border:1px solid rgba(82,214,154,.25);background:rgba(82,214,154,.08);padding:13px 16px;color:#a7f3d0}.errors{margin:0 0 20px;padding:13px 16px 13px 34px;border:1px solid rgba(255,127,141,.28);background:rgba(255,127,141,.08);color:#fecdd3}.eyebrow{color:var(--blue);font:700 11px ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}.page-title{margin:12px 0 8px;font-size:clamp(32px,5vw,54px);line-height:1;letter-spacing:-.045em}.page-copy{max-width:680px;margin:0;color:var(--muted);line-height:1.65}
        .stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin-top:34px}.stat{display:block;padding:16px;border:1px solid var(--line);background:rgba(255,255,255,.025);text-decoration:none}.stat:hover,.stat.active{border-color:rgba(111,131,255,.55);background:rgba(111,131,255,.08)}.stat strong{display:block;font-size:26px}.stat span{display:block;margin-top:5px;color:var(--muted);font-size:12px}
        .filters{display:grid;grid-template-columns:minmax(220px,1fr) 240px auto auto;gap:10px;margin:24px 0}.field{width:100%;height:46px;border:1px solid var(--line);border-radius:0;outline:none;background:var(--panel);color:var(--text);padding:0 14px}.field:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(111,131,255,.12)}.button{display:inline-flex;height:46px;align-items:center;justify-content:center;cursor:pointer;border:1px solid var(--blue);border-radius:0;background:var(--blue);color:white;padding:0 18px;text-decoration:none;font-weight:700}.button.secondary{border-color:var(--line);background:transparent;color:var(--muted)}
        .requests{display:grid;gap:14px}.request{border:1px solid var(--line);background:linear-gradient(145deg,rgba(21,24,36,.94),rgba(12,14,21,.96))}.request-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:20px;border-bottom:1px solid var(--line)}.request-id{color:var(--dim);font:700 11px ui-monospace,monospace;letter-spacing:.1em}.request h2{margin:6px 0 0;font-size:20px}.company{color:var(--muted);font-weight:400}.status{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid currentColor;font:700 10px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase}.status:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 9px currentColor}.status-new{color:#8ea0ff}.status-contacted{color:#67d9ff}.status-evaluating{color:#f6c968}.status-converted{color:#52d69a}.status-rejected{color:#ff7f8d}.request-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,.36fr);gap:0}.request-main{padding:20px}.meta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.meta dt{margin-bottom:5px;color:var(--dim);font:700 10px ui-monospace,monospace;letter-spacing:.11em;text-transform:uppercase}.meta dd{margin:0;color:var(--muted);font-size:14px;line-height:1.5}.meta a{text-decoration:none;color:var(--cyan)}.description{margin-top:20px;padding:18px;border:1px solid var(--line);background:rgba(0,0,0,.18)}.description span{color:var(--dim);font:700 10px ui-monospace,monospace;letter-spacing:.11em;text-transform:uppercase}.description p{margin:9px 0 0;color:#d7d9e0;line-height:1.7;white-space:pre-wrap}.request-side{border-left:1px solid var(--line);padding:20px}.request-side label{display:block;margin-bottom:8px;color:var(--dim);font:700 10px ui-monospace,monospace;letter-spacing:.11em;text-transform:uppercase}.request-side .button{width:100%;margin-top:10px}.empty{padding:70px 24px;border:1px dashed var(--line);color:var(--muted);text-align:center}.pager{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:20px;color:var(--muted);font-size:13px}.pager a{padding:10px 14px;border:1px solid var(--line);text-decoration:none}.pager .disabled{opacity:.35}
        .login-wrap{display:grid;min-height:calc(100vh - 116px);place-items:center}.login-card{width:min(440px,100%);border:1px solid var(--line);background:rgba(16,18,26,.92);padding:34px;box-shadow:0 34px 100px rgba(0,0,0,.38)}.login-card h1{margin:12px 0 8px;font-size:34px;letter-spacing:-.04em}.login-card p{margin:0 0 26px;color:var(--muted);line-height:1.6}.form-row{margin-top:16px}.form-row label{display:block;margin-bottom:8px;color:var(--muted);font-size:13px}.remember{display:flex;align-items:center;gap:9px;margin:17px 0;color:var(--muted);font-size:13px}.login-card .button{width:100%}
        @media(max-width:980px){.stats{grid-template-columns:repeat(3,1fr)}.filters{grid-template-columns:1fr 1fr}.request-body{grid-template-columns:1fr}.request-side{border-top:1px solid var(--line);border-left:0}.meta-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.shell{width:min(100% - 22px,1380px)}.user{display:none}main{padding-top:30px}.stats{grid-template-columns:repeat(2,1fr)}.filters{grid-template-columns:1fr}.request-head{display:grid}.meta-grid{grid-template-columns:1fr}.login-card{padding:24px}.top-actions{gap:8px}}
    </style>
</head>
<body>
    <header class="topbar">
        <div class="shell topbar-inner">
            <a class="brand" href="{{ auth()->check() ? route('admin.requests.index') : url('/') }}">
                <span class="brand-mark">Ü</span>
                <span>Ülkü Yazılım</span>
                <span class="admin-label">Yönetim</span>
            </a>
            @auth
                <div class="top-actions">
                    <span class="user">{{ auth()->user()->name }}</span>
                    <form method="POST" action="{{ route('admin.logout') }}">
                        @csrf
                        <button class="link-button" type="submit">Çıkış yap</button>
                    </form>
                </div>
            @endauth
        </div>
    </header>

    <main class="shell">
        @if (session('success'))
            <div class="flash" role="status">{{ session('success') }}</div>
        @endif

        @if ($errors->any())
            <ul class="errors" role="alert">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        @endif

        @yield('content')
    </main>
</body>
</html>
