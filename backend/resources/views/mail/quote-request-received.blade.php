@component('mail::message')
# Yeni teklif talebi

Web sitesindeki formdan yeni bir talep geldi.

@component('mail::table')
| Alan | Bilgi |
| :--- | :---- |
| Ad Soyad | {{ $request->full_name }} |
| Firma | {{ $request->company_name ?: '—' }} |
| E-posta | {{ $request->email }} |
| Telefon | {{ $request->phone }} |
| Hizmet | {{ $request->service_type->label() }} |
| Bütçe | {{ $request->budget_range->label() }} |
| İletişim tercihi | {{ $request->preferred_contact_method->label() }} |
| Tarih | {{ $request->created_at?->format('d.m.Y H:i') }} |
@endcomponent

**Proje açıklaması**

{{ $request->project_description }}

@component('mail::button', ['url' => 'mailto:'.$request->email])
Talep sahibine yanıt yaz
@endcomponent

Talep no: #{{ $request->id }}

@endcomponent
