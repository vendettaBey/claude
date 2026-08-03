<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Bütçe aralıkları bilinçli olarak rakam içermez —
 * sabit fiyat vaadi oluşturmadan kapsamı anlamamızı sağlar.
 */
enum BudgetRange: string
{
    case Starter = 'baslangic';
    case Medium = 'orta';
    case Large = 'genis';
    case ToBeDiscussed = 'birlikte';

    public function label(): string
    {
        return match ($this) {
            self::Starter => 'Başlangıç seviyesinde bir proje',
            self::Medium => 'Orta kapsamlı proje',
            self::Large => 'Geniş kapsamlı özel yazılım',
            self::ToBeDiscussed => 'Bütçeyi birlikte belirlemek istiyor',
        };
    }
}
