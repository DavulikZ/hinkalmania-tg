import {FoodConfig} from '../types';

export const FOOD_TYPES: Record<string, FoodConfig> = {
  hinkali: {emoji: '🦪', points: 15, coins: 3}, // хинкали - как раковина (более похоже)
  harcho: {emoji: '🍲', points: 20, coins: 4}, // харчо - суп
  adjarski: {emoji: '🥧', points: 25, coins: 5}, // хачапури по-аджарски (один кусок)
  megruli: {emoji: '🍞🍞', points: 35, coins: 7}, // хачапури по-мегрельски (два куска)
  lobio: {emoji: '🫘', points: 30, coins: 6}, // лобио - фасоль
  satsivi: {emoji: '🦃', points: 40, coins: 8}, // сациви - индейка с орехами
  chakapuli: {emoji: '🍖', points: 45, coins: 9}, // чакапули - баранина с травами
};

// Негативные предметы (не кавказская кухня)
export const TRASH_TYPES: Record<string, FoodConfig> = {
  pasta: {emoji: '🍝', points: -15, coins: -2}, // паста - не кавказская еда
  sushi: {emoji: '🍣', points: -20, coins: -3}, // суши - не кавказская еда  
  shawarma: {emoji: '🌯', points: -10, coins: -1}, // шаурма - не традиционная кавказская
  burger: {emoji: '🍔', points: -25, coins: -4}, // бургер - фастфуд
};

export const SKIN_CONFIGS = {
  default: {
    emoji: '🚶🏽‍♂️', // кавказец спиной (показывает спину и папаху)
    name: 'Классический кавказец',
    description: 'Кавказец в традиционной папахе, повернут спиной',
    price: 0,
  },
  chef: {
    emoji: '👨‍🍳',
    name: 'Повар-кавказец',
    description: 'Кавказец в поварском колпаке',
    price: 200,
  },
  warrior: {
    emoji: '⚔️',
    name: 'Воин-кавказец',
    description: 'Кавказец с саблей и кинжалом',
    price: 500,
  },
  elder: {
    emoji: '👴',
    name: 'Старейшина-кавказец',
    description: 'Кавказец с длинной бородой',
    price: 1000,
  },
  dancer: {
    emoji: '💃',
    name: 'Танцор-кавказец',
    description: 'Кавказец в танцевальном костюме',
    price: 1500,
  },
  hunter: {
    emoji: '🏹',
    name: 'Охотник-кавказец',
    description: 'Кавказец с ружьем',
    price: 2500,
  },
  shepherd: {
    emoji: '🐑',
    name: 'Пастух-кавказец',
    description: 'Кавказец с посохом',
    price: 3500,
  },
};

export const GAME_SETTINGS = {
  GAME_DURATION: 120, // секунды
  FOOD_SPAWN_INTERVAL: 2000, // миллисекунды (начальный интервал)
  FOOD_FALL_DURATION: 3000, // миллисекунды (начальная скорость)
  COLLECTION_ANIMATION_DURATION: 400, // миллисекунды
  INITIAL_COINS: 100,
  BONUS_COINS_PER_SCORE: 10, // монет за каждые 10 очков
  
  // Система жизней
  INITIAL_LIVES: 3, // начальное количество жизней
  
  // Задержка начала игры
  FOOD_START_DELAY: 0, // еда начинает падать сразу при старте игры
  
  // Улучшенная система скорости
  SPEED_INCREASE_INTERVAL: 8000, // каждые 8 секунд ускорение (чаще!)
  SPEED_MULTIPLIER: 0.8, // коэффициент ускорения (быстрее!)
  MIN_FALL_DURATION: 800, // минимальная скорость падения (быстрее!)
  
  // Система увеличения количества еды
  SPAWN_SPEED_MULTIPLIER: 0.85, // интервал спавна также ускоряется
  MIN_SPAWN_INTERVAL: 800, // минимальный интервал между спавном
  
  // Система мусора
  TRASH_SPAWN_CHANCE: 0.15, // начальный шанс мусора 15%
  TRASH_INCREASE_RATE: 0.08, // увеличение на 8% каждые 8 секунд  
  MAX_TRASH_CHANCE: 0.45, // максимум 45% мусора
};

export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#45B7D1',
  background: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  button: {
    primary: ['#FF6B6B', '#FF8E8E'],
    secondary: ['#4ECDC4', '#6EE7DF'],
    accent: ['#45B7D1', '#67C9E1'],
  },
}; 