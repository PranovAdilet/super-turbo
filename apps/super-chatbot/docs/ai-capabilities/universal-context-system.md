# Универсальная система контекста для медиа-файлов

## Обзор

Универсальная система контекста - это расширяемая архитектура для анализа контекста чата и определения релевантных медиа-файлов (изображения, видео, аудио) на основе сообщений пользователя.

## Архитектура

### Основные компоненты

```
src/lib/ai/context/
├── universal-context.ts          # Базовые типы и менеджер
├── image-context-analyzer.ts     # Анализатор для изображений
├── video-context-analyzer.ts     # Анализатор для видео
├── audio-context-analyzer.ts     # Анализатор для аудио
└── index.ts                      # Экспорты и инициализация
```

### Ключевые интерфейсы

#### `MediaContext`

```typescript
interface MediaContext {
  sourceUrl?: string; // URL исходного медиа
  sourceId?: string; // ID медиа в системе
  mediaType: MediaType; // Тип медиа (image/video/audio)
  confidence: ConfidenceLevel; // Уровень уверенности (high/medium/low)
  reasoning: string; // Объяснение выбора
  metadata?: Record<string, any>; // Дополнительные метаданные
}
```

#### `ChatMedia`

```typescript
interface ChatMedia {
  url: string; // URL медиа-файла
  id?: string; // ID файла
  role: "user" | "assistant"; // Роль отправителя
  timestamp: Date; // Время создания
  prompt?: string; // Описание/промпт
  messageIndex: number; // Индекс сообщения
  mediaType: MediaType; // Тип медиа
  metadata?: Record<string, any>; // Метаданные
}
```

## Принцип работы

### 1. Анализ контекста

Система анализирует сообщение пользователя в несколько этапов:

1. **Проверка текущего сообщения** - поиск медиа во вложениях
2. **Анализ истории чата** - извлечение всех медиа-файлов
3. **Паттерн-матчинг** - поиск явных ссылок на медиа
4. **Эвристический анализ** - определение намерений пользователя
5. **Fallback** - использование последнего медиа по умолчанию

### 2. Уровни уверенности

- **High** - медиа найдено в текущем сообщении или явная ссылка
- **Medium** - найдено по паттернам или эвристикам
- **Low** - используется последнее медиа как fallback

### 3. Поддерживаемые паттерны

#### Русские паттерны

- "это изображение", "этот ролик", "эта музыка"
- "сгенерированное видео", "загруженное аудио"
- "последнее изображение", "предыдущий ролик"
- "первое видео", "второй трек"
- "измени это изображение", "подправь этот ролик"

#### Image-to-Video паттерны (русские)

- "сделай видео из этого изображения"
- "оживи эту картинку", "анимируй это изображение"
- "создай ролик из этой картинки"
- "это изображение в видео"

#### Английские паттерны

- "this image", "that video", "this audio"
- "generated video", "uploaded audio"
- "last image", "previous video"
- "first audio", "second clip"
- "change this image", "fix this video"

#### Image-to-Video паттерны (английские)

- "make video from this image"
- "animate this picture", "bring this image to life"
- "create clip from this image"
- "this image as video"

## Использование

### Базовое использование

```typescript
import {
  analyzeImageContext,
  analyzeVideoContext,
  analyzeAudioContext,
} from "@/lib/ai/context";

// Анализ контекста для изображений
const imageContext = await analyzeImageContext(
  "измени это изображение",
  "chat-123",
  currentAttachments
);

// Анализ контекста для видео
const videoContext = await analyzeVideoContext(
  "подправь этот ролик",
  "chat-123",
  currentAttachments
);

// Анализ контекста для аудио
const audioContext = await analyzeAudioContext(
  "добавь музыку к этому аудио",
  "chat-123",
  currentAttachments
);
```

### Универсальная функция

```typescript
import { analyzeMediaContext } from "@/lib/ai/context";

const context = await analyzeMediaContext(
  "image", // или "video", "audio"
  "измени это изображение",
  "chat-123",
  currentAttachments
);
```

