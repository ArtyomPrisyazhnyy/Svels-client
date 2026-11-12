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
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com \
  --build-arg NEXT_PUBLIC_YANDEX_MAPS_KEY=your-yandex-key \
  .
```

Сборка **для Docker Compose** (middleware резолвит домены через внутренний `api:3000`):

```bash
docker build -t svels-client:latest \
  --add-host=api:127.0.0.1 \
  --build-arg NEXT_PUBLIC_API_URL=http://api:3000 \
  --build-arg NEXT_PUBLIC_SITE_URL=https://svels.by \
  --build-arg NEXT_PUBLIC_PLATFORM_HOSTS=localhost,127.0.0.1,svels.by,www.svels.by \
  .
```

Для браузера на проде часто дополнительно задают публичный API (`https://api.svels.by`) вместо внутреннего URL — зависит от того, как настроен Caddy и CORS.

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
| `NEXT_PUBLIC_API_URL` | Базовый URL API для SSR/middleware и (если задан) для браузера. **Не задан** при `docker build` → на сборке используется `http://localhost:3000` (mock в Dockerfile). Для compose-образа передайте `http://api:3000` и `--add-host=api:127.0.0.1` (см. выше). |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | OAuth Google (кнопка входа). |
| `NEXT_PUBLIC_YANDEX_MAPS_KEY` | Ключ Яндекс.Карт (опционально). |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN Sentry (опционально; без значения мониторинг выключен). |

`NEXT_PUBLIC_*` в Next.js встраиваются в клиентский бандл **на сборке**. Смена значения без пересборки образа для клиента не сработает (кроме серверных путей, где читается `process.env` без инлайна — для middleware `NEXT_PUBLIC_*` тоже фиксируется при build).

CI (`docker.yml`) собирает образ **без** `NEXT_PUBLIC_API_URL` — достаточно mock API на `localhost:3000`. Продакшн-образ для compose собирают с `--build-arg NEXT_PUBLIC_API_URL=http://api:3000` и `--add-host=api:127.0.0.1`.

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

## За HTTPS reverse proxy (Caddy, nginx, Traefik)

Клиент слушает **HTTP** внутри контейнера (`HOSTNAME=0.0.0.0`, `PORT=3000`). TLS завершается на прокси.

Рекомендации:

- Проксируйте на `web:3000` (или `127.0.0.1:3000` при локальном run) с заголовками `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`.
- В продакшене Next отдаёт заголовки безопасности (HSTS, `X-Frame-Options`, `Referrer-Policy` и др.) — прокси не должен их затирать без необходимости.
- `NEXT_PUBLIC_SITE_URL` при сборке должен быть **каноническим HTTPS-URL** платформы (как видит пользователь), иначе metadata/sitemap/редиректы с custom domain будут неверными.

В стеке Svels-backend Caddy в `deploy/Caddyfile` обслуживает платформенные домены и on-demand TLS для custom domain ресторанов, `reverse_proxy web:3000` для фронта и отдельно API.

## Custom domain заведения

Логика в `src/middleware.ts`:

1. Если `Host` входит в `NEXT_PUBLIC_PLATFORM_HOSTS` (или runtime `PLATFORM_HOSTS`) — запрос идёт на маршруты платформы как обычно.
2. Иначе middleware вызывает backend `GET /restaurants/resolve-domain` по `NEXT_PUBLIC_API_URL` и делает **rewrite** на `/restaurants/{id}/…` для гостевых разделов (`booking`, `pre-order`, `account`, и т.д.).
3. Пути `/admin` и `/restaurant-admin` с custom domain **редиректятся** на `NEXT_PUBLIC_SITE_URL` (админка только на платформенных хостах).

Для работы custom domain в проде нужны: DNS заведения → ваш сервер, TLS (on-demand в Caddy backend), корректный `NEXT_PUBLIC_API_URL` в образе (доступ к `api` из контейнера `web`) и запись домена в backend.

## Sentry

Включение только при заданном **`NEXT_PUBLIC_SENTRY_DSN`** на этапе `docker build` (как и остальные `NEXT_PUBLIC_*`). Без DSN Sentry не инициализируется и не влияет на сборку.

| Переменная | Когда | Назначение |
|------------|--------|------------|
| `NEXT_PUBLIC_SENTRY_DSN` | build | DSN проекта; пусто — мониторинг выключен. |
| `SENTRY_ENVIRONMENT` | build (опц.) | Имя окружения в Sentry (по умолчанию `NODE_ENV`). |
| `SENTRY_TRACES_SAMPLE_RATE` | build (опц.) | Доля performance-трейсов (по умолчанию `0.1`). |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | build (опц.) | Загрузка source maps; **без `SENTRY_AUTH_TOKEN` загрузка отключена**. |

PII в события не отправляется (`sendDefaultPii: false`, cookies/authorization вырезаются в `beforeSend`).

Пример сборки с Sentry без upload карт:

```bash
docker build -t svels-client:latest \
  --build-arg NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0 \
  .
```

С upload карт (передайте токен только в CI, не сохраняйте в слоях образа без необходимости):

```bash
docker build -t svels-client:latest \
  --build-arg NEXT_PUBLIC_SENTRY_DSN=... \
  --build-arg SENTRY_ORG=my-org \
  --build-arg SENTRY_PROJECT=svels-client \
  --build-arg SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" \
  .
```

`SENTRY_AUTH_TOKEN` используется только на этапе `npm run build` для загрузки карт; в runtime-образ он не нужен.

## CI

Workflow `.github/workflows/docker.yml` на каждый PR и push в `main` выполняет `docker build` без push в registry и без секретов.
