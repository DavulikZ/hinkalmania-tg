import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
// Telegram WebApp will be available via window.Telegram.WebApp
import GameScreen from './screens/GameScreenWeb';
import MenuScreen from './screens/MenuScreen';
import ShopScreen from './screens/ShopScreenWeb';
import SettingsScreen from './screens/SettingsScreenWeb';

// Styled components for web
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

// Get viewport dimensions (currently unused but may be needed later)
// const getViewportDimensions = () => {
//   return {
//     width: window.innerWidth,
//     height: window.innerHeight
//   };
// };

export type GameState = {
  coins: number;
  score: number;
  highScore: number;
  unlockedSkins: string[];
  currentSkin: string;
  unlockedFoods: string[];
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  lives: number; // система жизней
  level: number; // уровень игрока
  experience: number; // опыт
  achievements: string[]; // ачивки
  totalGamesPlayed: number; // общее количество игр
  totalScore: number; // общий счет
};

const defaultGameState: GameState = {
  coins: 150, // больше начальных монет для новых блюд
  score: 0,
  highScore: 0,
  unlockedSkins: ['default'],
  currentSkin: 'default',
  unlockedFoods: ['hinkali', 'harcho'], // начинаем с двух блюд
  soundEnabled: true,
  vibrationEnabled: true,
  lives: 3, // 3 сердца
  level: 1, // начальный уровень
  experience: 0, // начальный опыт
  achievements: [], // пустой список ачивок
  totalGamesPlayed: 0, // 0 игр сыграно
  totalScore: 0, // 0 общего счета
};

export type Screen = 'menu' | 'game' | 'shop' | 'settings';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  useEffect(() => {
    loadGameState();
  }, []);

  const loadGameState = () => {
    try {
      const savedState = localStorage.getItem('hinkalmania_gameState');
      if (savedState) {
        setGameState(JSON.parse(savedState));
      }
    } catch (error) {
      console.log('Ошибка загрузки состояния игры:', error);
    }
  };

  const saveGameState = (newState: GameState) => {
    try {
      localStorage.setItem('hinkalmania_gameState', JSON.stringify(newState));
      setGameState(newState);
    } catch (error) {
      console.log('Ошибка сохранения состояния игры:', error);
    }
  };

  const updateGameState = (updates: Partial<GameState>) => {
    const newState = {...gameState, ...updates};
    saveGameState(newState);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MenuScreen
            gameState={gameState}
            onPlay={() => setCurrentScreen('game')}
            onShop={() => setCurrentScreen('shop')}
            onSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'game':
        return (
          <GameScreen
            gameState={gameState}
            onUpdateGameState={updateGameState}
            onBackToMenu={() => setCurrentScreen('menu')}
          />
        );
      case 'shop':
        return (
          <ShopScreen
            gameState={gameState}
            onUpdateGameState={updateGameState}
            onBackToMenu={() => setCurrentScreen('menu')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            gameState={gameState}
            onUpdateGameState={updateGameState}
            onBackToMenu={() => setCurrentScreen('menu')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppContainer>
      {renderScreen()}
    </AppContainer>
  );
};

export default App; 