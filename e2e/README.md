# Playwright E2E (Svels-client)

UI-регрессионные тесты для всего клиентского приложения: лендинг, auth, публичная страница ресторана, OTP-гости, бронирование, предзаказ, личный кабинет, админка заведения и суперадмин.

## Требования

1. Backend на `:3000` (Postgres + Redis), миграции и super admin (см. `Svels-backend/.env.example`).
2. В **`Svels-backend/.env`** для e2e обязательно:
   - `NODE_ENV=development`
   - `ENABLE_DEV_ENDPOINTS=true` — иначе `GET /dev/last-otp` отвечает **404** (нужен global-setup и OTP-тесты)
   - `CORS_ALLOWED_ORIGINS=http://localhost:3001,http://127.0.0.1:3001` — клиент Playwright по умолчанию на **3001** (`E2E_BASE_URL`); без этого браузерные запросы к API блокируются CORS (см. Svels-backend `878d76d`+)
   - `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (или дубли в `e2e/.env` как `E2E_SUPER_ADMIN_*`)
3. Frontend поднимается Playwright’ом (`npm run dev` / `npm run start` на `:3001`) либо уже запущен.

Dev-эндпоинт `GET /dev/last-otp?phone=...` доступен только при **`NODE_ENV=development`** и **`ENABLE_DEV_ENDPOINTS=true`**.

## Демо-заведение лендинга

Фиктивная кофейня «Чайка» (`/restaurants/demo`) отдаётся **`scripts/landing-mock-api.mjs`**: полное меню и фото из `e2e/fixtures/demo-venue/` (контент-пак), картинки в `public/demo-venue/images/`. Съёмка лендинга: `npm run landing:capture` (raw Playwright → `scripts/landing/build-scenes.mjs` → `public/landing/scenes/*` + manifest). Только пересборка растров: `npm run landing:scenes` (нужны raw PNG в `scripts/landing/raw/`). Переменная `NEXT_PUBLIC_DEMO_RESTAURANT_URL` (см. `.env.example`) — CTA «Открыть демо-заведение».

## Команды

```bash
# из Svels-client
npm run test:e2e            # все тесты
npm run test:e2e:ui         # Playwright UI mode
npm run test:e2e:headed     # с окном браузера
npm run test:e2e:report     # HTML-отчёт
```

Если серверы уже запущены:

```bash
E2E_SKIP_WEBSERVER=1 npm run test:e2e
```

## Что делает global-setup

Перед прогоном:

1. Ждёт доступности API
2. Логинится суперадмином
3. Создаёт уникального restaurant_admin + заявку
4. Одобряет заявку
5. Пишет `e2e/.auth/seed.json` (gitignore)

## CI

На каждый PR в `main` workflow **e2e** поднимает Postgres 16, Redis, собирает и запускает [Svels-backend](https://github.com/ArtyomPrisyazhnyy/Svels-backend) `main`, собирает клиент и гоняет **все** спеки Playwright. При падении сохраняются HTML-отчёт и traces (`playwright-e2e-artifacts`).

## Покрытие

| Область | Файл |
|---------|------|
| Лендинг | `landing.spec.ts` |
| Редиректы платформы | `redirects.spec.ts` |
| Auth заведений / суперадмин | `auth.restaurant.spec.ts` |
| Guest OTP | `auth.guest.spec.ts` |
| Публичная страница / меню / корзина | `restaurant.public.spec.ts` |
| Бронирование | `booking.spec.ts` |
| Предзаказ / корзина | `preorder.spec.ts` |
| Заказы (админка) | `restaurant-admin-orders.spec.ts` |
| ЛК гостя | `account.spec.ts` |
| Админка заведения (все разделы) | `restaurant-admin.spec.ts` |
| Суперадмин модерация | `super-admin.spec.ts` |
| Guards / роли | `protected-routes.spec.ts` |

## Селекторы

Предпочитайте `data-testid` на ключевых контролах. Не привязывайтесь к случайным CSS-классам без необходимости.
