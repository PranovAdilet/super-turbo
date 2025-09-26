# Super Turbo Monorepo

Монорепозиторий для AI чат-бота и маркетингового сайта с унифицированной системой компонентов.

## 🚀 Быстрый старт

### Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd turbo-super

# Установка зависимостей
pnpm install

# Настройка переменных окружения
cp .env.example .env.local
```

### Запуск

```bash
# Все приложения
pnpm dev

# Только чат-бот
pnpm dev --filter=super-chatbot

# Только лендинг
pnpm dev --filter=super-landing
```

### Генерация типов переводов

Проект включает **автоматическую систему генерации типов переводов**:

```bash
# Генерация типов переводов
npm run generate-translation-types

# Это:
# 1. Парсит packages/shared/src/translation/dictionaries/super-landing/en.ts
# 2. Извлекает все 318+ ключей переводов (включая вложенные)
# 3. Генерирует SuperLandingTranslationKey union type
# 4. Обновляет packages/shared/src/translation/types.ts
```

**Преимущества:**

- ✅ **Нулевая ручная работа** - типы обновляются автоматически
- ✅ **Полное автодополнение** в IDE для всех ключей переводов
- ✅ **Type safety** - TypeScript проверяет все ключи при компиляции
- ✅ **Живая система** - новые ключи автоматически появляются в типах

**Использование:**

```typescript
import { useTranslation } from "@/hooks/use-translation";

export function MyComponent() {
  const { t } = useTranslation("en");

  // IDE будет автодополнять все доступные ключи!
  return <h1>{t("hero.title")}</h1>;
}
```

## 📚 Документация

### Главные точки входа

- [Документация проекта](./docs/README.md) - Общая документация
- [Мастер-документация](./docs/MASTER_DOCUMENTATION.md) - Полная централизованная документация
- [Индекс документации](./docs/INDEX.md) - Быстрый доступ ко всем документам
- [AGENTS.md](./AGENTS.md) - Руководство для AI ассистентов

### Приложения

- [Super Chatbot](./apps/super-chatbot/README.md) - AI чат-бот
- [Super Landing](./apps/super-landing/README.md) - Маркетинговый сайт

## 🚀 Структура проекта

```
turbo-super/
├── apps/
│   ├── super-chatbot/     # AI чат-бот приложение
│   └── super-landing/     # Landing page
├── packages/
│   ├── ui/               # Общие UI компоненты
│   ├── shared/           # Общие утилиты и хуки
│   ├── payment/          # Платежные компоненты и логика
│   ├── features/         # Бизнес-функциональность
│   ├── api/              # API клиенты и интеграции
│   ├── core/             # Базовые типы и валидация
│   ├── eslint-config/    # Общая ESLint конфигурация
│   └── tsconfig/         # Общие TypeScript конфигурации
└── docs/                 # Документация
```

## ⚡ Быстрый старт

### Установка зависимостей

```bash
pnpm install
```

### Разработка

Запуск всех приложений в режиме разработки:

```bash
pnpm dev
```

Запуск конкретного приложения:

```bash
# Чат-бот
pnpm dev --filter=ai-chatbot

# Landing page
pnpm dev --filter=landing
```

### Сборка

Сборка всех приложений:

```bash
pnpm build
```

Сборка конкретного приложения:

```bash
pnpm build --filter=ai-chatbot
```

## 📦 Пакеты

### @turbo-super/ui

Общие UI компоненты на базе React и Tailwind CSS.

**Установка:**

```bash
# Автоматически доступен через workspace:*
```

**Использование:**

```tsx
import { Button, Card, Input } from "@turbo-super/ui";

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Введите текст" />
      <Button variant="accent">Отправить</Button>
    </Card>
  );
}
```

**Доступные компоненты:**

- `Button` - кнопки с различными вариантами
- `Card` - карточки с заголовками и контентом
- `Input` - поля ввода
- `Badge` - бейджи и метки
- `Tabs` - вкладки
- `Textarea` - многострочные поля ввода
- `Label` - метки полей
- `Separator` - разделители
- `cn` - утилита для объединения CSS классов

### @turbo-super/shared

Общие утилиты, хуки и функции.

**Использование:**

```tsx
import { formatDate, useDebounce, isValidEmail } from "@turbo-super/shared";

