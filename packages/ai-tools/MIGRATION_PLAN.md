# План миграции AI Tools

## Что уже сделано ✅

1. **Создан базовый пакет `@turbo-super/ai-tools`**
   - Структура пакета
   - Базовые типы и интерфейсы
   - Конфигурация инструментов
   - UI компоненты (ToolsPage, ToolsGrid, ToolIcon)
   - Базовые хуки (useImageGenerator, useVideoGenerator, usePromptEnhancer)

2. **Интеграция с super-chatbot**
   - Пакет добавлен в зависимости
   - Страница `/tools` теперь использует компонент из пакета

## Следующие шаги 🔄

### 1. Вынесение компонентов инструментов

#### Image Generator

- [ ] Перенести `apps/super-chatbot/src/app/tools/image-generator/components/` → `packages/ai-tools/src/components/image-generator/`
- [ ] Адаптировать компоненты для работы с хуками из пакета
- [ ] Вынести специфичную логику API в отдельные функции

#### Video Generator

- [ ] Перенести `apps/super-chatbot/src/app/tools/video-generator/components/` → `packages/ai-tools/src/components/video-generator/`
- [ ] Адаптировать компоненты
- [ ] Вынести API логику

#### Prompt Enhancer

- [ ] Перенести `apps/super-chatbot/src/app/tools/prompt-enhancer/components/` → `packages/ai-tools/src/components/prompt-enhancer/`
- [ ] Адаптировать компоненты

#### Script Generator

- [ ] Перенести `apps/super-chatbot/src/app/tools/script-generator/components/` → `packages/ai-tools/src/components/script-generator/`
- [ ] Создать хук `useScriptGenerator`

### 2. Вынесение API логики

#### Создать API адаптеры

- [ ] `packages/ai-tools/src/api/image-generation.ts`
- [ ] `packages/ai-tools/src/api/video-generation.ts`
- [ ] `packages/ai-tools/src/api/prompt-enhancement.ts`
- [ ] `packages/ai-tools/src/api/script-generation.ts`

#### Создать конфигурацию API

- [ ] `packages/ai-tools/src/config/api-config.ts` - настройки API endpoints
- [ ] `packages/ai-tools/src/config/models-config.ts` - конфигурация моделей

### 3. Улучшение хуков

#### Добавить дополнительные возможности

- [ ] Поддержка SSE (Server-Sent Events) для real-time прогресса
- [ ] Кэширование результатов
- [ ] Retry логика
- [ ] Batch операции

#### Создать дополнительные хуки

- [ ] `useScriptGenerator` - для генерации скриптов
- [ ] `useGallery` - для работы с галереей артефактов
- [ ] `useArtifactManager` - для управления артефактами

### 4. Улучшение типов

#### Расширить типы

- [ ] Добавить типы для API ответов
- [ ] Добавить типы для конфигурации моделей
- [ ] Добавить типы для ошибок
- [ ] Добавить типы для прогресса генерации

### 5. Создание утилит

#### Утилиты для работы с файлами

- [ ] `packages/ai-tools/src/utils/file-utils.ts` - загрузка, скачивание файлов
- [ ] `packages/ai-tools/src/utils/format-utils.ts` - форматирование данных
- [ ] `packages/ai-tools/src/utils/validation-utils.ts` - валидация параметров

### 6. Документация и примеры

#### Улучшить документацию

- [ ] Добавить примеры использования каждого хука
- [ ] Создать руководство по интеграции
- [ ] Добавить примеры кастомизации

#### Создать Storybook

- [ ] Настроить Storybook для демонстрации компонентов
- [ ] Создать stories для каждого компонента

### 7. Тестирование

#### Добавить тесты

- [ ] Unit тесты для хуков
- [ ] Unit тесты для утилит
- [ ] Integration тесты для компонентов
- [ ] E2E тесты для полного workflow

### 8. Миграция приложений

#### Обновить super-chatbot

- [ ] Заменить локальные компоненты на компоненты из пакета
- [ ] Обновить импорты
- [ ] Удалить дублированный код

#### Подготовить для super-landing

- [ ] Добавить пакет в зависимости super-landing
- [ ] Создать примеры использования
- [ ] Настроить роутинг для инструментов

## Структура после миграции

```
packages/ai-tools/
├── src/
│   ├── components/
│   │   ├── image-generator/
│   │   ├── video-generator/
│   │   ├── prompt-enhancer/
│   │   ├── script-generator/
│   │   ├── gallery/
│   │   └── shared/
│   ├── hooks/
│   │   ├── use-image-generator.ts
│   │   ├── use-video-generator.ts
│   │   ├── use-prompt-enhancer.ts
│   │   ├── use-script-generator.ts
│   │   └── use-gallery.ts
│   ├── api/
│   │   ├── image-generation.ts
│   │   ├── video-generation.ts
│   │   ├── prompt-enhancement.ts
│   │   └── script-generation.ts
│   ├── config/
│   │   ├── tools-config.ts
│   │   ├── api-config.ts
│   │   └── models-config.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── file-utils.ts
│   │   ├── format-utils.ts
│   │   └── validation-utils.ts
│   └── index.ts
├── stories/          # Storybook stories
├── tests/           # Тесты
└── docs/            # Документация
```

## Преимущества после миграции

1. **Переиспользование кода** - инструменты можно использовать в любом приложении
2. **Единообразие** - одинаковый UI и логика во всех приложениях
3. **Легкость поддержки** - изменения в одном месте
4. **Модульность** - можно импортировать только нужные части
5. **Тестируемость** - изолированные компоненты легче тестировать
6. **Документация** - централизованная документация для всех инструментов

## Приоритеты

1. **Высокий приоритет**: Вынесение компонентов image-generator и video-generator
2. **Средний приоритет**: Вынесение prompt-enhancer и script-generator
3. **Низкий приоритет**: Дополнительные улучшения и оптимизации
