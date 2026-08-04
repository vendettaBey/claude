@extends('admin.layout')

@section('title', 'Teklif Talepleri')

@section('content')
    <span class="eyebrow">Teklif yönetimi</span>
    <h1 class="page-title">Form talepleri</h1>
    <p class="page-copy">Sitedeki iletişim formundan gelen tüm kayıtları burada görebilir, arayabilir ve satış sürecindeki durumlarını güncelleyebilirsiniz.</p>

    <nav class="stats" aria-label="Talep durumları">
        <a class="stat {{ $activeStatus === null ? 'active' : '' }}" href="{{ route('admin.requests.index') }}">
            <strong>{{ $total }}</strong><span>Tüm talepler</span>
        </a>
        @foreach ($statuses as $status)
            <a class="stat {{ $activeStatus === $status ? 'active' : '' }}" href="{{ route('admin.requests.index', ['status' => $status->value]) }}">
                <strong>{{ (int) $counts->get($status->value, 0) }}</strong><span>{{ $status->label() }}</span>
            </a>
        @endforeach
    </nav>

    <form class="filters" method="GET" action="{{ route('admin.requests.index') }}">
        <input class="field" name="q" type="search" value="{{ $search }}" placeholder="Ad, firma, e-posta veya telefon ara..." aria-label="Taleplerde ara">
        <select class="field" name="status" aria-label="Duruma göre filtrele">
            <option value="">Tüm durumlar</option>
            @foreach ($statuses as $status)
                <option value="{{ $status->value }}" @selected($activeStatus === $status)>{{ $status->label() }}</option>
            @endforeach
        </select>
        <button class="button" type="submit">Filtrele</button>
        <a class="button secondary" href="{{ route('admin.requests.index') }}">Temizle</a>
    </form>

    @if ($requests->isEmpty())
        <div class="empty">Bu filtrelere uyan bir teklif talebi bulunamadı.</div>
    @else
        <div class="requests">
            @foreach ($requests as $quoteRequest)
                <article class="request">
                    <header class="request-head">
                        <div>
                            <span class="request-id">TALEP #{{ str_pad((string) $quoteRequest->id, 4, '0', STR_PAD_LEFT) }} · {{ $quoteRequest->created_at?->format('d.m.Y H:i') }}</span>
                            <h2>{{ $quoteRequest->full_name }} @if($quoteRequest->company_name)<span class="company">· {{ $quoteRequest->company_name }}</span>@endif</h2>
                        </div>
                        <span class="status status-{{ $quoteRequest->status->value }}">{{ $quoteRequest->status->label() }}</span>
                    </header>

                    <div class="request-body">
                        <div class="request-main">
                            <dl class="meta-grid">
                                <div class="meta"><dt>E-posta</dt><dd><a href="mailto:{{ $quoteRequest->email }}">{{ $quoteRequest->email }}</a></dd></div>
                                <div class="meta"><dt>Telefon</dt><dd><a href="tel:{{ $quoteRequest->phone }}">{{ $quoteRequest->phone }}</a></dd></div>
                                <div class="meta"><dt>İletişim tercihi</dt><dd>{{ $quoteRequest->preferred_contact_method->label() }}</dd></div>
                                <div class="meta"><dt>Hizmet</dt><dd>{{ $quoteRequest->service_type->label() }}</dd></div>
                                <div class="meta"><dt>Bütçe yaklaşımı</dt><dd>{{ $quoteRequest->budget_range->label() }}</dd></div>
                                <div class="meta"><dt>Son güncelleme</dt><dd>{{ $quoteRequest->updated_at?->format('d.m.Y H:i') }}</dd></div>
                            </dl>

                            <div class="description">
                                <span>Proje açıklaması</span>
                                <p>{{ $quoteRequest->project_description }}</p>
                            </div>
                        </div>

                        <aside class="request-side">
                            <form method="POST" action="{{ route('admin.requests.update', $quoteRequest) }}">
                                @csrf
                                @method('PATCH')
                                <label for="status-{{ $quoteRequest->id }}">Talep durumunu değiştir</label>
                                <select class="field" id="status-{{ $quoteRequest->id }}" name="status">
                                    @foreach ($statuses as $status)
                                        <option value="{{ $status->value }}" @selected($quoteRequest->status === $status)>{{ $status->label() }}</option>
                                    @endforeach
                                </select>
                                <button class="button" type="submit">Durumu kaydet</button>
                            </form>
                        </aside>
                    </div>
                </article>
            @endforeach
        </div>

        <nav class="pager" aria-label="Sayfalama">
            @if ($requests->onFirstPage())
                <span class="disabled">← Önceki</span>
            @else
                <a href="{{ $requests->previousPageUrl() }}">← Önceki</a>
            @endif
            <span>Sayfa {{ $requests->currentPage() }} / {{ $requests->lastPage() }} · {{ $requests->total() }} kayıt</span>
            @if ($requests->hasMorePages())
                <a href="{{ $requests->nextPageUrl() }}">Sonraki →</a>
            @else
                <span class="disabled">Sonraki →</span>
            @endif
        </nav>
    @endif
@endsection
