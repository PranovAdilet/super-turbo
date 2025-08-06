# Отчет о проблеме с ContentLayer в super-landing

## 🔍 Проблема

**Ошибка:** `ENOENT: no such file or directory, lstat '/vercel/path0/apps/super-landing/.contentlayer/generated/Blog/_index.json'`

**Причина:** ContentLayer не может найти или создать индексный файл для блога.

## 📊 Анализ

### Текущее состояние:

- ✅ ContentLayer2 установлен (`contentlayer2@^0.5.8`)
- ✅ next-contentlayer2 установлен (`next-contentlayer2@^0.5.8`)
- ✅ Файлы блога существуют в `src/content/blog/`
- ❌ Индексный файл `_index.json` отсутствует

### Структура файлов:

```
apps/super-landing/src/content/blog/
├── en/ (11 файлов .mdx)
├── ru/ (7 файлов .mdx)
├── es/ (7 файлов .mdx)
├── hi/ (7 файлов .mdx)
└── tr/ (7 файлов .mdx)
```

## 🛠️ Решения

### 1. Создан диагностический скрипт

- `apps/super-landing/scripts/fix-contentlayer.js` - проверка и исправление

### 2. Проблемы с ContentLayer2

ContentLayer2 может иметь проблемы с:

- Созданием индексных файлов
- Обработкой многоязычного контента
- Генерацией в продакшене

### 3. Рекомендуемые исправления

#### Немедленные действия:

1. **Очистить кэш:**

```bash
cd apps/super-landing
pnpm clean-cache
```

2. **Пересобрать проект:**

```bash
pnpm build
```

3. **Проверить конфигурацию:**

```bash
node scripts/fix-contentlayer.js
```

#### Альтернативные решения:

1. **Обновить ContentLayer2:**

```bash
pnpm update contentlayer2 next-contentlayer2
```

2. **Добавить fallback в конфигурацию:**

```typescript
// contentlayer.config.ts
export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Tool, Case, Doc, Page, Home, Blog],
  // Добавить обработку ошибок
  onUnknownDocuments: "skip-warn",
  onMissingOrInvalidYaml: "skip-warn",
});
```

3. **Использовать стабильную версию ContentLayer:**

```bash
pnpm remove contentlayer2 next-contentlayer2
pnpm add contentlayer next-contentlayer
```

## 🚀 Команды для исправления

### В продакшене:

```bash
# Очистить кэш
cd apps/super-landing
pnpm clean-cache

# Пересобрать
pnpm build
```

### В разработке:

```bash
# Запустить диагностику
node scripts/fix-contentlayer.js

# Очистить и пересобрать
pnpm clean-cache
pnpm build
```

## 📋 Файлы, которые нужно проверить

1. `apps/super-landing/contentlayer.config.ts` - конфигурация
2. `apps/super-landing/next.config.mjs` - интеграция с Next.js
3. `apps/super-landing/package.json` - зависимости
4. `apps/super-landing/src/content/blog/**/*.mdx` - файлы контента

## 🎯 Ожидаемый результат

После исправления:

- ✅ ContentLayer создаст индексные файлы
- ✅ Сборка завершится успешно
- ✅ Блог будет доступен в приложении
- ✅ Ошибка `ENOENT` исчезнет

## 📝 Заключение

Проблема связана с ContentLayer2 и его обработкой индексных файлов. Рекомендуется очистить кэш и пересобрать проект. Если проблема сохранится, рассмотреть переход на стабильную версию ContentLayer.

### Статус: 🔄 ТРЕБУЕТ ИСПРАВЛЕНИЯ
