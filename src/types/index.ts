export interface FoodItem {
  id: string;
  type: 'hinkali' | 'harcho' | 'adjarski' | 'megruli' | 'lobio' | 'satsivi' | 'chakapuli' | 'pasta' | 'sushi' | 'shawarma' | 'burger';
  x: number;
  y: number;
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