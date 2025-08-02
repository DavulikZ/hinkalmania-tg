import React, {useState, useEffect, useRef, useCallback} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {GameState} from '../App';
import { FOOD_TYPES, TRASH_TYPES, GAME_SETTINGS, SKIN_CONFIGS } from '../constants/game';
import { getCurrentFallSpeed, getCurrentSpawnInterval, shouldSpawnTrash, getRandomFoodType, getRandomTrashType, getFoodConfig, getTrashConfig } from '../utils/gameUtils';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  user-select: none;
`;

const TopPanel = styled.div`
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  margin-top: 20px;
  backdrop-filter: blur(10px);
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: white;
  opacity: 0.8;
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const GameArea = styled.div`
  flex: 1;
  position: relative;
  height: calc(100vh - 250px);
  overflow: hidden;
`;

const FoodItem = styled(motion.div)<{ x: number; y: number; isTrash?: boolean }>`
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  cursor: pointer;
  z-index: 10;
  filter: ${props => props.isTrash ? 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.5))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'};
  font-size: 40px;
  user-select: none;
  
  ${props => props.isTrash && `
    animation: shake 0.3s infinite;
    
    @keyframes shake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(1deg); }
      75% { transform: rotate(-1deg); }
    }
  `}
`;

const FoodEmoji = styled.div`
  font-size: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const Player = styled(motion.div)<PositionProps>`
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  z-index: 25;
  border: 2px solid rgba(255, 255, 255, 0.8);
  will-change: transform;
`;

const PlayerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
`;

const Plate = styled(motion.div)<PositionProps>`
  position: absolute;
  width: 100px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px);
  z-index: 15;
  will-change: transform;
`;

const PlateEmoji = styled.div`
  font-size: 40px;
`;

const Controls = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const ControlsText = styled.div`
  color: white;
  font-size: 16px;
  opacity: 0.8;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const GameButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  border: none;
  border-radius: 15px;
  padding: 15px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &.menu {
    background: linear-gradient(135deg, #45B7D1, #67C9E1);
  }
`;

const ScorePopup = styled(motion.div)<{ x: number; y: number; score: number }>`
  position: absolute;
  left: ${(props: { x: number; y: number; score: number }) => props.x}px;
  top: ${(props: { x: number; y: number; score: number }) => props.y}px;
  color: ${(props: { x: number; y: number; score: number }) => props.score >= 0 ? '#FFD700' : '#FF4444'};
  font-weight: bold;
  font-size: 18px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 30;
  
  &::before {
    content: ${(props: { x: number; y: number; score: number }) => props.score >= 0 ? '"+' + props.score + '"' : '"' + props.score + '"'};
  }
`;

interface GameScreenProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onBackToMenu: () => void;
}

interface FoodItemType {
  id: string;
  type: 'hinkali' | 'harcho' | 'adjarski' | 'megruli' | 'lobio' | 'satsivi' | 'chakapuli' | 'pasta' | 'sushi' | 'shawarma' | 'burger';
  x: number;
  y: number;
  isTrash?: boolean;
  fallSpeed?: number;
}

interface PositionProps {
  x: number;
  y: number;
}

interface ScorePopupType {
  id: string;
  score: number;
  x: number;
  y: number;
}

// FOOD_TYPES и TRASH_TYPES импортируются из constants/game.ts

