# Гражданин — новостной портал

Статический сайт на Astro 6: пенсии, налоги, выплаты и социальная помощь. RSS → рерайт → деплой.

## Деплой на Vercel (рекомендуется)

1. Зайдите на [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → выберите `trentonfunderburkc/citizen-news` (или свой форк)
3. Vercel сам определит Astro — **Deploy** без изменений настроек

После деплоя сайт откроется по адресу вида `https://citizen-news-xxx.vercel.app`.

### Переменные в Vercel (Settings → Environment Variables)

| Переменная | Production | Зачем |
|---|---|---|
| `PUBLIC_ENABLE_METRIKA` | `true` | Яндекс.Метрика |
| `PUBLIC_YANDEX_METRIKA_ID` | ваш ID | Счётчик |
| `SITE_URL` | `https://ваш-домен.ru` | Sitemap, Open Graph (если свой домен) |
| `ANDROID_REDIRECT_ENABLED` | `true` | Редirect Android-телефонов |
| `ANDROID_REDIRECT_URL` | `https://ваш-сайт.ru` | Куда отправлять Android-мобильные |

Секреты для **локального** fetch статей — только в `.env`, в Vercel для сайта не нужны (контент уже в репозитории).

**Android-редirect:** только телефоны (`Android` + `Mobile`). iOS, desktop и планшеты остаются на этом сайте. После смены env — **Redeploy**. Сборка на Vercel не трогает статьи (RSS/AI не запускаются, только HTML из git).

> **Redeploy на Vercel** не вызывает RSS, AI и генерацию картинок. Контент меняется только если вы сами запускаете `fetch:articles` или GitHub Actions `fetch-new.yml` (раз в неделю, макс. 10 новых статей).

### Свой домен

Vercel → Project → **Settings → Domains** → добавьте домен и укажите:

```
SITE_URL=https://citizennews.space
```

---

## Локальный запуск

```bash
npm install
npm run dev
```

Сайт: [http://localhost:4321/](http://localhost:4321/)

---

## Обновление контентa

```bash
npm run fetch:articles          # новые статьи из RSS
npm run fetch:articles:reset    # полная перегенерация
npm run seed:comments
```

GitHub Actions (`fetch-new.yml`) может добавлять статьи по расписанию — после push Vercel пересоберёт сайт автоматически.

---

## Переменные `.env` (локально / CI для fetch)

Скопируйте `.env.example` → `.env`:

| Переменная | Зачем |
|---|---|
| `GEMINI_API_KEY` | Картинки + резервный рерайт |
| `DEEPSEEK_API_KEY` | Основной рерайт |
| `OPENAI_API_KEY` | Резерв рерайта и картинок |
| `IMAGE_PROVIDER` | `gemini` / `openai` / `unsplash` |
| `AI_PROVIDER` | `deepseek` / `openai` / `gemini` |

---

## Стек

Astro 6 · Tailwind CSS 4 · Gemini · DeepSeek · Vercel
