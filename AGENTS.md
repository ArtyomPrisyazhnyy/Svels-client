# Правила разработки фронтенда (Svels-client)

## Архитектура

- **Состояние:** Zustand. Новые слайсы — с явными селекторами (`useStore((s) => s.field)`), без лишних подписок на весь store.
- **Сеть:** HTTP только в `**/api/*.api.ts` и в хуках, которые их вызывают. Компоненты и страницы не вызывают `fetch` напрямую.
- **Стили:** SCSS-модули/файлы рядом с фичами (`features/**/styles`). Не добавлять CSS-in-JS без согласования.
- **TypeScript:** без `any`. Строгие типы из `src/shared/types` — единственный источник DTO контракта.
- **API-клиент:** `apiRequest` из `src/shared/api/api-client.ts`. Функции эндпоинтов — только в `src/features/**/api/`.
- **Контракт с бэкендом:** `docs/` или приложенный `orders-contract` (раздел 3). Не менять контракт в типах без синхронизации с бэкендом; расхождения документировать в PR.

## Тесты

Подробные правила Playwright для агентов: **[`.cursor/rules/testing.mdc`](.cursor/rules/testing.mdc)** (always apply).

- **E2E обязательны** для новых/изменённых пользовательских потоков: спеки в `e2e/tests`, хелперы в `e2e/helpers`, сид — `e2e/global-setup.ts`.
- Перед PR: `npx tsc --noEmit`, `npm run lint`, `npm run build`, затем затронутые Playwright-спеки.

### E2E локально (кратко)

1. Клонировать [Svels-backend](https://github.com/ArtyomPrisyazhnyy/Svels-backend) рядом с клиентом (`../Svels-backend` или `Svels-backend` в корне монорепо — путь в `playwright.config.ts`).
2. Postgres 16 + Redis, `npm ci` и `npm run migration:run` в backend, `npm run create:super-admin` (см. backend `.env.example`).
3. Backend: `NODE_ENV=development npm run start:dev` (порт **3000**).
4. В `e2e/.env` (или backend `.env`) задать `E2E_SUPER_ADMIN_EMAIL` / `E2E_SUPER_ADMIN_PASSWORD` (или `SUPER_ADMIN_*`).
5. Клиент: `npm ci`, при необходимости `npm run build`.
6. `npx playwright install chromium` (первый раз).
7. `npm run test:e2e` — поднимет dev-сервер на **3001** (или `E2E_SKIP_WEBSERVER=1` если фронт уже запущен).

Полный чеклист: `e2e/README.md`.

## Параллельная работа агентов

- Типы и API-обёртки — в `src/shared/types` и `src/features/**/api/`.
- UI страниц и крупные компоненты — отдельными задачами; не смешивать с фундаментом API в одном PR без необходимости.
