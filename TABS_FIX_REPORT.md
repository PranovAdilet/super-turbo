# 🔧 Исправление компонента Tabs

## Проблема

Активные вкладки в компоненте Tabs не отображались с правильными цветами. Выбранная вкладка не была визуально выделена.

## Причина

1. **Неправильные CSS селекторы** - использовались `[data-radix-tabs-trigger][data-state=active]` вместо правильных селекторов
2. **Недостаточная специфичность** - стили не переопределяли базовые стили компонента
3. **Отсутствие `!important`** - стили не имели приоритета

## Решение

### 1. Исправлены CSS селекторы

**Было:**

```css
[data-radix-tabs-trigger][data-state="active"] {
  @apply bg-accent text-accent-foreground shadow;
}
```

**Стало:**

```css
button[data-state="active"],
[role="tab"][data-state="active"] {
  @apply bg-accent text-accent-foreground shadow !important;
}
```

### 2. Добавлены стили для каждого проекта

#### Super Chatbot (нейтральные цвета)

```css
/* Табы с нейтральными цветами для chatbot */
button[data-state="active"],
[role="tab"][data-state="active"] {
  @apply bg-background text-foreground shadow !important;
  border: 1px solid hsl(var(--border));
}

/* Контейнер табов */
[role="tablist"] {
  @apply bg-muted border border-border rounded-lg;
}
```

#### Super Landing (зеленые акценты)

```css
/* Табы с accent цветом для landing */
button[data-state="active"],
[role="tab"][data-state="active"] {
  @apply bg-accent text-accent-foreground shadow !important;
}

/* Контейнер табов */
[role="tablist"] {
  @apply bg-muted border border-border rounded-lg;
}
```

### 3. Улучшена специфичность

- Добавлены множественные селекторы для покрытия разных случаев
- Использован `!important` для переопределения базовых стилей
- Добавлены стили для контейнера табов

## 📊 Результат

### ✅ Super Chatbot:

- **Активные табы:** Белый фон с серой границей
- **Контейнер:** Серый фон с границей
- **Стиль:** Минималистичный, профессиональный

### ✅ Super Landing:

- **Активные табы:** Зеленый фон (accent цвет)
- **Контейнер:** Серый фон с границей
- **Стиль:** Яркий, современный

## 🔧 Технические детали

### Используемые селекторы:

- `button[data-state="active"]` - для кнопок-табов
- `[role="tab"][data-state="active"]` - для элементов с ролью tab
- `[role="tablist"]` - для контейнера табов

### Tailwind классы:

- `bg-background` / `bg-accent` - фон активной вкладки
- `text-foreground` / `text-accent-foreground` - цвет текста
- `shadow` - тень для выделения
- `border` - граница для chatbot

## 🚀 Следующие шаги

1. **Перезапустить приложения** - `pnpm dev`
2. **Проверить Tabs** в каждом проекте
3. **Убедиться** что активные вкладки подсвечиваются
4. **Протестировать** переключение между вкладками

Теперь активные вкладки должны быть четко видны в обоих проектах! 🎯
