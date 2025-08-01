# 🚀 Инструкции по развертыванию Хинкальмании

## 📋 Предварительные требования

### Для Android:
- Android Studio 4.0+
- Android SDK (API 23+)
- Java Development Kit (JDK) 11+
- Android эмулятор или физическое устройство

### Для iOS:
- macOS (обязательно)
- Xcode 12.0+
- iOS Simulator или физическое устройство
- CocoaPods

### Общие требования:
- Node.js 16+
- npm или yarn
- React Native CLI

## 🛠️ Установка и настройка

### 1. Клонирование проекта
```bash
git clone <repository-url>
cd hinkalmania
```

### 2. Установка зависимостей
```bash
npm install
# или
yarn install
```

### 3. Установка iOS зависимостей (только на macOS)
```bash
cd ios
pod install
cd ..
```

## 📱 Запуск в режиме разработки

### Android
```bash
# Убедитесь, что Android эмулятор запущен
npm run android
# или
yarn android
```

### iOS
```bash
# Только на macOS
npm run ios
# или
yarn ios
```

### Metro сервер
```bash
npm start
# или
yarn start
```

## 🏗️ Сборка для релиза

### Android APK

#### 1. Настройка подписи
Создайте keystore файл:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore hinkalmania.keystore -alias hinkalmania -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Настройка gradle.properties
Добавьте в `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=hinkalmania.keystore
MYAPP_UPLOAD_KEY_ALIAS=hinkalmania
MYAPP_UPLOAD_STORE_PASSWORD=your_password
MYAPP_UPLOAD_KEY_PASSWORD=your_password
```

#### 3. Сборка APK
```bash
cd android
./gradlew assembleRelease
```

APK файл будет создан в `android/app/build/outputs/apk/release/`

### iOS IPA

#### 1. Настройка в Xcode
1. Откройте `ios/Hinkalmania.xcworkspace` в Xcode
2. Выберите target "Hinkalmania"
3. В разделе "Signing & Capabilities" настройте Team и Bundle Identifier

#### 2. Сборка IPA
```bash
cd ios
xcodebuild -workspace Hinkalmania.xcworkspace -scheme Hinkalmania -configuration Release -archivePath Hinkalmania.xcarchive archive
xcodebuild -exportArchive -archivePath Hinkalmania.xcarchive -exportOptionsPlist exportOptions.plist -exportPath ./build
```

## 📦 Публикация в магазинах

### Google Play Store

#### 1. Подготовка
- Создайте аккаунт разработчика ($25)
- Подготовьте скриншоты (минимум 2)
- Напишите описание игры
- Подготовьте иконку (512x512)

#### 2. Загрузка
1. Войдите в Google Play Console
2. Создайте новое приложение
3. Загрузите APK файл
4. Заполните информацию о приложении
5. Отправьте на проверку

### Apple App Store

#### 1. Подготовка
- Создайте аккаунт разработчика ($99/год)
- Подготовьте скриншоты для разных устройств
- Напишите описание игры
- Подготовьте иконку (1024x1024)

#### 2. Загрузка
1. Войдите в App Store Connect
2. Создайте новое приложение
3. Загрузите IPA файл через Xcode
4. Заполните информацию о приложении
5. Отправьте на проверку

## 🔧 Конфигурация

### Android

#### app.json
```json
{
  "expo": {
    "name": "Хинкальмания",
    "slug": "hinkalmania",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B6B"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.hinkalmania"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF6B6B"
      },
      "package": "com.yourcompany.hinkalmania"
    }
  }
}
```

### iOS

#### Info.plist
Добавьте необходимые разрешения:
```xml
<key>NSCameraUsageDescription</key>
<string>Приложению нужен доступ к камере для...</string>
<key>NSMicrophoneUsageDescription</key>
<string>Приложению нужен доступ к микрофону для...</string>
```

## 🧪 Тестирование

### Unit тесты
```bash
npm test
# или
yarn test
```

### E2E тесты
```bash
npm run test:e2e
# или
yarn test:e2e
```

### Ручное тестирование
1. Протестируйте все экраны
2. Проверьте анимации
3. Протестируйте покупки в магазине
4. Проверьте сохранение прогресса
5. Протестируйте на разных устройствах

## 📊 Аналитика и мониторинг

### Firebase Analytics
1. Создайте проект в Firebase Console
2. Добавьте google-services.json (Android) и GoogleService-Info.plist (iOS)
3. Настройте события для отслеживания

### Crashlytics
1. Подключите Firebase Crashlytics
2. Настройте автоматические отчеты об ошибках

## 🔄 Обновления

### Версионирование
Используйте семантическое версионирование:
- MAJOR.MINOR.PATCH
- Пример: 1.0.0, 1.1.0, 1.1.1

### Hot Updates (опционально)
Для быстрых обновлений без публикации в магазинах:
1. Настройте CodePush
2. Настройте автоматические обновления

## 🛡️ Безопасность

### Android
- Используйте ProGuard для обфускации кода
- Подписывайте APK файлы
- Проверяйте разрешения приложения

### iOS
- Используйте App Transport Security
- Проверяйте Info.plist на лишние разрешения
- Настройте App Sandbox

## 📈 Оптимизация

### Производительность
- Используйте React Native Performance Monitor
- Оптимизируйте изображения
- Минимизируйте количество перерендеров

### Размер приложения
- Используйте ProGuard (Android)
- Настройте tree shaking
- Оптимизируйте изображения

## 🆘 Устранение неполадок

### Частые проблемы

#### Android
```bash
# Очистка кэша
cd android
./gradlew clean
cd ..

# Перезапуск Metro
npm start -- --reset-cache
```

#### iOS
```bash
# Очистка кэша
cd ios
rm -rf build
cd ..

# Переустановка pods
cd ios
pod deintegrate
pod install
cd ..
```

### Логи
```bash
# Android
adb logcat

# iOS
xcrun simctl spawn booted log stream --predicate 'process == "Hinkalmania"'
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте документацию React Native
2. Поищите в GitHub Issues
3. Обратитесь к сообществу React Native

---

**Удачи с публикацией! 🚀** 