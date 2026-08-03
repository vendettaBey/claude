# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 1. Aşama — Composer bağımlılıkları (üretim modunda)
# ---------------------------------------------------------------------------
FROM composer:2 AS vendor

WORKDIR /app

# Önce yalnızca bağımlılık dosyaları kopyalanır; kod değiştiğinde bu katman
# yeniden kurulmaz ve build belirgin biçimde hızlanır.
COPY backend/composer.json backend/composer.lock ./

RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction

COPY backend/ ./

RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

# ---------------------------------------------------------------------------
# 2. Aşama — Çalışma zamanı (PHP-FPM)
# ---------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS runtime

# pdo_mysql: veritabanı, redis: önbellek/kuyruk, intl: Türkçe sıralama ve biçimlendirme
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS icu-dev linux-headers \
    && apk add --no-cache icu-libs \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql opcache intl bcmath \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

WORKDIR /var/www/html

COPY --from=vendor /app ./
COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# Laravel'in yazması gereken dizinler php-fpm kullanıcısına devredilir.
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

USER www-data

EXPOSE 9000

# Konteyner içindeki PHP-FPM'in ayakta olup olmadığını kontrol eder.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD php -r 'exit(0);' || exit 1

ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]
