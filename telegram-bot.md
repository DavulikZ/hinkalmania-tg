# 🤖 Настройка Telegram Bot для Mini App "Хинкальмания"

## 1. Создание бота

1. Найдите в Telegram [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Введите имя бота: `Хинкальмания`
4. Введите username бота: `hinkalmania_bot` (или любой доступный)
5. Сохраните полученный токен бота

## 2. Настройка Web App

После создания бота отправьте BotFather следующие команды:

### Установка меню бота
```
/setcommands
```
Выберите вашего бота и введите:
```
start - 🎮 Запустить игру
help - ℹ️ Помощь
play - 🥟 Играть в Хинкальманию
```

### Настройка Web App
```
/newapp
```
Выберите вашего бота и заполните:
- **Title:** Хинкальмания
- **Description:** Собирай кавказские блюда и становись лучшим поваром! 🥟
- **Photo:** Загрузите иконку игры (512x512px)
- **GIF:** Загрузите превью игры (опционально)
- **URL:** `https://yourdomain.com` (замените на ваш домен)

### Настройка описания бота
```
/setdescription
```
Введите:
```
🥟 Хинкальмания - увлекательная игра где кавказец собирает традиционные блюда!

🎮 Особенности:
• Собирай хинкали, шаурму, шашлык и кебаб
• Покупай уникальные скины персонажей
• Зарабатывай монеты и ставь рекорды
• Играй прямо в Telegram!

Нажми /start чтобы начать играть!
```

### Настройка короткого описания
```
/setabouttext
```
Введите:
```
🥟 Собирай кавказские блюда в увлекательной игре! Играй прямо в Telegram.
```

### Настройка фото профиля
```
/setuserpic
```
Загрузите квадратную иконку игры

## 3. Код бота (Node.js)

Создайте простого бота для запуска Mini App:

```javascript
const TelegramBot = require('node-telegram-bot-api');

// Замените на ваш токен от BotFather
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});

// URL вашего Web App
const webAppUrl = 'https://yourdomain.com';

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'друг';
  
  const welcomeMessage = `
🥟 Добро пожаловать в Хинкальманию, ${firstName}!

Собирай кавказские блюда, зарабатывай монеты и покупай уникальные скины!

🎮 Особенности игры:
• 4 вида традиционных блюд
• 5 уникальных персонажей
• Система монет и рекордов
• Красивая анимация

Готов начать? Нажми кнопку "Играть" ниже! 👇
  `;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎮 Играть в Хинкальманию',
            web_app: { url: webAppUrl }
          }
        ],
        [
          {
            text: '📱 Поделиться с друзьями',
            switch_inline_query: 'Играю в Хинкальманию! 🥟 Собираю кавказские блюда прямо в Telegram!'
          }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});

// Обработка команды /play
bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;
  
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🥟 Запустить игру',
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '🎮 Запускаем Хинкальманию!', options);
});

// Обработка команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
🆘 Помощь по игре "Хинкальмания"

🎯 Цель игры:
Собирай падающие кавказские блюда и зарабатывай очки!

🕹️ Управление:
• Перемещай курсор/палец для движения персонажа
• Касайся еды чтобы собрать её
• Зарабатывай монеты за каждое собранное блюдо

🍽️ Виды еды:
🥟 Хинкали - 10 очков, 2 монеты
🥙 Шаурма - 15 очков, 3 монеты  
🍖 Шашлык - 20 очков, 4 монеты
🥪 Кебаб - 25 очков, 5 монет

💰 Магазин:
• Покупай новые скины персонажей
• Разблокируй новые виды еды
• Тратьте заработанные монеты

🏆 Рекорды:
Побивай свои рекорды и соревнуйся с друзьями!

Есть вопросы? Пиши @your_username
  `;

  bot.sendMessage(chatId, helpMessage);
});

// Обработка данных от Web App
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = JSON.parse(msg.web_app_data.data);
  
  // Обработка данных игры (рекорды, достижения и т.д.)
  if (data.type === 'game_result') {
    const { score, coins } = data;
    bot.sendMessage(chatId, `🎉 Отличная игра! Очки: ${score}, заработано монет: ${coins}`);
  }
});

console.log('🤖 Бот Хинкальмания запущен!');
```

## 4. Переменные окружения (.env)

```env
BOT_TOKEN=your_bot_token_here
WEB_APP_URL=https://yourdomain.com
PORT=3000
```

## 5. package.json для бота

```json
{
  "name": "hinkalmania-bot",
  "version": "1.0.0",
  "description": "Telegram Bot for Hinkalmania Mini App",
  "main": "bot.js",
  "scripts": {
    "start": "node bot.js",
    "dev": "nodemon bot.js"
  },
  "dependencies": {
    "node-telegram-bot-api": "^0.61.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 6. Развертывание

### Локальное тестирование
1. Установите ngrok: `npm install -g ngrok`
2. Запустите игру: `npm start`
3. В другом терминале: `ngrok http 3000`
4. Используйте ngrok URL в настройках Web App

### Продакшн развертывание
Рекомендуемые платформы:
- **Vercel** - для фронтенда (бесплатно)
- **Heroku** - для бота (бесплатно с ограничениями)
- **Railway** - универсальная платформа
- **Netlify** - для статических сайтов

## 7. Тестирование

1. Найдите вашего бота в Telegram
2. Отправьте `/start`
3. Нажмите "Играть в Хинкальманию"
4. Проверьте все функции игры
5. Убедитесь что сохранение работает
6. Протестируйте на разных устройствах

## 8. Дополнительные настройки

### Настройка домена
```
/setdomain
```
Добавьте ваш домен для Web App

### Настройка inline режима
```
/setinline
```
Включите inline режим для sharing

### Настройка платежей (опционально)
```
/mybots -> выберите бота -> Payments
```
Настройте если планируете монетизацию

---

🎉 **Поздравляем! Ваша Telegram Mini App готова к запуску!**