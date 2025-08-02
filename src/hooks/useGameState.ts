import {useState, useEffect} from 'react';
import {GameState} from '../App';

const STORAGE_KEY = 'hinkalmania_game_state';

const defaultGameState: GameState = {
  coins: 200, // больше начальных монет для новых дорогих товаров
  score: 0,
  highScore: 0,
  unlockedSkins: ['default'],
  currentSkin: 'default',
  unlockedFoods: ['hinkali', 'harcho'], // начинаем с двух базовых блюд
  soundEnabled: true,
  vibrationEnabled: true,
  lives: 3, // добавляем систему жизней
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGameState();
  }, []);

  const loadGameState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setGameState({...defaultGameState, ...parsedState});
      }
    } catch (error) {
      console.log('Ошибка загрузки состояния игры:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameState = (newState: GameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setGameState(newState);
    } catch (error) {
      console.log('Ошибка сохранения состояния игры:', error);
    }
  };

  const updateGameState = (updates: Partial<GameState>) => {
    const newState = {...gameState, ...updates};
    saveGameState(newState);
  };

  const resetGameState = () => {
    saveGameState(defaultGameState);
  };

  const addCoins = (amount: number) => {
    updateGameState({coins: gameState.coins + amount});
  };

  const spendCoins = (amount: number) => {
    if (gameState.coins >= amount) {
      updateGameState({coins: gameState.coins - amount});
      return true;
    }
    return false;
  };

  const unlockSkin = (skinId: string) => {
    if (!gameState.unlockedSkins.includes(skinId)) {
      const newUnlockedSkins = [...gameState.unlockedSkins, skinId];
      updateGameState({unlockedSkins: newUnlockedSkins});
    }
  };

  const unlockFood = (foodId: string) => {
    if (!gameState.unlockedFoods.includes(foodId)) {
      const newUnlockedFoods = [...gameState.unlockedFoods, foodId];
      updateGameState({unlockedFoods: newUnlockedFoods});
    }
  };

  const setCurrentSkin = (skinId: string) => {
    if (gameState.unlockedSkins.includes(skinId)) {
      updateGameState({currentSkin: skinId});
    }
  };

  const updateHighScore = (newScore: number) => {
    if (newScore > gameState.highScore) {
      updateGameState({highScore: newScore});
    }
  };

  return {
    gameState,
    isLoading,
    updateGameState,
    resetGameState,
    addCoins,
    spendCoins,
    unlockSkin,
    unlockFood,
    setCurrentSkin,
    updateHighScore,
  };
}; 