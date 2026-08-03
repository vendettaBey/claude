<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\QuoteRequestStatus;
use App\Mail\QuoteRequestReceived;
use App\Models\QuoteRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

/**
 * Kritik akış: web sitesindeki teklif formunun uçtan uca çalışması.
 */
class QuoteRequestTest extends TestCase
{
    use RefreshDatabase;

    private const ENDPOINT = '/api/v1/quote-requests';

    protected function setUp(): void
    {
        parent::setUp();

        // Testler arasında oran sınırı sayaçları taşınmasın.
        RateLimiter::clear('qr-min:127.0.0.1');
        RateLimiter::clear('qr-hour:127.0.0.1');

        config()->set('mail.quote_requests.recipient', 'info@ulkuyazilim.test');
    }

    /** @return array<string, mixed> */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'full_name' => 'Ayşe Yılmaz',
            'company_name' => 'Örnek Klinik',
            'email' => 'ayse@ornek-klinik.test',
            'phone' => '+90 555 000 00 00',
            'service_type' => 'web-uygulamasi',
            'budget_range' => 'orta',
            'preferred_contact_method' => 'eposta',
            'project_description' => 'Hastalarımızın internet üzerinden randevu alabileceği bir sistem istiyoruz.',
        ], $overrides);
    }

    public function test_gecerli_talep_kaydedilir_ve_bildirim_gonderilir(): void
    {
        Mail::fake();

        $response = $this->postJson(self::ENDPOINT, $this->validPayload());

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Mesajınız bize ulaştı. Projenizi inceleyip sizinle iletişime geçeceğiz.')
            ->assertJsonStructure(['success', 'message', 'data' => ['request_id', 'status', 'created_at']]);

        $this->assertDatabaseHas('quote_requests', [
            'email' => 'ayse@ornek-klinik.test',
            'service_type' => 'web-uygulamasi',
            'status' => QuoteRequestStatus::New->value,
        ]);

        Mail::assertSent(QuoteRequestReceived::class);
    }

    public function test_yanit_kisisel_veri_sizdirmaz(): void
    {
        Mail::fake();

        $response = $this->postJson(self::ENDPOINT, $this->validPayload());

        $response->assertCreated()
            ->assertJsonMissing(['email' => 'ayse@ornek-klinik.test'])
            ->assertJsonMissingPath('data.ip_address')
            ->assertJsonMissingPath('data.full_name');
    }

    public function test_eksik_alanlar_dogrulama_hatasi_dondurur(): void
    {
        Mail::fake();

        $response = $this->postJson(self::ENDPOINT, []);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Formdaki bazı alanları kontrol edin.')
            ->assertJsonValidationErrors([
                'full_name',
                'email',
                'phone',
                'service_type',
                'budget_range',
                'preferred_contact_method',
                'project_description',
            ]);

        $this->assertDatabaseCount('quote_requests', 0);
        Mail::assertNothingSent();
    }

    public function test_gecersiz_eposta_reddedilir(): void
    {
        $response = $this->postJson(self::ENDPOINT, $this->validPayload(['email' => 'gecersiz']));

        $response->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Geçerli bir e-posta adresi girin.');
    }

    public function test_cok_kisa_aciklama_reddedilir(): void
    {
        $response = $this->postJson(self::ENDPOINT, $this->validPayload([
            'project_description' => 'kısa',
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('project_description');
    }

    public function test_tanimsiz_hizmet_turu_reddedilir(): void
    {
        $response = $this->postJson(self::ENDPOINT, $this->validPayload([
            'service_type' => 'olmayan-hizmet',
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('service_type');
    }

    public function test_honeypot_dolu_gelirse_kayit_olusmaz(): void
    {
        Mail::fake();

        $response = $this->postJson(self::ENDPOINT, $this->validPayload([
            'website' => 'https://spam.example',
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('website');

        $this->assertDatabaseCount('quote_requests', 0);
        Mail::assertNothingSent();
    }

    public function test_oran_siniri_asiri_gonderimi_engeller(): void
    {
        Mail::fake();

        // Dakikalık sınır 5; altıncı istek 429 dönmelidir.
        for ($i = 0; $i < 5; $i++) {
            $this->postJson(self::ENDPOINT, $this->validPayload([
                'email' => "talep{$i}@ornek.test",
            ]))->assertCreated();
        }

        $this->postJson(self::ENDPOINT, $this->validPayload([
            'email' => 'talep-son@ornek.test',
        ]))->assertStatus(429);

        $this->assertDatabaseCount('quote_requests', 5);
    }

    public function test_mail_gonderimi_basarisiz_olsa_da_talep_kaydedilir(): void
    {
        // Alıcı tanımsız → bildirim atlanır, kayıt yine de oluşur.
        config()->set('mail.quote_requests.recipient', null);
        Mail::fake();

        $this->postJson(self::ENDPOINT, $this->validPayload())->assertCreated();

        $this->assertDatabaseCount('quote_requests', 1);
        Mail::assertNothingSent();
    }

    public function test_model_factory_calisir(): void
    {
        $request = QuoteRequest::factory()->create();

        $this->assertInstanceOf(QuoteRequestStatus::class, $request->status);
        $this->assertDatabaseCount('quote_requests', 1);
    }
}
