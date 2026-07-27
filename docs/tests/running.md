# Запуск тестов

## Структура

- `frontend/src/**/*.test.ts(x)` — тесты в памяти и React-компоненты (Vitest + Testing Library).
- `backend/criteria-tests/` — тесты чистой валидации и Express API (Jest + Supertest).
- `frontend/e2e/app.spec.ts` — сквозные пользовательские сценарии (Playwright).
- `frontend/e2e/visual.spec.ts` — скриншотная регрессия и эталоны.
- `frontend/e2e/mock-upstreams.cjs` — фиксированные внешние Asteroids/Resources API. Frontend не перехватывает HTTP: запросы проходят через настоящий локальный BFF.

## Команды

После `npm ci`:

```bash
npm run test:unit
npm run test:e2e
npm run test:visual
```

Все unit-тесты workspace:

```bash
npm test
```

Первичная установка Chromium и обновление эталонов:

```bash
npx playwright install chromium
npm run test:e2e:update --workspace frontend
```

Эталоны обновляют только после осознанного подтверждения изменения интерфейса. В CI рекомендуется запускать `npm run build`, `npm run lint`, `npm run test:unit`, `npm run test:e2e` и `npm run test:visual`.
