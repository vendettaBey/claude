<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Teklif formunda seçilebilen hizmet türleri.
 * Değerler frontend'deki `serviceOptions` listesiyle birebir aynıdır.
 */
enum ServiceType: string
{
    case CorporateWebsite = 'kurumsal-web-sitesi';
    case CustomWebsite = 'ozel-web-sitesi';
    case WebApplication = 'web-uygulamasi';
    case Redesign = 'site-yenileme';
    case AdminPanel = 'yonetim-paneli';
    case ApiIntegration = 'api-entegrasyon';
    case ErpBusinessManagement = 'erp-isletme-yonetimi';
    case Maintenance = 'bakim-destek';
    case SeoConsulting = 'seo-danismanligi';
    case BrandIdentity = 'kurumsal-kimlik';
    case Undecided = 'emin-degilim';

    /** E-posta bildiriminde okunabilir başlık. */
    public function label(): string
    {
        return match ($this) {
            self::CorporateWebsite => 'Kurumsal web sitesi',
            self::CustomWebsite => 'Özel web sitesi',
            self::WebApplication => 'Web uygulaması',
            self::Redesign => 'Mevcut siteyi yenileme',
            self::AdminPanel => 'Yönetim paneli',
            self::ApiIntegration => 'API ve entegrasyon',
            self::ErpBusinessManagement => 'İşletme yönetim yazılımı (ERP/CRM)',
            self::Maintenance => 'Bakım ve teknik destek',
            self::SeoConsulting => 'SEO danışmanlığı',
            self::BrandIdentity => 'Kurumsal kimlik ve logo tasarımı',
            self::Undecided => 'Henüz emin değil',
        };
    }
}
