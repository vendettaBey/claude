<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\QuoteRequestStatus;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminQuoteRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_admin_login(): void
    {
        $this->get('/yonetim')->assertRedirect('/yonetim/giris');
    }

    public function test_regular_user_cannot_open_admin_panel(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/yonetim')->assertForbidden();
    }

    public function test_admin_can_see_quote_request_details(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $quoteRequest = QuoteRequest::factory()->create([
            'full_name' => 'Ayşe Yılmaz',
            'email' => 'ayse@example.com',
            'project_description' => 'Kurumsal sitemizi yenilemek ve teklif akışını iyileştirmek istiyoruz.',
        ]);

        $this->actingAs($admin)
            ->get('/yonetim')
            ->assertOk()
            ->assertSee('Ayşe Yılmaz')
            ->assertSee('ayse@example.com')
            ->assertSee($quoteRequest->project_description);
    }

    public function test_admin_can_update_quote_request_status(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $quoteRequest = QuoteRequest::factory()->create(['status' => QuoteRequestStatus::New]);

        $this->actingAs($admin)
            ->patch("/yonetim/talepler/{$quoteRequest->id}", [
                'status' => QuoteRequestStatus::Contacted->value,
            ])
            ->assertRedirect();

        $this->assertSame(QuoteRequestStatus::Contacted, $quoteRequest->fresh()->status);
    }

    public function test_only_admin_credentials_can_log_in(): void
    {
        $regularUser = User::factory()->create([
            'email' => 'uye@example.com',
            'password' => 'guvenli-sifre-123',
            'is_admin' => false,
        ]);

        $this->post('/yonetim/giris', [
            'email' => $regularUser->email,
            'password' => 'guvenli-sifre-123',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }
}
