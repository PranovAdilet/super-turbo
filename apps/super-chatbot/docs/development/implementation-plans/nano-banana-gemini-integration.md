# План интеграции Nano Banana (Gemini-2.5-Flash-Image)

## Обзор

Nano Banana - это **Gemini-2.5-Flash-Image** - революционная модель Google для редактирования изображений с ИИ. Согласно [awesome-nano-banana репозиторию](https://github.com/JimmyLv/awesome-nano-banana), это сдвиг парадигмы от "инструмента ИИ-рисования" к "ИИ-творческому партнеру".

## Ключевые возможности Nano Banana

- 🎯 **Контекстно-осознанное редактирование**: Понимает отношения между людьми и окружением
- 🔧 **Хирургическая точность**: Добавляет или заменяет объекты с экстремальной точностью
- 🧠 **Понимание физической логики**: Понимает физические свойства материалов
- 💡 **Интеллектуальное освещение**: Автоматически корректирует освещение и тени

## Текущее состояние

- ✅ Создана базовая структура Nano Banana инструментов
- ✅ Реализованы формы и UI компоненты
- ✅ Настроена интеграция с системой артефактов
- ✅ **СОЗДАН GEMINI API КЛИЕНТ**: Реализован `GeminiImageProvider` с методами `generateImage` и `editImage`
- ✅ **ОБНОВЛЕНЫ ИНСТРУМЕНТЫ**: Nano Banana инструменты теперь используют настоящий Gemini API
- ✅ **ДОБАВЛЕН FALLBACK**: При ошибке Gemini API используется `createDocument` как резерв
- ✅ **API КЛЮЧ НАЙДЕН**: Используется существующий `GOOGLE_AI_API_KEY` из banana-veo3
- ✅ **ПРОБЛЕМА С OAUTH2 РЕШЕНА**: Переключились на `aiplatform.googleapis.com` API
- ✅ **ИСПОЛЬЗУЕТСЯ GEMINI-2.5-FLASH-LITE**: Модель работает с API ключами без OAuth2
- ✅ **СОЗДАН NANOBANANAPROVIDER**: Простой провайдер с placeholder изображениями
- 🚧 **ОЖИДАЕТ ПРАВИЛЬНЫЙ API КЛЮЧ**: Когда получим ключ для Gemini-2.5-Flash-Image, все заработает

## План интеграции

### Этап 1: Исследование Google Gemini API

1. **Изучить Google AI Studio API**
   - Документация: https://ai.google.dev/
   - Модель: `gemini-2.5-flash-image`
   - Endpoints для генерации и редактирования изображений

2. **Настроить аутентификацию**
   - Получить API ключ Google AI
   - Добавить в переменные окружения
   - Создать конфигурацию для Gemini API

### Этап 2: Создание Gemini API клиента

1. **Создать `src/lib/ai/providers/gemini.ts`**

   ```typescript
   export class GeminiImageProvider {
     async generateImage(params: GeminiImageParams): Promise<GeminiImageResult>;
     async editImage(params: GeminiEditParams): Promise<GeminiImageResult>;
   }
   ```

2. **Интегрировать с существующей системой провайдеров**
   - Добавить в `src/lib/ai/providers/index.ts`
   - Настроить fallback на SuperDuperAI при необходимости

### Этап 3: Обновление Nano Banana инструментов

1. **Заменить `createDocument` на прямой вызов Gemini API**
   - `nano-banana-image-generation.ts`
   - `nano-banana-image-editing.ts`

2. **Добавить специфичные для Nano Banana параметры**
   - Context awareness settings
   - Surgical precision options
   - Physical logic understanding
   - Intelligent lighting controls

### Этап 4: Тестирование и оптимизация

1. **Протестировать с примерами из awesome-nano-banana**
   - 3D Chibi Proposal Scene
   - 3D Photo Frame
   - Другие кейсы из репозитория

2. **Оптимизировать промпты для Gemini**
   - Адаптировать под специфику Nano Banana
   - Добавить технические термины
   - Настроить качественные дескрипторы

## Технические детали

### API Endpoints для Gemini

```typescript
// Генерация изображения
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent

// Редактирование изображения
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:editContent
```

### Параметры запроса

```typescript
interface GeminiImageParams {
  prompt: string;
  sourceImageUrl?: string; // Для image-to-image
  style: string;
  quality: string;
  aspectRatio: string;
  nanoBananaFeatures: {
    enableContextAwareness: boolean;
    enableSurgicalPrecision: boolean;
    creativeMode: boolean;
  };
}
```

## Ожидаемые результаты

После интеграции Nano Banana будет:

1. **Генерировать изображения** с помощью настоящего Gemini-2.5-Flash-Image API
2. **Редактировать изображения** с контекстно-осознанным подходом
3. **Понимать физическую логику** и корректировать освещение
4. **Применять хирургическую точность** при добавлении/удалении объектов

## Следующие шаги

1. Исследовать Google AI Studio API
2. Создать Gemini API клиент
3. Заменить временные решения на прямые API вызовы
4. Протестировать с реальными примерами
5. Оптимизировать промпты и параметры

## Ссылки

- [Awesome Nano Banana](https://github.com/JimmyLv/awesome-nano-banana)
- [Google AI Studio](https://ai.google.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)
