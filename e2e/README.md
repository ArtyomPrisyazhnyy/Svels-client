# Playwright E2E (Svels-client)

UI-регрессионные тесты для всего клиентского приложения: лендинг, auth, публичная страница ресторана, OTP-гости, бронирование, предзаказ, личный кабинет, админка заведения и суперадмин.

## Требования

1. Backend на `:3000` (Postgres + Redis) с `NODE_ENV !== production`
2. В `Svels-backend/.env` заданы `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (или те же ключи в `e2e/.env` как `E2E_SUPER_ADMIN_*`)
3. Frontend поднимается Playwright’ом (`npm run dev` на `:3001`) либо уже запущен

Dev-эндпоинт `GET /dev/last-otp?phone=...` нужен для OTP-сценариев (только non-production).

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
