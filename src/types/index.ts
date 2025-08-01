export interface FoodItem {
  id: string;
  type: 'hinkali' | 'shaurma' | 'shashlik' | 'kebab' | 'garbage' | 'rotten' | 'poison' | 'fly';
  x: number;
  y: number;
  animatedValue: any; // Animated.Value или для веба framer-motion value
  scaleValue: any; // Animated.Value или для веба framer-motion value
  isTrash?: boolean; // флаг для определения мусора
  fallSpeed?: number; // индивидуальная скорость падения
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'skin' | 'food';
  emoji: string;
  isUnlocked: boolean;
  isSelected: boolean;
}

export interface FoodConfig {
  emoji: string;
  points: number;
  coins: number;
}

export interface SkinConfig {
  emoji: string;
  name: string;
  description: string;
  price: number;
} 