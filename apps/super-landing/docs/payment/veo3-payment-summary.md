# VEO3 Payment Flow - Краткая сводка

## 🚀 Быстрый обзор процесса

### До оплаты:

1. **Пользователь заполняет форму** → промпт + количество видео
2. **Создается Stripe сессия** → данные сохраняются в Redis
3. **Редирект на Stripe** → пользователь оплачивает

### Во время оплаты:

4. **Stripe webhook** → `checkout.session.completed`
5. **Backend получает данные** из Redis
6. **Запускается генерация** через SuperDuperAI API
7. **Получается fileId** и сохраняется в Redis

### После оплаты:

8. **Success page** → polling статуса каждые 2 сек
9. **Авторедирект** на `/file/{fileId}` при получении fileId
10. **File status page** → polling каждые 5 сек до готовности
11. **Скачивание** готового видео

## 📁 Ключевые файлы

| Файл                                                | Назначение             |
| --------------------------------------------------- | ---------------------- |
| `src/app/api/create-checkout/route.ts`              | Создание Stripe сессии |
| `src/app/api/webhooks/stripe/route.ts`              | Обработка webhook'ов   |
| `src/app/api/webhook-status/[sessionId]/route.ts`   | Проверка статуса       |
| `src/app/api/file/[id]/route.ts`                    | Получение файла        |
| `src/components/payment/payment-success-client.tsx` | Success page           |
| `src/components/file/file-status-client.tsx`        | File status page       |

## 🔄 URL Flow

```
1. /tool/veo3-prompt-generator (форма)
2. https://checkout.stripe.com/pay/cs_xxx (оплата)
3. /payment-success/cs_xxx (success page)
4. /file/{fileId} (статус файла)
```

## ⏱️ Временные рамки

| Этап              | Время       |
| ----------------- | ----------- |
| Оплата            | 10-30 сек   |
| Webhook обработка | 5-15 сек    |
| Генерация видео   | 2-5 мин     |
| **Общий процесс** | **3-6 мин** |

## 🛡️ Безопасность

- **Stripe signature verification** для webhook'ов
- **UUID validation** для fileId
- **Session ID format** проверка (cs_xxx)
- **Таймауты** на все API вызовы

## 🔧 Fallback механизмы

- **Polling** если webhook не доставлен
- **Ручной поиск** по sessionId: `/session/{sessionId}`
- **Dev режим** просмотр всех файлов: `/dev/files`
- **Копирование sessionId** для поддержки

## 📊 Статусы

### Redis статусы:

- `pending` → `processing` → `completed`/`error`

### SuperDuperAI статусы:

- `pending` → `in_progress` → `completed`/`failed`

## 🚨 Критические точки

1. **Webhook timeout**: 15 секунд
2. **UI polling timeout**: 60 секунд
3. **Video generation**: до 10 минут максимум
4. **Redis недоступность** → критическая ошибка

## 🔍 Отладка

### Логи:

```bash
grep "Stripe webhook event" logs
grep "SuperDuperAI video generation" logs
grep "❌" logs
```

### Redis:

```bash
redis-cli get "session:cs_xxx"
```

### SuperDuperAI:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.superduperai.com/api/v1/file/{fileId}"
```

## 💡 Основные принципы

1. **Все данные в Redis** - не полагаемся на Stripe metadata
2. **Polling как fallback** - если webhook не доставлен
3. **Автоматические редиректы** - минимальное взаимодействие пользователя
4. **Детальное логирование** - для отладки и мониторинга
5. **Graceful degradation** - fallback опции при ошибках
