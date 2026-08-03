<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Teklif talebinin satış hunisindeki durumu.
 * İleride bir yönetim paneli eklendiğinde bu değerler üzerinden filtrelenir.
 */
enum QuoteRequestStatus: string
{
    case New = 'new';
    case Contacted = 'contacted';
    case Evaluating = 'evaluating';
    case Converted = 'converted';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Yeni',
            self::Contacted => 'İletişime geçildi',
            self::Evaluating => 'Değerlendiriliyor',
            self::Converted => 'Projeye dönüştü',
            self::Rejected => 'Olumsuz',
        };
    }
}
