import React, {useState, useEffect, useRef, useCallback} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {GameState} from '../App';
import { SKIN_CONFIGS } from '../constants/game';
import { getFoodConfig, getTrashConfig } from '../utils/gameUtils';
import { checkAchievements, calculateLevel } from '../constants/achievements';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: 
    linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(101, 67, 33, 0.9) 50%, rgba(139, 69, 19, 0.9) 100%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(160, 82, 45, 0.1) 10px,
      rgba(160, 82, 45, 0.1) 20px
    );
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const TopPanel = styled.div`
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.3);
  padding: 15px;
  margin-top: 20px;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.5);
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
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
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
  font-size: 35px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.8);
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    60% { transform: translateY(-3px); }
  }
`;

const Player = styled(motion.div)<PositionProps>`
  position: absolute;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  z-index: 25;
  border: 4px solid rgba(255, 255, 255, 0.9);
  will-change: transform;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px) translateY(0px); }
    50% { transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px) translateY(-3px); }
  }
`;

const PlayerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
`;

const Plate = styled(motion.div)<PositionProps>`
  position: absolute;
  width: 110px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px);
  z-index: 15;
  will-change: transform;
  animation: wobble 2s ease-in-out infinite;
  
  @keyframes wobble {
    0%, 100% { transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px) rotate(0deg); }
    25% { transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px) rotate(1deg); }
    75% { transform: translate(${(props: PositionProps) => props.x}px, ${(props: PositionProps) => props.y}px) rotate(-1deg); }
  }
`;

const PlateEmoji = styled.div`
  font-size: 45px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  animation: spin 4s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
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
  border-radius: 20px;
  padding: 18px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
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

// Эффекты для игры
const ParticleEffect = styled(motion.div)<{ x: number; y: number; color: string }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 8px;
  height: 8px;
  background: ${props => props.color};
  border-radius: 50%;
  pointer-events: none;
  z-index: 35;
`;

const ComboText = styled(motion.div)`
  position: absolute;
  color: #FFD700;
  font-weight: bold;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 40;
