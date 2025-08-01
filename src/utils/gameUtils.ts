import {FOOD_TYPES, TRASH_TYPES, GAME_SETTINGS} from '../constants/game';

// Для веба используем размеры окна браузера
const getWindowDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const generateRandomPosition = () => {
  const {width} = getWindowDimensions();
  return {
    x: Math.random() * (width - 100),
    y: -50,
  };
};

export const calculateBonusCoins = (score: number): number => {
  return Math.floor(score / GAME_SETTINGS.BONUS_COINS_PER_SCORE);
};

export const getFoodConfig = (type: string) => {
  return FOOD_TYPES[type] || FOOD_TYPES.hinkali;
};

export const getRandomFoodType = (unlockedFoods: string[]): string => {
  if (unlockedFoods.length === 0) return 'hinkali';
  
  const randomIndex = Math.floor(Math.random() * unlockedFoods.length);
  return unlockedFoods[randomIndex];
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const validatePurchase = (
  currentCoins: number,
  price: number,
): boolean => {
  return currentCoins >= price;
};

export const calculateNewCoins = (
  currentCoins: number,
  price: number,
): number => {
  return Math.max(0, currentCoins - price);
};

export const isHighScore = (currentScore: number, highScore: number): boolean => {
  return currentScore > highScore;
};

// Определяет, должен ли появиться мусор на основе времени игры
export const shouldSpawnTrash = (gameTime: number): boolean => {
  const timeInSeconds = gameTime / 1000;
  const speedUps = Math.floor(timeInSeconds / (GAME_SETTINGS.SPEED_INCREASE_INTERVAL / 1000));
  
  const currentTrashChance = Math.min(
    GAME_SETTINGS.TRASH_SPAWN_CHANCE + (speedUps * GAME_SETTINGS.TRASH_INCREASE_RATE),
    GAME_SETTINGS.MAX_TRASH_CHANCE
  );
  
  return Math.random() < currentTrashChance;
};

// Вычисляет текущую скорость падения объектов (улучшенная)
export const getCurrentFallSpeed = (gameTime: number): number => {
  const timeInSeconds = gameTime / 1000;
  const speedUps = Math.floor(timeInSeconds / (GAME_SETTINGS.SPEED_INCREASE_INTERVAL / 1000));
  
  const currentSpeed = GAME_SETTINGS.FOOD_FALL_DURATION * Math.pow(GAME_SETTINGS.SPEED_MULTIPLIER, speedUps);
  
  return Math.max(currentSpeed, GAME_SETTINGS.MIN_FALL_DURATION);
};

// Вычисляет текущий интервал спавна (больше еды!)
export const getCurrentSpawnInterval = (gameTime: number): number => {
  const timeInSeconds = gameTime / 1000;
  const speedUps = Math.floor(timeInSeconds / (GAME_SETTINGS.SPEED_INCREASE_INTERVAL / 1000));
  
  const currentInterval = GAME_SETTINGS.FOOD_SPAWN_INTERVAL * Math.pow(GAME_SETTINGS.SPAWN_SPEED_MULTIPLIER, speedUps);
  
  return Math.max(currentInterval, GAME_SETTINGS.MIN_SPAWN_INTERVAL);
};

export const getRandomTrashType = (): string => {
  const trashTypes = Object.keys(TRASH_TYPES);
  const randomIndex = Math.floor(Math.random() * trashTypes.length);
  return trashTypes[randomIndex];
};

export const getTrashConfig = (type: string) => {
  return TRASH_TYPES[type] || TRASH_TYPES.pasta;
}; 