# 🚀 Развертывание Хинкальмании как Telegram Mini App

## 📋 Пошаговое руководство

### 1. Подготовка проекта

```bash
# Клонирование и установка
git clone <your-repo>
cd hinkalmania-tg
npm install

# Тестирование локально
npm start
```

### 2. Создание Telegram бота

1. **Обратитесь к @BotFather в Telegram**
2. **Создайте нового бота:**
   ```
   /newbot
   ```
   - Имя: `Хинкальмания`
   - Username: `hinkalmania_bot` (или другой доступный)

3. **Сохраните токен бота** - понадобится позже

### 3. Развертывание фронтенда

#### Вариант A: Vercel (Рекомендуется)

1. **Подключите репозиторий к Vercel:**
   - Зайдите на [vercel.com](https://vercel.com)
   - Подключите GitHub/GitLab аккаунт
   - Импортируйте ваш репозиторий

2. **Настройте проект:**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Получите URL развертывания:**
   - Пример: `https://hinkalmania-tg.vercel.app`

#### Вариант B: Netlify

1. **Подключите репозиторий:**
   - Зайдите на [netlify.com](https://netlify.com)
   - New site from Git
   - Выберите ваш репозиторий

2. **Настройки сборки:**
   - Build command: `npm run build`
   - Publish directory: `build`

#### Вариант C: GitHub Pages

1. **Установите gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Добавьте в package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/hinkalmania-tg",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Развертывание:**
   ```bash
   npm run deploy
   ```

### 4. Настройка Web App в Telegram

1. **Создайте Web App через BotFather:**
   ```
   /newapp
   ```

2. **Заполните информацию:**
   - **Бот:** Выберите вашего бота
   - **Title:** Хинкальмания  
   - **Description:** Собирай кавказские блюда и становись лучшим поваром! 🥟
   - **Photo:** Загрузите иконку игры (512x512px)
   - **URL:** `https://your-deployed-url.com`

3. **Настройте описания бота:**
   ```
   /setdescription
   ```
   ```
   🥟 Хинкальмания - увлекательная игра где кавказец собирает традиционные блюда!

   🎮 Особенности:
   • Собирай хинкали, шаурму, шашлык и кебаб
   • Покупай уникальные скины персонажей  
   • Зарабатывай монеты и ставь рекорды
   • Играй прямо в Telegram!

   Нажми /start чтобы начать играть!
   ```

4. **Короткое описание:**
   ```
   /setabouttext
   ```
   ```
   🥟 Собирай кавказские блюда в увлекательной игре! Играй прямо в Telegram.
   ```

### 5. Создание простого бота (опционально)

Создайте файл `bot.js` для обработки команд:

```javascript
const TelegramBot = require('node-telegram-bot-api');

const token = 'YOUR_BOT_TOKEN';
const webAppUrl = 'https://your-deployed-url.com';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'друг';
  
  const welcomeMessage = `
🥟 Добро пожаловать в Хинкальманию, ${firstName}!

Собирай кавказские блюда, зарабатывай монеты и покупай уникальные скины!

🎮 Готов начать? Нажми кнопку ниже! 👇
  `;

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🎮 Играть в Хинкальманию',
          web_app: { url: webAppUrl }
        }]
      ]
    }
  });
});

console.log('🤖 Бот запущен!');
```

### 6. Развертывание бота (если создали)

#### На Heroku:
```bash
# Установите Heroku CLI
npm install -g heroku

# Логин и создание приложения
heroku login
heroku create hinkalmania-bot

# Настройка переменных
heroku config:set BOT_TOKEN=your_bot_token
heroku config:set WEB_APP_URL=https://your-deployed-url.com

# Деплой
git add .
git commit -m "Deploy bot"
git push heroku main
```

#### На Railway:
1. Подключите репозиторий к [railway.app](https://railway.app)
2. Добавьте переменные окружения:
   - `BOT_TOKEN=your_bot_token`
   - `WEB_APP_URL=https://your-deployed-url.com`

### 7. Тестирование

1. **Найдите вашего бота в Telegram**
2. **Отправьте `/start`**
3. **Нажмите "Играть в Хинкальманию"**
4. **Проверьте все функции:**
   - Игровой процесс
   - Сохранение прогресса
   - Магазин и покупки
   - Настройки
   - Хаптик-отзывы

### 8. Оптимизация для Telegram

#### Настройка домена (опционально):
```
/setdomain
```
Добавьте ваш домен для лучшей производительности

#### Настройка платежей (для монетизации):
```
/mybots → выберите бота → Payments
```

#### Включение инлайн-режима:
```
/setinline
/setinlinefeedback
```

### 9. Мониторинг и аналитика

1. **Добавьте Google Analytics (опционально)**
2. **Настройте Telegram Analytics через @BotFather**
3. **Отслеживайте метрики:**
   - Количество игроков
   - Время в игре
   - Конверсия в покупки

### 10. Обновления

```bash
# Обновление фронтенда
git add .
git commit -m "Update game"
git push origin main

# Vercel автоматически обновит приложение
# Для других платформ следуйте их инструкциям
```

## 🔧 Troubleshooting

### Частые проблемы:

1. **Web App не загружается:**
   - Проверьте HTTPS (обязательно для Telegram)
   - Убедитесь что URL корректный
   - Проверьте Console в DevTools

2. **Хаптик не работает:**
   - Работает только в Telegram
   - Проверьте `window.Telegram?.WebApp`

3. **Сохранение не работает:**
   - localStorage может быть ограничен
   - Проверьте настройки браузера

4. **Игра тормозит:**
   - Оптимизируйте анимации
   - Уменьшите количество элементов
   - Добавьте `will-change: transform`

## 📞 Поддержка

- **Документация Telegram:** [core.telegram.org/bots/webapps](https://core.telegram.org/bots/webapps)
- **Примеры:** [github.com/TelegramApps](https://github.com/TelegramApps)
- **Чат разработчиков:** [@BotDevelopers](https://t.me/BotDevelopers)

---

🎉 **Поздравляем! Ваша Telegram Mini App готова!** 

Теперь миллионы пользователей Telegram могут играть в Хинкальманию прямо в мессенджере! 🥟