`;

const LevelUpEffect = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  font-weight: bold;
  font-size: 32px;
  padding: 20px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 100;
  text-align: center;
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

interface ParticleType {
  id: string;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
}

interface ComboType {
  id: string;
  text: string;
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
  const [particles, setParticles] = useState<ParticleType[]>([]);
  const [combos, setCombos] = useState<ComboType[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameTime, setGameTime] = useState(60);
  const [lives, setLives] = useState(gameState.lives);
  const [currentCoins, setCurrentCoins] = useState(gameState.coins);
  const [combo, setCombo] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2 - 30, y: window.innerHeight - 180 });
  const [platePosition, setPlatePosition] = useState({ x: window.innerWidth / 2 - 50, y: window.innerHeight - 120 });

  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Функции игры - объявляем до useEffect
  const startGame = useCallback(() => {
    setIsGameActive(true);
    setScore(0);
    setGameTime(60);
    setLives(gameState.lives);
    setCurrentCoins(gameState.coins);
    setFoodItems([]);
    setScorePopups([]);
    
    // Telegram haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  }, [gameState.lives, gameState.coins]);

  const endGame = useCallback(() => {
    setIsGameActive(false);
    const newHighScore = Math.max(gameState.highScore, score);
    const earnedCoins = Math.floor(score / 10);
    
    // Обновляем статистику игры
    const newTotalGamesPlayed = gameState.totalGamesPlayed + 1;
    const newTotalScore = gameState.totalScore + score;
    
    // Проверяем ачивки
    const newAchievements = checkAchievements({
      ...gameState,
      totalGamesPlayed: newTotalGamesPlayed,
      totalScore: newTotalScore,
      highScore: newHighScore,
      coins: currentCoins + earnedCoins,
    });
    
    // Добавляем опыт за игру
    const gameExperience = Math.floor(score / 5) + (combo >= 5 ? 20 : 0); // опыт за игру + бонус за комбо
    const newExperience = gameState.experience + gameExperience;
    const newLevel = calculateLevel(newExperience);
    
    // Показываем эффект повышения уровня
    if (newLevel > gameState.level) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    
    onUpdateGameState({
      highScore: newHighScore,
      coins: currentCoins + earnedCoins,
      totalGamesPlayed: newTotalGamesPlayed,
      totalScore: newTotalScore,
      experience: newExperience,
      level: newLevel,
      achievements: [...gameState.achievements, ...newAchievements],
    });

    // Telegram haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  }, [gameState, score, currentCoins, combo, onUpdateGameState]);

  const spawnFood = useCallback(() => {
    if (!isGameActive) return;

    // Простой спавн еды
    const isSpawningTrash = Math.random() < 0.2; // 20% шанс мусора
    
    let newItem: FoodItemType;
    
    if (isSpawningTrash) {
      // Спавним негативные блюда
      const trashTypes = ['pasta', 'sushi', 'shawarma', 'burger'] as const;
      const trashType = trashTypes[Math.floor(Math.random() * trashTypes.length)];
      
      newItem = {
        id: Date.now().toString(),
        type: trashType,
        x: Math.random() * (window.innerWidth - 100),
        y: -50,
        isTrash: true,
      };
    } else {
      // Спавним кавказскую еду
      const availableFoods = gameState.unlockedFoods;
      const randomFood = availableFoods[Math.floor(Math.random() * availableFoods.length)] as 'hinkali' | 'harcho' | 'adjarski' | 'megruli' | 'lobio' | 'satsivi' | 'chakapuli';
      
      newItem = {
        id: Date.now().toString(),
        type: randomFood,
        x: Math.random() * (window.innerWidth - 100),
        y: -50,
        isTrash: false,
      };
    }

    setFoodItems((prev: FoodItemType[]) => [...prev, newItem]);
  }, [isGameActive, gameState.unlockedFoods]);

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

      // Простой спавн еды каждые 1.5 секунды
      const foodSpawnerInterval = setInterval(() => {
          spawnFood();
      }, 1500);

      return () => {
        clearInterval(timer);
        clearInterval(foodSpawnerInterval);
      };
    }
  }, [isGameActive, endGame, spawnFood]);

  // Простая анимация падающей еды и частиц
  useEffect(() => {
    const animateFood = () => {
      if (!isGameActive) return;
      
      setFoodItems((prevItems: FoodItemType[]) => 
        prevItems.map((item: FoodItemType) => ({
          ...item,
          y: item.y + 3 // простая скорость падения
        })).filter((item: FoodItemType) => item.y < window.innerHeight)
      );
      
      // Анимация частиц
      setParticles((prevParticles: ParticleType[]) => 
        prevParticles.map((particle: ParticleType) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // гравитация
        })).filter((particle: ParticleType) => particle.y < window.innerHeight + 100)
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
  }, [isGameActive]);

  const createParticles = (x: number, y: number, color: string) => {
    const newParticles: ParticleType[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        color,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    
    // Удаляем частицы через 1 секунду
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  };

  const createCombo = (x: number, y: number, text: string) => {
    const comboId = `combo-${Date.now()}`;
    setCombos(prev => [...prev, { id: comboId, text, x, y }]);
    
    // Удаляем комбо через 2 секунды
    setTimeout(() => {
      setCombos(prev => prev.filter(c => c.id !== comboId));
    }, 2000);
  };

  const collectFood = (foodItem: FoodItemType) => {
    let itemConfig, newScore, newCoins, hapticType: 'light' | 'medium' | 'heavy' = 'light';
    let newLives = lives;
    let bonusText = '';
    
    if (foodItem.isTrash) {
      // Обработка негативных блюд (не кавказская кухня)
      itemConfig = getTrashConfig(foodItem.type);
      newScore = Math.max(0, score + itemConfig.points); // очки не могут быть отрицательными
      newCoins = Math.max(0, currentCoins + itemConfig.coins); // монеты не могут быть отрицательными
      hapticType = 'heavy'; // сильная вибрация для негативной еды
      
      // Создаем красные частицы для мусора
      createParticles(foodItem.x + 30, foodItem.y + 30, '#FF4444');
      
      // Уменьшаем жизни при сборе мусора
      newLives = Math.max(0, lives - 1);
      setLives(newLives);
      
      // Сбрасываем комбо при сборе мусора
      setCombo(0);
      
      bonusText = '💔 -1 ЖИЗНЬ';
      
    } else {
      // Обработка кавказской еды - даем бонусы!
      itemConfig = getFoodConfig(foodItem.type);
      newScore = score + itemConfig.points;
      newCoins = currentCoins + itemConfig.coins;
      hapticType = 'light';
      
      // Создаем золотые частицы для хорошей еды
      createParticles(foodItem.x + 30, foodItem.y + 30, '#FFD700');
      
      // Увеличиваем комбо
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      // Бонусы за хорошую еду
      let bonusCoins = 0;
      let bonusLives = 0;
      
      // Каждое 3-е кавказское блюдо дает бонус
      if (newCombo % 3 === 0) {
        bonusCoins = 10;
        bonusText = '🎉 +10 МОНЕТ!';
      }
      
      // Каждое 5-е кавказское блюдо восстанавливает жизнь
      if (newCombo % 5 === 0 && lives < gameState.lives) {
        bonusLives = 1;
        bonusText = '❤️ +1 ЖИЗНЬ!';
      }
      
      // Каждое 10-е кавказское блюдо дает двойные очки
      if (newCombo % 10 === 0) {
        newScore += itemConfig.points; // двойные очки
        bonusText = '⭐ ДВОЙНЫЕ ОЧКИ!';
      }
      
      // Применяем бонусы
      newCoins += bonusCoins;
      newLives = Math.min(gameState.lives, newLives + bonusLives);
      setLives(newLives);
      
      // Показываем комбо текст
      if (newCombo >= 3) {
        createCombo(foodItem.x + 30, foodItem.y - 20, `COMBO x${newCombo}!`);
      }
      
      // Показываем бонус текст
      if (bonusText) {
        createCombo(foodItem.x + 30, foodItem.y - 40, bonusText);
      }
    }
    
    // Если жизни закончились, завершаем игру
    if (newLives <= 0) {
      // Telegram haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
      
      // Обновляем статистику игры
      onUpdateGameState({
        totalGamesPlayed: gameState.totalGamesPlayed + 1,
        totalScore: gameState.totalScore + score,
        highScore: Math.max(gameState.highScore, score)
      });
      
      // Возвращаемся в меню
      onBackToMenu();
      return;
    }
    
    setScore(newScore);
    setCurrentCoins(newCoins);
    onUpdateGameState({coins: newCoins});

    // Remove item
    setFoodItems((prev: FoodItemType[]) => prev.filter((item: FoodItemType) => item.id !== foodItem.id));

    // Show score popup with appropriate color
    const popup: ScorePopupType = {
      id: `popup-${Date.now()}`,
      score: itemConfig.points,
      x: foodItem.x + 30,
      y: foodItem.y + 30,
    };
    setScorePopups((prev: ScorePopupType[]) => [...prev, popup]);

    // Remove popup after animation
    setTimeout(() => {
      setScorePopups((prev: ScorePopupType[]) => prev.filter((p: ScorePopupType) => p.id !== popup.id));
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
          <InfoLabel>Уровень</InfoLabel>
          <InfoValue>⭐ {gameState.level}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Монеты</InfoLabel>
          <InfoValue>🪙 {currentCoins}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Жизни</InfoLabel>
          <InfoValue>
            {Array.from({ length: gameState.lives }, (_, i) => (
              <span key={i} style={{ 
                color: i < lives ? '#FF4444' : '#666666',
                fontSize: '20px',
                marginRight: '2px'
              }}>
                ❤️
              </span>
            ))}
          </InfoValue>
        </InfoItem>
        {combo >= 3 && (
          <InfoItem>
            <InfoLabel>Комбо</InfoLabel>
            <InfoValue>🔥 x{combo}</InfoValue>
          </InfoItem>
        )}
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

        {/* Particles */}
        <AnimatePresence>
          {particles.map(particle => (
            <ParticleEffect
              key={particle.id}
              x={particle.x}
              y={particle.y}
              color={particle.color}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1 }}>
            </ParticleEffect>
          ))}
        </AnimatePresence>

        {/* Combo texts */}
        <AnimatePresence>
          {combos.map(comboItem => (
            <ComboText
              key={comboItem.id}
              initial={{ opacity: 1, y: comboItem.y, scale: 0.5 }}
              animate={{ opacity: 0, y: comboItem.y - 100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}>
              {comboItem.text}
            </ComboText>
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

      {/* Эффект повышения уровня */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpEffect
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}>
            🎉 УРОВЕНЬ ПОВЫШЕН! 🎉
            <br />
            <span style={{ fontSize: '24px' }}>Уровень {gameState.level + 1}</span>
          </LevelUpEffect>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default GameScreenWeb;