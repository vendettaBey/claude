<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\BudgetRange;
use App\Enums\ContactMethod;
use App\Enums\QuoteRequestStatus;
use App\Enums\ServiceType;
use App\Models\QuoteRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuoteRequest>
 */
class QuoteRequestFactory extends Factory
{
    protected $model = QuoteRequest::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'company_name' => $this->faker->optional()->company(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => '+90 555 000 00 00',
            'service_type' => $this->faker->randomElement(ServiceType::cases()),
            'budget_range' => $this->faker->randomElement(BudgetRange::cases()),
            'preferred_contact_method' => $this->faker->randomElement(ContactMethod::cases()),
            'project_description' => $this->faker->paragraph(4),
            'status' => QuoteRequestStatus::New,
            'ip_address' => $this->faker->ipv4(),
        ];
    }
}