const GameScreenWeb: React.FC<GameScreenProps> = ({
  gameState,
  onUpdateGameState,
  onBackToMenu,
}: GameScreenProps) => {
  const [score, setScore] = useState(0);
  const [foodItems, setFoodItems] = useState<FoodItemType[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopupType[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameTime, setGameTime] = useState(60);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2 - 30, y: window.innerHeight - 180 });
  const [platePosition, setPlatePosition] = useState({ x: window.innerWidth / 2 - 50, y: window.innerHeight - 120 });

  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Touch/Mouse handling - оптимизированная версия без задержки
  const handlePointerMove = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    if (!isGameActive) return;
    
    e.preventDefault(); // Предотвращаем стандартное поведение браузера
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? (e as any).touches[0]?.clientX : (e as React.MouseEvent).clientX;
    if (clientX === undefined) return;
    
    const newX = Math.max(30, Math.min(window.innerWidth - 30, clientX - rect.left));
    const newY = window.innerHeight - 180;
    
    // Немедленное обновление позиции без React state для максимальной отзывчивости
    const playerElement = document.querySelector('[data-player]') as HTMLElement;
    const plateElement = document.querySelector('[data-plate]') as HTMLElement;
    
    if (playerElement) {
      playerElement.style.transform = `translate(${newX - 30}px, ${newY}px)`;
    }
    
    if (plateElement) {
      plateElement.style.transform = `translate(${newX - 50}px, ${newY + 60}px)`;
    }
    
    // Обновляем state для синхронизации (с throttling)
    requestAnimationFrame(() => {
      setPlayerPosition({ x: newX - 30, y: newY });
      setPlatePosition({ x: newX - 50, y: newY + 60 });
    });
  }, [isGameActive]);

  useEffect(() => {
    if (isGameActive) {
      const timer = setInterval(() => {
        setGameTime((prev: number) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Динамический спавн еды с увеличивающейся частотой
      let foodSpawnerInterval: number;
      
      const updateSpawnRate = () => {
        if (foodSpawnerInterval) clearInterval(foodSpawnerInterval);
        
        const currentGameTime = (60 - gameTime) * 1000;
        const currentSpawnInterval = getCurrentSpawnInterval(currentGameTime);
        
        foodSpawnerInterval = setInterval(() => {
          spawnFood();
        }, currentSpawnInterval);
      };

      // Сразу начинаем спавнить еду
      updateSpawnRate();
      
      // Обновляем интервал спавна каждые 2 секунды
      const spawnRateUpdater = setInterval(updateSpawnRate, 2000);

      return () => {
        clearInterval(timer);
        clearInterval(foodSpawnerInterval);
        clearInterval(spawnRateUpdater);
      };
    }
  }, [isGameActive, gameTime]);

  // Animation loop for falling food with variable speed - оптимизированная версия
  useEffect(() => {
    let lastTime = 0;
    const animateFood = (currentTime: number) => {
      if (!isGameActive) return;
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      const currentGameTime = (60 - gameTime) * 1000;
      const baseFallSpeed = getCurrentFallSpeed(currentGameTime);
      const normalizedSpeed = (baseFallSpeed / 1000) * deltaTime; // скорость в пикселях за кадр
      
      setFoodItems((prevItems: FoodItemType[]) => 
        prevItems.map((item: FoodItemType) => ({
          ...item,
          y: item.y + (item.fallSpeed || normalizedSpeed * 60) // индивидуальная или базовая скорость
        })).filter((item: FoodItemType) => item.y < window.innerHeight)
      );
      
      animationFrameRef.current = requestAnimationFrame(animateFood);
    };

    if (isGameActive) {
      animationFrameRef.current = requestAnimationFrame(animateFood);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameActive, gameTime]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setGameTime(60);
    setFoodItems([]);
    setScorePopups([]);
    
    // Telegram haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const endGame = () => {
    setIsGameActive(false);
    const newHighScore = Math.max(gameState.highScore, score);
    const earnedCoins = Math.floor(score / 10);
    
    onUpdateGameState({
      highScore: newHighScore,
      coins: gameState.coins + earnedCoins,
    });

    // Telegram haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const spawnFood = () => {
    if (!isGameActive) return;

    const currentGameTime = (60 - gameTime) * 1000;
    const isSpawningTrash = shouldSpawnTrash(currentGameTime);
    
    let newItem: FoodItemType;
    
    if (isSpawningTrash) {
      // Спавним негативные блюда (не кавказская кухня)
      const trashType = getRandomTrashType() as 'pasta' | 'sushi' | 'shawarma' | 'burger';
      const currentSpeed = getCurrentFallSpeed(currentGameTime);
      const normalizedSpeed = 3000 / currentSpeed;
      
      newItem = {
        id: Date.now().toString(),
        type: trashType,
        x: Math.random() * (window.innerWidth - 100),
        y: -50,
        isTrash: true,
        fallSpeed: normalizedSpeed * 1.2, // негативная еда падает чуть быстрее
      };
    } else {
      // Спавним кавказскую еду
      const availableFoods = gameState.unlockedFoods;
      const randomFood = getRandomFoodType(availableFoods) as 'hinkali' | 'harcho' | 'adjarski' | 'megruli' | 'lobio' | 'satsivi' | 'chakapuli';
      const currentSpeed = getCurrentFallSpeed(currentGameTime);
      const normalizedSpeed = 3000 / currentSpeed;
      
      newItem = {
        id: Date.now().toString(),
        type: randomFood,
        x: Math.random() * (window.innerWidth - 100),
        y: -50,
        isTrash: false,
        fallSpeed: normalizedSpeed,
      };
    }

    setFoodItems(prev => [...prev, newItem]);
  };

  const collectFood = (foodItem: FoodItemType) => {
    let itemConfig, newScore, newCoins, hapticType: 'light' | 'medium' | 'heavy' = 'light';
    
    if (foodItem.isTrash) {
      // Обработка негативных блюд (не кавказская кухня)
      itemConfig = getTrashConfig(foodItem.type);
      newScore = Math.max(0, score + itemConfig.points); // очки не могут быть отрицательными
      newCoins = Math.max(0, gameState.coins + itemConfig.coins); // монеты не могут быть отрицательными
      hapticType = 'heavy'; // сильная вибрация для негативной еды
    } else {
      // Обработка кавказской еды
      itemConfig = getFoodConfig(foodItem.type);
      newScore = score + itemConfig.points;
      newCoins = gameState.coins + itemConfig.coins;
      hapticType = 'light';
    }
    
    setScore(newScore);
    onUpdateGameState({coins: newCoins});

    // Remove item
    setFoodItems(prev => prev.filter(item => item.id !== foodItem.id));

    // Show score popup with appropriate color
    const popup: ScorePopupType = {
      id: `popup-${Date.now()}`,
      score: itemConfig.points,
      x: foodItem.x + 30,
      y: foodItem.y + 30,
    };
    setScorePopups(prev => [...prev, popup]);

    // Remove popup after animation
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== popup.id));
    }, 1000);

    // Telegram haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(hapticType);
    }
  };

  return (
    <Container>
      {/* Верхняя панель с информацией */}
      <TopPanel>
        <InfoItem>
          <InfoLabel>Время</InfoLabel>
          <InfoValue>{gameTime}s</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Очки</InfoLabel>
          <InfoValue>{score}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Монеты</InfoLabel>
          <InfoValue>🪙 {gameState.coins}</InfoValue>
        </InfoItem>
      </TopPanel>

      {/* Игровая область */}
      <GameArea 
        ref={gameAreaRef}
        onPointerMove={handlePointerMove}
        onMouseMove={handlePointerMove}
        style={{ touchAction: 'none' }}>
        
        {/* Падающая кавказская еда и негативные блюда */}
        <AnimatePresence>
          {foodItems.map(foodItem => {
            const itemConfig = foodItem.isTrash ? getTrashConfig(foodItem.type) : getFoodConfig(foodItem.type);
            return (
              <FoodItem
                key={foodItem.id}
                x={foodItem.x}
                y={foodItem.y}
                isTrash={foodItem.isTrash}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => collectFood(foodItem)}>
                <FoodEmoji>{itemConfig.emoji}</FoodEmoji>
              </FoodItem>
            );
          })}
        </AnimatePresence>

        {/* Score popups */}
        <AnimatePresence>
          {scorePopups.map(popup => (
            <ScorePopup
              key={popup.id}
              x={popup.x}
              y={popup.y}
              score={popup.score}
              initial={{ opacity: 1, y: popup.y }}
              animate={{ opacity: 0, y: popup.y - 50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}>
            </ScorePopup>
          ))}
        </AnimatePresence>

        {/* Игрок (кавказец) */}
        <Player
          data-player
          x={playerPosition.x}
          y={playerPosition.y}
          animate={{ x: playerPosition.x, y: playerPosition.y }}
          transition={{ duration: 0.1, ease: "linear" }}>
          <PlayerImage
            src={SKIN_CONFIGS[gameState.currentSkin as keyof typeof SKIN_CONFIGS]?.image || '/images/characters/caucasian-default.png'}
            alt="Кавказец"
            onError={(e) => {
              // Fallback к эмодзи если изображение не загрузилось
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.textContent = '🚶🏽‍♂️';
              fallback.style.fontSize = '40px';
              fallback.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))';
              target.parentNode?.appendChild(fallback);
            }}
          />
        </Player>

        {/* Тарелка */}
        <Plate
          data-plate
          x={platePosition.x}
          y={platePosition.y}
          animate={{ x: platePosition.x, y: platePosition.y }}
          transition={{ duration: 0.1, ease: "linear" }}>
          <PlateEmoji>🍽️</PlateEmoji>
        </Plate>
      </GameArea>

      {/* Управление */}
      <Controls>
        <ControlsText>
          {isGameActive 
            ? 'Перемещай курсор или палец для движения' 
            : 'Нажми "НАЧАТЬ ИГРУ" чтобы играть'}
        </ControlsText>
      </Controls>

      {/* Кнопки управления */}
      <ButtonContainer>
        {!isGameActive ? (
          <GameButton onClick={startGame}>
            НАЧАТЬ ИГРУ
          </GameButton>
        ) : (
          <GameButton onClick={endGame}>
            ПАУЗА
          </GameButton>
        )}

        <GameButton className="menu" onClick={onBackToMenu}>
          МЕНЮ
        </GameButton>
      </ButtonContainer>
    </Container>
  );
};

export default GameScreenWeb;