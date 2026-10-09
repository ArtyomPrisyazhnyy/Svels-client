# Деплой Svels-client (Docker)

Продакшн-образ Next.js (`output: 'standalone'`) рассчитан на стек из [Svels-backend/deploy](https://github.com/ArtyomPrisyazhnyy/Svels-backend/tree/main/deploy): сервис **`web`** в `docker-compose.prod.yml`, образ **`svels-client`**, порт контейнера **`3000`** (Caddy: `reverse_proxy web:3000`).

## Сборка образа

```bash
docker build -t svels-client:latest .
```

Для прода передайте build-args с публичными URL (см. ниже). Пример:

```bash
docker build -t svels-client:latest \
  --build-arg NEXT_PUBLIC_SITE_URL=https://svels.by \
  --build-arg NEXT_PUBLIC_PLATFORM_HOSTS=localhost,127.0.0.1,svels.by,www.svels.by \
  --build-arg NEXT_PUBLIC_API_URL=https://api.svels.by \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com \
  --build-arg NEXT_PUBLIC_YANDEX_MAPS_KEY=your-yandex-key \
  .
```

Локальная проверка без compose:

```bash
docker run --rm -p 3000:3000 \
  -e REVALIDATE_SECRET=dev-revalidate-secret \
  svels-client:latest
curl -sf -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/
curl -sf -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/privacypolicy
```

Ожидается `200` на обоих маршрутах (юридические страницы читают `content/legal/*.md` из файловой системы в рантайме).

## Переменные окружения

### На этапе сборки (`docker build --build-arg`)

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_SITE_URL` | Канонический URL платформы (metadata, sitemap, редиректы с custom domain). |
| `NEXT_PUBLIC_PLATFORM_HOSTS` | Список хостов платформы через запятую; остальные `Host` → custom domain (middleware). Также влияет на `allowedDevOrigins` в `next.config.ts`. |
| `NEXT_PUBLIC_API_URL` | Базовый URL API для SSR/middleware и (если задан) для браузера. **В compose-сети** для middleware удобно `http://api:3000`; для браузера на проде — публичный URL вида `https://api.svels.by`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | OAuth Google (кнопка входа). |
| `NEXT_PUBLIC_YANDEX_MAPS_KEY` | Ключ Яндекс.Карт (опционально). |

`NEXT_PUBLIC_*` в Next.js встраиваются в клиентский бандл **на сборке**. Смена значения без пересборки образа для клиента не сработает (кроме серверных путей, где читается `process.env` без инлайна — для middleware `NEXT_PUBLIC_*` тоже фиксируется при build).

Значения по умолчанию в `Dockerfile` ориентированы на compose (`NEXT_PUBLIC_API_URL=http://api:3000`). Для публичного продакшена обычно передают публичный API URL в `--build-arg`.

### В рантайме (`docker run` / `environment` в compose)

| Переменная | Назначение |
|------------|------------|
| `PORT` | Порт HTTP внутри контейнера (по умолчанию `3000`, как в backend compose). |
| `HOSTNAME` | Bind-адрес (`0.0.0.0` в образе). |
| `REVALIDATE_SECRET` | Секрет для `POST /api/revalidate` (должен совпадать с backend). |
| `PLATFORM_HOSTS` | Необязательная альтернатива `NEXT_PUBLIC_PLATFORM_HOSTS` только для серверной логики (`getPlatformHosts`), если нужно переопределить без пересборки. |

В `deploy/docker-compose.prod.yml` backend для сервиса `web` сейчас заданы только `image` и `expose: 3000`. Рекомендации для backend-репозитория (не меняем его в этом PR):

```yaml
  web:
    image: svels-client:${WEB_TAG:-latest}
    restart: unless-stopped
    environment:
      REVALIDATE_SECRET: ${REVALIDATE_SECRET}
      # При необходимости override platform hosts без пересборки:
      # PLATFORM_HOSTS: ${PLATFORM_HOSTS}
    expose:
      - '3000'
```

Переменные `NEXT_SITE_URL`, `API_PUBLIC_URL`, `PLATFORM_DOMAIN`, `ADMIN_DOMAIN`, `ACME_EMAIL` задаются в `.env` деплоя backend и используются Caddy/API; клиентский образ их не читает напрямую, но **`NEXT_PUBLIC_SITE_URL` при сборке клиента** должен соответствовать `NEXT_SITE_URL` / доменам в Caddyfile.

## Связка с backend compose

1. Соберите образы: `svels-api:latest` (backend), `svels-client:latest` (этот репозиторий).
2. В каталоге `Svels-backend/deploy` подготовьте `.env` (см. backend `deploy/README.md`).
3. `docker compose -f docker-compose.prod.yml up -d` — Caddy проксирует платформенные домены и on-demand TLS для custom domain на `web:3000`, API — на `api:3000`.

Middleware клиента для custom domain вызывает `GET /restaurants/resolve-domain` на `NEXT_PUBLIC_API_URL`; внутри Docker-сети при сборке с `http://api:3000` запросы идут на сервис `api` без выхода наружу.

## CI

Workflow `.github/workflows/docker.yml` на каждый PR и push в `main` выполняет `docker build` без push в registry и без секретов.
