# Lighthouse performance (mobile)

Замеры: **Lighthouse CLI** (`--form-factor=mobile`), production-сборка (`next build` + `next start` на `:3001`), mock API (`scripts/lighthouse/mock-api.mjs` на `:3000`) — без Neon и без prod.

Локальный прогон:

```bash
npm run lighthouse
```

CI (3 ключевые страницы, budgets в `lighthouserc.cjs`: performance ≥ 85, best-practices/seo ≥ 90):

```bash
npm run lighthouse:ci
```

## Ключевые страницы (CI + локальный `run.mjs`)

| Page | URL | Before Perf | Before BP | Before SEO | After Perf | After BP | After SEO |
|------|-----|-------------|-----------|------------|------------|----------|-----------|
| Landing | `/` | 100 | 96 | 100 | 100 | 100 | 100 |
| Venue home (menu) | `/restaurants/00000000-0000-4000-8000-000000000001` | 94 | 93 | 100 | 95 | 96 | 100 |
| Legal (privacy) | `/privacypolicy` | 100 | 96 | 100 | 100 | 100 | 100 |

## Изменения (кратко)

- Code-split шрифтов заведения: один `next/font` pack на публичной витрине (`load-restaurant-font.ts`).
- `ResponsiveImage`: `next/image` для same-origin, `width`/`height`, `priority` на логотипе и первой карточке меню (LCP).
- Лендинг: dynamic import для Features / Pricing / FAQ; ContactModal подгружается по клику.
- `viewport` в root layout; длинный cache для `/_next/static` и `/fonts` в production.
- Mock API: CORS + `/favorites` для чистого консольного лога в Lighthouse.
- Скрипты `npm run lighthouse` / `lighthouse:ci` и job **lighthouse** в GitHub Actions.

## Прочие публичные маршруты

Для полного регресса по всем guest/legal/admin URL расширьте `urls` в `scripts/lighthouse/run.mjs` или гоняйте Playwright visual/e2e; целевые пороги те же (Perf/BP/SEO ≥ 90 на mobile).
