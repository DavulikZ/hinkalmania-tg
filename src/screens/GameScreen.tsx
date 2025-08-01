import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {PanGestureHandler as RNGHPanGestureHandler} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {GameState} from '../App';

const {width, height} = Dimensions.get('window');

interface GameScreenProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onBackToMenu: () => void;
}

interface FoodItem {
  id: string;
  type: 'hinkali' | 'shaurma' | 'shashlik' | 'kebab';
  x: number;
  y: number;
  animatedValue: Animated.Value;
  scaleValue: Animated.Value;
}

const FOOD_TYPES = {
  hinkali: {emoji: '🥟', points: 10, coins: 2},
  shaurma: {emoji: '🥙', points: 15, coins: 3},
  shashlik: {emoji: '🍖', points: 20, coins: 4},
  kebab: {emoji: '🥪', points: 25, coins: 5},
};

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  onUpdateGameState,
  onBackToMenu,
}) => {
  const [score, setScore] = useState(0);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameTime, setGameTime] = useState(60);
  const [platePosition, setPlatePosition] = useState({x: width / 2 - 50, y: height - 150});
  
  const playerPosition = useRef(new Animated.ValueXY({x: width / 2 - 25, y: height - 200})).current;
  const plateAnimated = useRef(new Animated.ValueXY({x: width / 2 - 50, y: height - 150})).current;

  useEffect(() => {
    if (isGameActive) {
      const timer = setInterval(() => {
        setGameTime(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const foodSpawner = setInterval(() => {
        spawnFood();
      }, 2000);

      return () => {
        clearInterval(timer);
        clearInterval(foodSpawner);
      };
    }
  }, [isGameActive]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setGameTime(60);
    setFoodItems([]);
  };

  const endGame = () => {
    setIsGameActive(false);
    const newHighScore = Math.max(gameState.highScore, score);
    const earnedCoins = Math.floor(score / 10);
    
    onUpdateGameState({
      highScore: newHighScore,
      coins: gameState.coins + earnedCoins,
    });
  };

  const spawnFood = () => {
    if (!isGameActive) return;

    const availableFoods = gameState.unlockedFoods;
    const randomFood = availableFoods[Math.floor(Math.random() * availableFoods.length)] as keyof typeof FOOD_TYPES;
    
    const newFood: FoodItem = {
      id: Date.now().toString(),
      type: randomFood,
      x: Math.random() * (width - 100),
      y: -50,
      animatedValue: new Animated.Value(0),
      scaleValue: new Animated.Value(1),
    };

    setFoodItems(prev => [...prev, newFood]);

    // Анимация падения еды
    Animated.timing(newFood.animatedValue, {
      toValue: height + 50,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setFoodItems(prev => prev.filter(item => item.id !== newFood.id));
    });
  };

  const collectFood = (foodItem: FoodItem) => {
    const foodConfig = FOOD_TYPES[foodItem.type];
    const newScore = score + foodConfig.points;
    const newCoins = gameState.coins + foodConfig.coins;
    
    setScore(newScore);
    onUpdateGameState({coins: newCoins});

    // Анимация сбора
    Animated.sequence([
      Animated.timing(foodItem.scaleValue, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(foodItem.scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFoodItems(prev => prev.filter(item => item.id !== foodItem.id));
    });
  };

  const onPlayerMove = (event: any) => {
    const {translationX} = event.nativeEvent;
    const newX = Math.max(0, Math.min(width - 50, playerPosition.x._value + translationX));
    
    playerPosition.setValue({x: newX, y: playerPosition.y._value});
    plateAnimated.setValue({x: newX - 25, y: plateAnimated.y._value});
  };

  const renderFoodItem = (foodItem: FoodItem) => {
    const foodConfig = FOOD_TYPES[foodItem.type];
    const translateY = foodItem.animatedValue.interpolate({
      inputRange: [0, height + 50],
      outputRange: [0, height + 50],
    });

    return (
      <Animated.View
        key={foodItem.id}
        style={[
          styles.foodItem,
          {
            transform: [
              {translateX: foodItem.x},
              {translateY},
              {scale: foodItem.scaleValue},
            ],
          },
        ]}>
        <TouchableOpacity
          onPress={() => collectFood(foodItem)}
          style={styles.foodTouchable}>
          <Text style={styles.foodEmoji}>{foodConfig.emoji}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Верхняя панель с информацией */}
      <View style={styles.topPanel}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Время</Text>
          <Text style={styles.infoValue}>{gameTime}s</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Очки</Text>
          <Text style={styles.infoValue}>{score}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Монеты</Text>
          <Text style={styles.infoValue}>🪙 {gameState.coins}</Text>
        </View>
      </View>

      {/* Игровая область */}
      <View style={styles.gameArea}>
        {/* Падающая еда */}
        {foodItems.map(renderFoodItem)}

        {/* Игрок (кавказец) */}
        <Animated.View
          style={[
            styles.player,
            {
              transform: [
                {translateX: playerPosition.x},
                {translateY: playerPosition.y},
              ],
            },
          ]}>
          <Text style={styles.playerEmoji}>👨‍🦱</Text>
        </Animated.View>

        {/* Тарелка */}
        <Animated.View
          style={[
            styles.plate,
            {
              transform: [
                {translateX: plateAnimated.x},
                {translateY: plateAnimated.y},
              ],
            },
          ]}>
          <Text style={styles.plateEmoji}>🍽️</Text>
        </Animated.View>
      </View>

      {/* Управление */}
      <RNGHPanGestureHandler onGestureEvent={onPlayerMove}>
        <View style={styles.controls}>
          <Text style={styles.controlsText}>Перемещай пальцем для движения</Text>
        </View>
      </RNGHPanGestureHandler>

      {/* Кнопки управления */}
      <View style={styles.buttonContainer}>
        {!isGameActive ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>НАЧАТЬ ИГРУ</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.pauseButton} onPress={endGame}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>ПАУЗА</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuButton} onPress={onBackToMenu}>
          <LinearGradient
            colors={['#45B7D1', '#67C9E1']}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText}>МЕНЮ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    marginTop: 20,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  foodItem: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodTouchable: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  foodEmoji: {
    fontSize: 30,
  },
  player: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  playerEmoji: {
    fontSize: 30,
  },
  plate: {
    position: 'absolute',
    width: 100,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateEmoji: {
    fontSize: 40,
  },
  controls: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    gap: 20,
  },
  startButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  pauseButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  menuButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default GameScreen; 