#!/bin/sh
set -e

# ---------------------------------------------------------------------------
# Üretim başlangıç adımları
# ---------------------------------------------------------------------------
# Bu betik her konteyner başlangıcında çalışır. Migration'ı otomatik çalıştırmak
# çok replikalı kurulumlarda yarış durumuna yol açabileceğinden, RUN_MIGRATIONS
# değişkeni açıkça "true" yapılmadıkça atlanır.

# Uygulama anahtarı yoksa uygulama zaten çalışamaz; erken ve anlaşılır hata ver.
if [ -z "${APP_KEY}" ]; then
  echo "HATA: APP_KEY tanımlı değil. 'php artisan key:generate --show' ile üretip ortam değişkeni olarak verin." >&2
  exit 1
fi

if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo "Migration'lar çalıştırılıyor…"
  php artisan migrate --force
fi

# Önbellekler her başlangıçta yeniden üretilir; böylece imaj değiştiğinde
# eski yapılandırma cache'i takılı kalmaz.
php artisan config:cache
php artisan route:cache
php artisan event:cache

# Depolama bağlantısı (public disk) yoksa oluştur.
php artisan storage:link --quiet || true

exec "$@"
