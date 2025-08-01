import {FOOD_TYPES, GAME_SETTINGS} from '../constants/game';

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