import {FoodConfig} from '../types';

export const FOOD_TYPES: Record<string, FoodConfig> = {
  hinkali: {emoji: '🥟', points: 10, coins: 2},
  shaurma: {emoji: '🥙', points: 15, coins: 3},
  shashlik: {emoji: '🍖', points: 20, coins: 4},
  kebab: {emoji: '🥪', points: 25, coins: 5},
};

export const SKIN_CONFIGS = {
  default: {
    emoji: '👨‍🦱',
    name: 'Классический кавказец',
    description: 'Традиционный образ с папахой',
    price: 0,
  },
  chef: {
    emoji: '👨‍🍳',
    name: 'Повар-кавказец',
    description: 'Профессиональный повар',
    price: 100,
  },
  warrior: {
    emoji: '⚔️',
    name: 'Воин-кавказец',
    description: 'Храбрый воин с саблей',
    price: 250,
  },
  elder: {
    emoji: '👴',
    name: 'Старейшина',
    description: 'Мудрый старейшина аула',
    price: 500,
  },
  dancer: {
    emoji: '💃',
    name: 'Танцор лезгинки',
    description: 'Искусный танцор',
    price: 750,
  },
};

export const GAME_SETTINGS = {
  GAME_DURATION: 60, // секунды
  FOOD_SPAWN_INTERVAL: 2000, // миллисекунды
  FOOD_FALL_DURATION: 3000, // миллисекунды
  COLLECTION_ANIMATION_DURATION: 400, // миллисекунды
  INITIAL_COINS: 100,
  BONUS_COINS_PER_SCORE: 10, // монет за каждые 10 очков
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