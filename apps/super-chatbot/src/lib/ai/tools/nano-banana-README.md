# Nano Banana Tools - Gemini-2.5-Flash-Image Integration

## Обзор

Набор инструментов для работы с Gemini-2.5-Flash-Image (Nano Banana) - революционной моделью Google для генерации и редактирования изображений.

## Инструменты

### 1. nanoBananaImageGeneration

- **Файл**: `nano-banana-image-generation.ts`
- **Назначение**: Генерация изображений (text-to-image, image-to-image)
- **Особенности**: 30+ стилей, 4 уровня качества, контекстное понимание

### 2. nanoBananaImageEditing

- **Файл**: `nano-banana-image-editing.ts`
- **Назначение**: Редактирование существующих изображений
- **Типы**: Замена фона, добавление/удаление объектов, перенос стиля и др.

### 3. nanoBananaPromptEnhancer

- **Файл**: `nano-banana-prompt-enhancer.ts`
- **Назначение**: Улучшение промптов специально для Nano Banana
- **Техники**: Контекстная осведомленность, хирургическая точность, физическая логика

### 4. nanoBananaStyleGuide

- **Файл**: `nano-banana-style-guide.ts`
- **Назначение**: Руководство по стилям и техникам из awesome-nano-banana
- **Содержание**: Примеры, советы, категории стилей

## API Эндпоинты

- `POST /api/nano-banana/generate` - Генерация изображений
- `POST /api/nano-banana/edit` - Редактирование изображений
- `POST /api/nano-banana/enhance-prompt` - Улучшение промптов
- `POST /api/nano-banana/style-guide` - Руководство по стилям

## Интеграция

Все инструменты интегрированы в основной чат роут (`/api/chat/route.ts`) и доступны через:

1. **AI инструменты** - Автоматический выбор подходящего инструмента
2. **API эндпоинты** - Прямой программный доступ
3. **Контекстный анализ** - Умное определение типа операции

## Уникальные возможности Nano Banana

- 🎯 **Контекстно-осознанное редактирование** - Понимает отношения между объектами
- 🔧 **Хирургическая точность** - Точное добавление/удаление объектов
- 🧠 **Физическая логика** - Понимает физические свойства материалов
- 💡 **Интеллектуальное освещение** - Автоматическая коррекция освещения

## Использование

```typescript
// Генерация изображения
await nanoBananaImageGeneration().execute({
  prompt: "Beautiful sunset over mountains",
  style: "cinematic",
  quality: "high",
});

// Редактирование изображения
await nanoBananaImageEditing().execute({
  editType: "background-replacement",
  editPrompt: "Replace with beach scene",
  sourceImageUrl: "https://example.com/image.jpg",
});

// Улучшение промпта
await nanoBananaPromptEnhancer.execute({
  originalPrompt: "красивый закат",
  enhancementTechnique: "context-awareness",
});
```

## Документация

Подробная документация доступна в `docs/ai-capabilities/nano-banana-tools.md`
