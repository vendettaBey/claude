<?php

declare(strict_types=1);

use App\Enums\QuoteRequestStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table): void {
            $table->id();

            $table->string('full_name', 120);
            $table->string('company_name', 160)->nullable();
            $table->string('email', 180);
            $table->string('phone', 32);

            $table->string('service_type', 40);
            $table->string('budget_range', 20);
            $table->string('preferred_contact_method', 20);

            $table->text('project_description');

            $table->string('status', 20)->default(QuoteRequestStatus::New->value);

            // Kötüye kullanım incelemesi için tutulur; API yanıtında yer almaz.
            $table->string('ip_address', 45)->nullable();

            $table->timestamps();

            // Panelde en sık yapılacak sorgular: duruma göre filtre + tarihe göre sıralama
            $table->index(['status', 'created_at']);
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};
