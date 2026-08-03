# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 1. Aşama — React arayüzünün production build'i
# ---------------------------------------------------------------------------
FROM node:22-alpine AS frontend

WORKDIR /app

# Bağımlılıklar önce kurulur; kaynak kod değişiminde bu katman korunur.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY frontend/ ./

# Site adresi build sırasında gömülür (canonical, sitemap, schema).
ARG VITE_SITE_URL=https://ulkuyazilim.com
ARG VITE_API_BASE_URL=
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ---------------------------------------------------------------------------
# 2. Aşama — Nginx
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Statik arayüz
COPY --from=frontend /app/dist /usr/share/nginx/html

# Laravel'in public dizini (index.php ve statik varlıklar) PHP konteyneriyle
# paylaşılan hacimden bağlanır; burada yalnızca yapılandırma var.
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