function MyComponent() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  return (
    <div>
      <p>{formatDate(new Date())}</p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
```

**Доступные утилиты:**

- `formatDate`, `formatDateTime`, `formatRelativeTime` - форматирование дат
- `formatNumber`, `formatFileSize`, `formatDuration` - форматирование чисел и файлов
- `truncateText`, `capitalizeFirst`, `slugify` - работа с текстом
- `formatCurrency`, `formatPercentage` - форматирование валют и процентов
- `isValidEmail`, `isValidUrl`, `isValidPassword` - валидация
- `useDebounce`, `useLocalStorage`, `useMediaQuery`, `useClickOutside` - React хуки

### @turbo-super/data

Общие типы данных, константы и конфигурации.

**Использование:**

```tsx
import { Artifact, User, AI_MODELS, STATUS } from "@turbo-super/data";

const imageArtifact: Artifact = {
  id: "123",
  type: "image",
  title: "Мое изображение",
  status: STATUS.COMPLETED,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

**Доступные типы и константы:**

- `Artifact`, `ImageArtifact`, `VideoArtifact` - типы артефактов
- `User`, `Session`, `Message`, `Chat` - типы пользователей и чата
- `AI_MODELS`, `STATUS`, `LIMITS` - константы моделей и статусов
- `IMAGE_SIZES`, `VIDEO_SIZES`, `FILE_FORMATS` - константы размеров и форматов

## 🛠️ Конфигурации

### ESLint

```json
// .eslintrc.js
module.exports = {
  extends: ["@turbo-super/eslint-config/next"]
}
```

### TypeScript

```json
// tsconfig.json
{
  "extends": "@turbo-super/tsconfig/nextjs.json"
}
```

## 🔧 Скрипты

| Команда           | Описание                                   |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Запуск всех приложений в режиме разработки |
| `pnpm build`      | Сборка всех приложений                     |
| `pnpm lint`       | Проверка кода линтером                     |
| `pnpm type-check` | Проверка TypeScript типов                  |
| `pnpm format`     | Форматирование кода с Prettier             |
| `pnpm clean`      | Очистка всех кэшей и node_modules          |

## 🔄 Миграция на общие пакеты

Для миграции существующих приложений на использование общих пакетов:

### Автоматическая миграция

```bash
# Запуск скрипта миграции
node scripts/migrate-to-shared-packages.js
```

### Ручная миграция

1. Замените импорты компонентов:

```tsx
// Было
import { Button } from "@/components/ui/button";

// Стало
import { Button } from "@turbo-super/ui";
```

2. Замените импорты утилит:

```tsx
// Было
import { formatDate } from "@/lib/utils";

// Стало
import { formatDate } from "@turbo-super/shared";
```

3. Замените импорты типов:

```tsx
// Было
import { Artifact } from "@/types/artifact-types";

// Стало
import { Artifact } from "@turbo-super/data";
```

Подробная документация: [docs/shared-packages-guide.md](docs/shared-packages-guide.md)

## 📖 Добавление нового приложения

1. Создайте папку в `apps/`:

```bash
mkdir apps/my-new-app
cd apps/my-new-app
```

2. Инициализируйте Next.js приложение:

```bash
npx create-next-app@latest . --typescript --tailwind --app
```

3. Обновите `package.json`:

```json
{
  "name": "my-new-app",
  "dependencies": {
    "@turbo-super/ui": "workspace:*",
    "@turbo-super/shared": "workspace:*"
  },
  "devDependencies": {
    "@turbo-super/eslint-config": "workspace:*",
    "@turbo-super/tsconfig": "workspace:*"
  }
}
```

4. Обновите `tsconfig.json`:

```json
{
  "extends": "@turbo-super/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/ui": ["../../packages/ui/src"],
      "@/shared": ["../../packages/shared/src"]
    }
  }
}
```

## 🎯 Лучшие практики

### Использование общих компонентов

✅ **Правильно:**

```tsx
import { Button } from "@turbo-super/ui";
import { formatDate } from "@turbo-super/shared";
```

❌ **Неправильно:**

```tsx
import { Button } from "../../packages/ui/src/components/button";
```

### Структура компонентов

Все компоненты в `packages/ui` должны:

- Быть полностью типизированными
- Поддерживать `forwardRef`
- Использовать `cn` для объединения классов
- Экспортироваться из `index.ts`

### Стилизация

- Используйте Tailwind CSS классы
- Применяйте custom CSS переменные из дизайн-системы
- Поддерживайте темную тему

## 🔍 Отладка

### Проблемы с импортами

Если возникают проблемы с импортом пакетов:

1. Убедитесь, что пакеты собраны:

```bash
pnpm build --filter=@turbo-super/ui
pnpm build --filter=@turbo-super/shared
```

2. Очистите кэш:

```bash
pnpm clean
pnpm install
```

### TypeScript ошибки

Убедитесь, что пути правильно настроены в `tsconfig.json` каждого приложения.

## 📝 Участие в разработке

1. Создайте feature branch
2. Внесите изменения
3. Запустите тесты: `pnpm test`
4. Проверьте линтер: `pnpm lint`
5. Создайте Pull Request

## 📄 Лицензия

MIT
