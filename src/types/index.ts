export interface FoodItem {
  id: string;
  type: 'hinkali' | 'shaurma' | 'shashlik' | 'kebab';
  x: number;
  y: number;
  animatedValue: any; // Animated.Value
  scaleValue: any; // Animated.Value
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