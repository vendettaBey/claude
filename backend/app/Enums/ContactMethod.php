<?php

declare(strict_types=1);

namespace App\Enums;

enum ContactMethod: string
{
    case Phone = 'telefon';
    case WhatsApp = 'whatsapp';
    case Email = 'eposta';
    case OnlineMeeting = 'online-gorusme';

    public function label(): string
    {
        return match ($this) {
            self::Phone => 'Telefon',
            self::WhatsApp => 'WhatsApp',
            self::Email => 'E-posta',
            self::OnlineMeeting => 'Online görüşme',
        };
    }
}
