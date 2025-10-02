# Архитектура Super Landing

## 🏗️ Обзор системы

Super Landing - это многоязычный маркетинговый сайт для SuperDuperAI с интеграцией AI генерации контента, построенный на Next.js 15.

## 📦 Основные компоненты

### Frontend

- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - Строгая типизация
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Доступные UI компоненты

### Контент-менеджмент

- **ContentLayer2** - Управление MDX контентом
- **MDX** - Markdown с JSX компонентами
- **Многоязычность** - Поддержка 5 языков

### AI Интеграция

- **SuperDuperAI API** - Генерация контента
- **API Routes** - Серверные маршруты для AI

## 🌐 Многоязычность

### Поддерживаемые языки

- **Русский** (ru) - основной язык
- **Английский** (en) - международный
- **Турецкий** (tr) - региональный
- **Испанский** (es) - латиноамериканский
- **Хинди** (hi) - азиатский рынок

### Структура переводов

```
src/config/dictionaries/
├── ru.json          # Русский
├── en.json          # Английский
├── tr.json          # Турецкий
├── es.json          # Испанский
└── hi.json          # Хинди
```

### Автоматическая генерация типов

- TypeScript типы для всех ключей переводов
- Автодополнение в IDE
- Валидация на compile time

## 📄 Контент-менеджмент

### ContentLayer2

```typescript
// contentlayer.config.ts
export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Tool, Case, Doc, Page, Home, Blog],
});
```

### Структура контента

```
src/content/
├── blog/              # Блог посты
│   ├── ru/           # Русские посты
│   ├── en/           # Английские посты
│   └── ...
├── tool/              # Инструменты
├── case/              # Кейсы
└── pages/             # Статические страницы
```

### MDX файлы

```mdx
---
title: "Заголовок"
description: "Описание"
locale: "ru"
seo:
  title: "SEO заголовок"
  description: "SEO описание"
---

# Заголовок

Контент страницы...
```

## 🤖 AI Интеграция

### SuperDuperAI API

- **Генерация изображений** - Создание изображений с AI
- **Генерация видео** - Создание видео с AI
- **Модели** - Google Imagen 4, Sora, Veo2, Veo3

### API Routes

```typescript
// Генерация изображений
POST /api/generate-model-image
{
  "prompt": "красивый закат",
  "model": "google-cloud/imagen4",
  "count": 1
}

// Генерация видео
POST /api/generate-model-video
{
  "prompt": "анимированный логотип",
  "model": "azure-openai/sora",
  "count": 1
}
```

## 💳 Платежная система

### Stripe интеграция

- **Обработка платежей** - Stripe Checkout
- **Webhook обработка** - Автоматическое обновление статуса
- **Многоязычность** - Поддержка всех языков

### Конфигурация

```typescript
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};
```

## 🔍 SEO оптимизация

### Мета-теги

- **Динамические мета-теги** - Для каждой страницы
- **Open Graph** - Социальные сети
- **Twitter Cards** - Twitter интеграция
- **Структурированные данные** - Schema.org

### Локализация SEO

- **Hreflang** - Указание языковых версий
- **Sitemap** - Автоматическая генерация
- **Robots.txt** - Настройка индексации

## 📊 Аналитика

### Google Analytics 4

- **Отслеживание событий** - Пользовательские события
- **Конверсии** - Отслеживание целей
- **Аудитории** - Сегментация пользователей

### Google Tag Manager

- **Управление тегами** - Централизованное управление
- **A/B тестирование** - Тестирование вариантов
- **Трекинг форм** - Отслеживание отправки форм

## 🚀 Деплой

### Vercel

- **Автоматический деплой** - Из Git репозитория
- **Preview деплои** - Для pull requests
- **Edge Functions** - Серверные функции

### Переменные окружения

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SuperDuperAI
SUPERDUPERAI_API_URL=https://api.superduperai.com
SUPERDUPERAI_API_KEY=your_api_key

# Аналитика
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 🛠️ Разработка

### Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Локализованные маршруты
│   ├── api/               # API маршруты
│   └── globals.css        # Глобальные стили
├── components/             # React компоненты
│   ├── content/           # Контентные компоненты
│   ├── landing/           # Лендинг компоненты
│   └── ui/                # UI компоненты
├── config/                # Конфигурация
│   └── dictionaries/      # Переводы
├── content/               # MDX контент
├── hooks/                 # React хуки
├── lib/                   # Утилиты
└── types/                 # TypeScript типы
```

### Команды разработки

```bash
# Локальная разработка
pnpm dev

# Сборка
pnpm build

# Предварительный просмотр
pnpm preview

# Линтинг
pnpm lint

# Проверка типов
pnpm type-check
```

## 🔧 Оптимизация

### Производительность

- **Image optimization** - Автоматическая оптимизация изображений
- **Code splitting** - Разделение кода по страницам
- **Lazy loading** - Ленивая загрузка компонентов
- **CDN** - Content Delivery Network

### SEO

- **Static generation** - Статическая генерация страниц
- **Incremental Static Regeneration** - Инкрементальная регенерация
- **Core Web Vitals** - Оптимизация метрик производительности

---

**Версия**: 2025-01-27  
**Статус**: Активная разработка  
**Последнее обновление**: 27 января 2025
