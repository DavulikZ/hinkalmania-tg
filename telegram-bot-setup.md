# 🤖 Настройка Telegram Bot для Хинкальмании

## 📋 Создание бота

### 1. Создайте бота через BotFather

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Дайте имя боту: `Хинкальмания`
4. Дайте username боту: `hinkalmania_bot` (или любой доступный)
5. Сохраните полученный токен бота

### 2. Настройте Web App

1. Отправьте команду `/mybots` в BotFather
2. Выберите своего бота
3. Нажмите "Bot Settings" → "Menu Button"
4. Выберите "Configure menu button"
5. Введите:
   - **Text**: `🥟 Играть`
   - **URL**: `https://your-domain.com` (замените на ваш домен)

### 3. Настройте описание бота

```
/setdescription
Хинкальмания - захватывающая игра! 🥟

Собирай кавказские блюда и зарабатывай монеты!
- 4 вида еды: хинкали, шаурма, шашлык, кебаб
- Система скинов персонажей
- Оффлайн игра прямо в Telegram

Нажми кнопку меню для начала игры! 🎮
```

### 4. Настройте короткое описание

```
/setabouttext
🥟 Собирай кавказские блюда в увлекательной игре! Хинкали, шаурма, шашлык и кебаб ждут тебя!
```

### 5. Добавьте команды

```
/setcommands

start - 🎮 Начать игру
play - 🥟 Играть в Хинкальманию
help - ❓ Помощь
stats - 📊 Статистика
```

## 🚀 Развертывание веб-приложения

### Рекомендуемые платформы:

#### 1. Netlify (Простое развертывание)
```bash
# Соберите проект
npm run build

# Загрузите папку build на Netlify
# Или подключите GitHub репозиторий для автодеплоя
```

#### 2. Vercel
```bash
npm install -g vercel
vercel --prod
```

#### 3. GitHub Pages
```bash
npm install --save-dev gh-pages

# Добавьте в package.json:
"homepage": "https://yourusername.github.io/hinkalmania-tg",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

npm run deploy
```

#### 4. Собственный сервер
```bash
# Соберите проект
npm run build

# Скопируйте папку build на ваш сервер
# Настройте веб-сервер (nginx/apache) для обслуживания файлов
```

## 🛠️ Пример кода бота (Node.js)

```javascript
const TelegramBot = require('node-telegram-bot-api');

const token = 'YOUR_BOT_TOKEN';
const webAppUrl = 'https://your-domain.com';

const bot = new TelegramBot(token, {polling: true});

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    `🥟 Добро пожаловать в Хинкальманию!\n\n` +
    `Собирай кавказские блюда и зарабатывай монеты!\n\n` +
    `Нажми кнопку ниже чтобы начать игру 👇`, 
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🎮 Играть',
            web_app: { url: webAppUrl }
          }
        ]]
      }
    }
  );
});

// Команда /play
bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    `🎮 Время играть в Хинкальманию!`, 
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🥟 Открыть игру',
            web_app: { url: webAppUrl }
          }
        ]]
      }
    }
  );
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId,
    `🎮 Как играть в Хинкальманию:\n\n` +
    `🥟 Собирай падающие блюда\n` +
    `💰 Зарабатывай монеты и очки\n` +
    `🛒 Покупай новые скины в магазине\n` +
    `🔓 Разблокируй новые виды еды\n\n` +
    `Управление: перемещай курсор или палец по экрану\n\n` +
    `Удачи в игре! 🍀`
  );
});

console.log('Бот запущен...');
```

## 🔧 Настройка HTTPS

**Важно!** Telegram Web Apps работают только по HTTPS.

### Для разработки:
```bash
# Используйте ngrok для локального тестирования
npm install -g ngrok
npm start  # запустите приложение
# В новом терминале:
ngrok http 3000
# Используйте https URL из ngrok
```

### Для продакшена:
- Убедитесь что ваш домен имеет SSL сертификат
- Используйте Let's Encrypt для бесплатных сертификатов

## 📱 Тестирование

1. Найдите вашего бота в Telegram
2. Отправьте `/start`
3. Нажмите кнопку "🎮 Играть"
4. Игра должна открыться в Web App

## 🔍 Отладка

### Проверьте в DevTools:
```javascript
// В консоли браузера проверьте Telegram WebApp
console.log(window.Telegram.WebApp);
console.log(window.Telegram.WebApp.initData);
```

### Проблемы и решения:

**Игра не открывается:**
- Проверьте HTTPS
- Убедитесь что URL правильный в BotFather

**Telegram API не работает:**
- Проверьте что скрипт telegram-web-app.js загружен
- Откройте игру именно через бота, а не напрямую

**Тормозит на мобильных:**
- Оптимизируйте анимации
- Уменьшите количество DOM элементов

## 📊 Аналитика

Добавьте отслеживание событий:

```javascript
// В коде игры
if (window.Telegram?.WebApp?.sendData) {
  // Отправка данных боту
  window.Telegram.WebApp.sendData(JSON.stringify({
    action: 'game_finished',
    score: finalScore,
    coins: earnedCoins
  }));
}
```

## 💡 Дополнительные возможности

### 1. Реферальная система
- Добавьте параметры в URL: `?ref=user123`
- Отслеживайте приглашения

### 2. Лидерборд
- Интегрируйте с базой данных
- Показывайте топ игроков

### 3. Ежедневные награды
- Проверяйте последний вход
- Давайте бонусы за активность

---

**Готово! Ваша игра теперь доступна как Telegram Mini App! 🚀**