# Гражданин — социальный новостник

Готовый статический сайт-агрегатор социальных новостей. **Клонируйте → включите GitHub Pages → готово.**

## Деплой за 3 шага

### 1. Создайте репозиторий на GitHub

Название репозитория — любое (например `citizen-news` или `grazhdanin`).

### 2. Запушьте код

```bash
git add .
git commit -m "feat: Гражданин — социальный новостник"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПО.git
git push -u origin main
```

### 3. Включите GitHub Pages

**Settings → Pages → Build and deployment → Source: GitHub Actions**

После первого push workflow автоматически соберёт и опубликует сайт:

```
https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПО/
```

> `base` и `site` подставляются автоматически из имени репозитория — ничего менять не нужно.

---

## Локальный запуск

```bash
npm install
npm run dev
```

Сайт: [http://localhost:4321/citizen-news/](http://localhost:4321/citizen-news/)

> Локально `base` по умолчанию `/citizen-news/`. Для другого имени репо:  
> `set REPO_NAME=ваш-репо && npm run dev`

---

## Что уже готово

- **50 статей** из реальных RSS-источников (Такие дела, ТАСС, Интерфакс, Pravmir, Благосфера и др.)
- **10 авторов** с аватарками
- **Комментарии** к каждой статье
- **CI/CD** — автодеплой при push в `main`
- **Еженедельное обновление** — workflow `fetch-new.yml` (до 10 новых статей)

---

## RSS-источники (проверенные)

| Источник | Категория |
|---|---|
| [Такие дела](https://te-st.org/) | Благотворительность |
| [Такие дела — Экология](https://te-st.org/tag/ecology/) | Экология |
| [Благосфера](https://blagosfera.ru/) | Волонтёрство |
| [Pravmir](https://www.pravmir.ru/) | Благотворительность |
| [ТАСС — Общество](https://tass.ru/) | Социальная помощь |
| [ТАСС — Экология](https://tass.ru/) | Экология |
| [Интерфакс — Общество](https://www.interfax.ru/) | Социальная помощь |
| [РИА Новости — Общество](https://ria.ru/) | Социальная помощь |
| [Газета.Ru — Социальные](https://www.gazeta.ru/) | Город |
| [Ведомости](https://www.vedomosti.ru/) | Город |

Для общих новостных лент (ТАСС, Интерфакс и др.) включена **фильтрация по социальным ключевым словам**.

---

## Обновление контента

```bash
# Полная перегенерация (50 статей заново)
npm run setup:content

# Только новые статьи (без удаления старых)
npm run fetch:articles
```

---

## Переменные окружения (опционально)

Скопируйте `.env.example` → `.env`:

| Переменная | Зачем |
|---|---|
| `OPENAI_API_KEY` | Резервный рерайт + **AI-картинки** (`gpt-image-1`) |
| `IMAGE_PROVIDER` | `openai` / `unsplash` / `picsum` — источник иллюстраций |
| `AI_PROVIDER` | `deepseek` / `openai` — провайдер рерайта |
| `UNSPLASH_ACCESS_KEY` | Фото из Unsplash (без ключа — Picsum) |
| `PUBLIC_ENABLE_METRIKA` | Яндекс.Метрика (`true`/`false`) |
| `YANDEX_METRIKA_ID` | ID счётчика |

Secrets для GitHub Actions: **Settings → Secrets → Actions**

---

## Стек

Astro 6 · Tailwind CSS 4 · TypeScript · rss-parser · GitHub Pages

## Юридическая модель

Материалы цитируются со ссылкой на первоисточник (ст. 1274 ГК РФ). Объём пересказа — не более 30% от оригинала.
