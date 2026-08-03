<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\BudgetRange;
use App\Enums\ContactMethod;
use App\Enums\QuoteRequestStatus;
use App\Enums\ServiceType;
use Database\Factories\QuoteRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Web sitesindeki teklif formundan gelen talep.
 *
 * @property int $id
 * @property string $full_name
 * @property string|null $company_name
 * @property string $email
 * @property string $phone
 * @property ServiceType $service_type
 * @property BudgetRange $budget_range
 * @property ContactMethod $preferred_contact_method
 * @property string $project_description
 * @property QuoteRequestStatus $status
 * @property string|null $ip_address
 */
class QuoteRequest extends Model
{
    /** @use HasFactory<QuoteRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'full_name',
        'company_name',
        'email',
        'phone',
        'service_type',
        'budget_range',
        'preferred_contact_method',
        'project_description',
        'status',
        'ip_address',
    ];

    /**
     * IP adresi yalnızca kötüye kullanım incelemesi için tutulur ve
     * API yanıtlarında hiçbir zaman dışarı verilmez.
     */
    protected $hidden = [
        'ip_address',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'service_type' => ServiceType::class,
            'budget_range' => BudgetRange::class,
            'preferred_contact_method' => ContactMethod::class,
            'status' => QuoteRequestStatus::class,
        ];
    }
}