### Прямое использование менеджера

```typescript
import { contextManager } from "@/lib/ai/context";

// Получение всех медиа из чата
const chatMedia = await contextManager.getChatMedia("chat-123");

// Анализ контекста
const context = await contextManager.analyzeContext(
  "image",
  "измени это изображение",
  chatMedia,
  currentAttachments
);
```

## Интеграция с AI инструментами

### Обновленные инструменты

Система интегрирована с AI инструментами генерации:

- `configureImageGeneration` - генерация изображений
- `configureVideoGeneration` - генерация видео
- `configureAudioGeneration` - генерация аудио

### Передача параметров

```typescript
const tool = configureImageGeneration({
  createDocument: createDocumentFunction,
  session: userSession,
  chatId: "chat-123", // ID чата для анализа
  userMessage: "измени это изображение", // Сообщение пользователя
  currentAttachments: attachments, // Вложения текущего сообщения
  defaultSourceImageUrl: "legacy-url", // Legacy поддержка
});
```

## Расширение системы

### Добавление нового типа медиа

1. **Создать анализатор**:

```typescript
export class DocumentContextAnalyzer extends BaseContextAnalyzer {
  mediaType: MediaType = "document";

  getReferencePatterns(): ReferencePattern[] {
    return [
      // Паттерны для документов
    ];
  }

  // Реализовать остальные методы
}
```

2. **Зарегистрировать анализатор**:

```typescript
import { contextManager } from "@/lib/ai/context";
import { DocumentContextAnalyzer } from "./document-context-analyzer";

contextManager.registerAnalyzer(new DocumentContextAnalyzer());
```

3. **Добавить в экспорты**:

```typescript
// В index.ts
export { DocumentContextAnalyzer } from "./document-context-analyzer";
```

### Кастомизация паттернов

Каждый анализатор может определять свои паттерны:

```typescript
getReferencePatterns(): ReferencePattern[] {
  return [
    {
      pattern: /(этот|эта)\s+(документ|файл)/,
      weight: 0.9,
      description: "Прямая ссылка на документ",
      targetResolver: (message, media) => media[media.length - 1] || null,
    },
    // Другие паттерны...
  ];
}
```

## Преимущества новой системы

### 1. **Расширяемость**

- Легко добавлять новые типы медиа
- Модульная архитектура
- Переиспользование кода

### 2. **Консистентность**

- Единый API для всех типов медиа
- Стандартизированные интерфейсы
- Общие принципы работы

### 3. **Производительность**

- Кэширование результатов
- Оптимизированные запросы к БД
- Ленивая загрузка анализаторов

### 4. **Тестируемость**

- Изолированные компоненты
- Мокируемые зависимости
- Покрытие тестами

### 5. **Поддержка**

- Подробное логирование
- Обработка ошибок
- Fallback механизмы

## Миграция с старой системы

### Совместимость

Новая система полностью совместима со старой:

- Legacy параметры (`defaultSourceImageUrl`) поддерживаются
- Старые API продолжают работать
- Постепенная миграция возможна

### План миграции

1. **Фаза 1** - Внедрение новой системы (✅ Завершено)
2. **Фаза 2** - Обновление существующих инструментов
3. **Фаза 3** - Удаление legacy кода
4. **Фаза 4** - Оптимизация и тестирование

## Примеры использования

### Сценарий 1: Редактирование изображения

```typescript
// Пользователь: "сделай глаза голубыми"
const context = await analyzeImageContext("сделай глаза голубыми", "chat-123");

// Результат:
// {
//   sourceUrl: "https://example.com/last-image.jpg",
//   confidence: "medium",
//   reasoning: "контекст редактирования - используется последнее сгенерированное изображение"
// }
```

### Сценарий 2: Обработка видео

```typescript
// Пользователь: "добавь музыку к этому ролику"
const context = await analyzeVideoContext(
  "добавь музыку к этому ролику",
  "chat-123"
);

// Результат:
// {
//   sourceUrl: "https://example.com/video.mp4",
//   confidence: "high",
//   reasoning: "Найдена ссылка на видео: Найдено совпадение с паттерном: /(это|этот)\\s+(видео|ролик|фильм|клип)/"
// }
```

