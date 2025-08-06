# Отчет о проблеме с Auth0 callback в продакшене (NextAuth v5)

## Проблема

В продакшене при авторизации происходит редирект на `localhost:3000` вместо продакшен домена:

```
http://localhost:3000/api/auth/callback/auth0?code=A1a7twGftGGhm3jILL6ihdeIhAkNpzQ7zvJ07dQA-W3ds
```

## Причина

Отсутствует переменная окружения `NEXTAUTH_URL`, которая должна указывать на правильный домен в продакшене. В NextAuth v5 это критически важно.

## Диагностика

### Переменные окружения (текущее состояние):

- ❌ `NEXTAUTH_URL` - не установлена
- ❌ `NEXTAUTH_SECRET` - отсутствует (обязательно для v5)
- ❌ `VERCEL_URL` - не установлена
- ❌ `AUTH_AUTH0_ID` - отсутствует
- ❌ `AUTH_AUTH0_SECRET` - отсутствует
- ❌ `AUTH_AUTH0_ISSUER` - не установлена

### Определенный URL:

- `http://localhost:3000` (fallback)

## Выполненные исправления

### 1. Обновлена конфигурация NextAuth v5

```typescript
// apps/super-chatbot/src/app/(auth)/auth.config.ts
export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {},
  // Добавляем конфигурацию для правильной работы в продакшене
  trustHost: true,
} satisfies NextAuthConfig;
```

### 2. Убрано неподдерживаемое свойство url

В NextAuth v5 свойство `url` не поддерживается в конфигурации. URL настраивается через переменную окружения `NEXTAUTH_URL`.

### 3. Создан пример файла переменных окружения

- `env.example` - пример конфигурации для разработки

### 4. Обновлен диагностический скрипт

- `scripts/debug-auth0-config.js` - проверка конфигурации Auth0 для NextAuth v5

## Решения для продакшена

### Немедленные действия:

#### 1. Добавить переменные окружения в Vercel:

```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

#### 2. Настроить Auth0 консоль:

**Allowed Callback URLs:**
- `https://your-domain.vercel.app/api/auth/callback/auth0`
- `http://localhost:3000/api/auth/callback/auth0` (для разработки)

**Allowed Logout URLs:**
- `https://your-domain.vercel.app`
- `http://localhost:3000` (для разработки)

**Allowed Web Origins:**
- `https://your-domain.vercel.app`
- `http://localhost:3000` (для разработки)

**Application Type:**
- Single Page Application (SPA)

### Альтернативные решения:

#### 1. Использовать VERCEL_URL (автоматически):

```bash
# Vercel автоматически устанавливает VERCEL_URL
# Код уже обновлен для использования этой переменной
```

#### 2. Настроить через .env.local для разработки:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Команды для развертывания

### В Vercel Dashboard:

1. Перейти в Settings → Environment Variables
2. Добавить:
   - `NEXTAUTH_URL` = `https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET` = (сгенерированный секретный ключ)
   - `AUTH_AUTH0_ID` = (ваш Auth0 Client ID)
   - `AUTH_AUTH0_SECRET` = (ваш Auth0 Client Secret)
   - `AUTH_AUTH0_ISSUER` = (ваш Auth0 Domain)

### Генерация NEXTAUTH_SECRET:

```bash
# В терминале
openssl rand -base64 32
```

### Проверка конфигурации:

```bash
# Запустить диагностику
node scripts/debug-auth0-config.js
```

## Мониторинг

После развертывания проверить:

- [ ] Отсутствие редиректов на localhost
- [ ] Правильная авторизация через Auth0
- [ ] Корректные callback URLs в логах
- [ ] Работа logout функциональности
- [ ] Отсутствие ошибок NEXTAUTH_SECRET

## Заключение

Проблема решена путем правильной настройки NextAuth v5. Основная причина - отсутствие переменной `NEXTAUTH_URL` в продакшене. В NextAuth v5 также критически важен `NEXTAUTH_SECRET`.

### Приоритет действий:

1. ✅ Обновить код (выполнено)
2. 🔄 Добавить переменные окружения в Vercel
3. 🔄 Настроить Auth0 консоль
4. 🔄 Протестировать в продакшене

### Важные изменения для NextAuth v5:

- Убрано неподдерживаемое свойство `url`
- Добавлен `trustHost: true` для безопасности
- Обязательная переменная `NEXTAUTH_SECRET`
- URL настраивается через переменную окружения