### Сценарий 2.1: Image-to-Video генерация

```typescript
// Пользователь: "сделай видео из этого изображения"
const context = await analyzeVideoContext(
  "сделай видео из этого изображения",
  "chat-123"
);

// Результат:
// {
//   sourceUrl: "https://example.com/image.jpg",
//   confidence: "high",
//   reasoning: "Найдена ссылка на изображение для создания видео: Найдено совпадение с паттерном: /(сделай|создай|сгенерируй)\\s+(видео|ролик|фильм|клип)\\s+(из|на\\s+основе|по)\\s+(этого|этого\\s+изображения|этой\\s+картинки)/"
// }
```

### Сценарий 2.2: Анимация изображения

```typescript
// Пользователь: "оживи эту картинку"
const context = await analyzeVideoContext("оживи эту картинку", "chat-123");

// Результат:
// {
//   sourceUrl: "https://example.com/picture.png",
//   confidence: "high",
//   reasoning: "Найдена ссылка на изображение для анимации: Найдено совпадение с паттерном: /(оживи|анимируй|сделай\\s+движущимся)\\s+(это|это\\s+изображение|эту\\s+картинку)/"
// }
```

### Сценарий 3: Генерация аудио

```typescript
// Пользователь: "озвучь этот текст"
const context = await analyzeAudioContext("озвучь этот текст", "chat-123");

// Результат:
// {
//   sourceUrl: undefined,
//   confidence: "low",
//   reasoning: "В истории чата не найдено audio файлов"
// }
```

## Статус реализации

### ✅ **Полностью реализовано:**

- **Изображения** - полная интеграция с `configureImageGeneration`
- **Видео** - полная интеграция с `configureVideoGeneration`
  - ✅ **Video-to-Video** - редактирование существующих видео
  - ✅ **Image-to-Video** - создание видео из изображений
  - ✅ **Text-to-Video** - генерация видео из текста
- **Аудио** - полная интеграция с `configureAudioGeneration`
- **Универсальная система** - все анализаторы зарегистрированы и работают
- **Конфигурации** - все типы медиа поддерживаются в `media-settings-factory.ts`
- **Типы** - полная типизация для всех конфигураций

### 🎯 **Готово к использованию:**

```typescript
// Все инструменты уже интегрированы с новой системой контекста
import {
  configureImageGeneration,
  configureVideoGeneration,
  configureAudioGeneration,
} from "@/lib/ai/tools";

// Использование с контекстом
const imageTool = configureImageGeneration({
  createDocument: createDocumentFunction,
  session: userSession,
  chatId: "chat-123", // ✅ Поддерживается
  userMessage: "измени это изображение", // ✅ Поддерживается
  currentAttachments: attachments, // ✅ Поддерживается
});

const videoTool = configureVideoGeneration({
  createDocument: createDocumentFunction,
  session: userSession,
  chatId: "chat-123", // ✅ Поддерживается
  userMessage: "добавь музыку к этому ролику", // ✅ Поддерживается
  currentAttachments: attachments, // ✅ Поддерживается
});

const audioTool = configureAudioGeneration({
  createDocument: createDocumentFunction,
  session: userSession,
  chatId: "chat-123", // ✅ Поддерживается
  userMessage: "озвучь этот текст", // ✅ Поддерживается
  currentAttachments: attachments, // ✅ Поддерживается
});
```

## Заключение

Универсальная система контекста обеспечивает:

- **Единообразный подход** к анализу контекста для всех типов медиа
- **Высокую точность** определения намерений пользователя
- **Легкую расширяемость** для новых типов контента
- **Обратную совместимость** с существующими системами
- **Полную интеграцию** со всеми AI инструментами генерации

Система полностью готова к использованию и уже интегрирована во все AI инструменты генерации медиа-контента! 🎉
