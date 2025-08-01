import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GameState} from '../App';

const {width} = Dimensions.get('window');

interface ShopScreenProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onBackToMenu: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'skin' | 'food';
  emoji: string;
  isUnlocked: boolean;
  isSelected: boolean;
}

const ShopScreen: React.FC<ShopScreenProps> = ({
  gameState,
  onUpdateGameState,
  onBackToMenu,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'skins' | 'food'>('skins');

  const skinItems: ShopItem[] = [
    {
      id: 'default',
      name: 'Классический кавказец',
      description: 'Традиционный образ с папахой',
      price: 0,
      type: 'skin',
      emoji: '👨‍🦱',
      isUnlocked: gameState.unlockedSkins.includes('default'),
      isSelected: gameState.currentSkin === 'default',
    },
    {
      id: 'chef',
      name: 'Повар-кавказец',
      description: 'Профессиональный повар',
      price: 100,
      type: 'skin',
      emoji: '👨‍🍳',
      isUnlocked: gameState.unlockedSkins.includes('chef'),
      isSelected: gameState.currentSkin === 'chef',
    },
    {
      id: 'warrior',
      name: 'Воин-кавказец',
      description: 'Храбрый воин с саблей',
      price: 250,
      type: 'skin',
      emoji: '⚔️',
      isUnlocked: gameState.unlockedSkins.includes('warrior'),
      isSelected: gameState.currentSkin === 'warrior',
    },
    {
      id: 'elder',
      name: 'Старейшина',
      description: 'Мудрый старейшина аула',
      price: 500,
      type: 'skin',
      emoji: '👴',
      isUnlocked: gameState.unlockedSkins.includes('elder'),
      isSelected: gameState.currentSkin === 'elder',
    },
    {
      id: 'dancer',
      name: 'Танцор лезгинки',
      description: 'Искусный танцор',
      price: 750,
      type: 'skin',
      emoji: '💃',
      isUnlocked: gameState.unlockedSkins.includes('dancer'),
      isSelected: gameState.currentSkin === 'dancer',
    },
  ];

  const foodItems: ShopItem[] = [
    {
      id: 'hinkali',
      name: 'Хинкали',
      description: 'Классические грузинские хинкали',
      price: 0,
      type: 'food',
      emoji: '🥟',
      isUnlocked: gameState.unlockedFoods.includes('hinkali'),
      isSelected: false,
    },
    {
      id: 'shaurma',
      name: 'Шаурма',
      description: 'Вкусная шаурма с мясом',
      price: 50,
      type: 'food',
      emoji: '🥙',
      isUnlocked: gameState.unlockedFoods.includes('shaurma'),
      isSelected: false,
    },
    {
      id: 'shashlik',
      name: 'Шашлык',
      description: 'Ароматный шашлык на мангале',
      price: 150,
      type: 'food',
      emoji: '🍖',
      isUnlocked: gameState.unlockedFoods.includes('shashlik'),
      isSelected: false,
    },
    {
      id: 'kebab',
      name: 'Кебаб',
      description: 'Сочный кебаб с овощами',
      price: 300,
      type: 'food',
      emoji: '🥪',
      isUnlocked: gameState.unlockedFoods.includes('kebab'),
      isSelected: false,
    },
  ];

  const handlePurchase = (item: ShopItem) => {
    if (item.isUnlocked) {
      if (item.type === 'skin') {
        onUpdateGameState({currentSkin: item.id});
        Alert.alert('Успех!', `Скин "${item.name}" выбран!`);
      }
      return;
    }

    if (gameState.coins < item.price) {
      Alert.alert('Недостаточно монет', 'Заработайте больше монет в игре!');
      return;
    }

    Alert.alert(
      'Подтверждение покупки',
      `Купить "${item.name}" за ${item.price} монет?`,
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Купить',
          onPress: () => {
            const newCoins = gameState.coins - item.price;
            
            if (item.type === 'skin') {
              const newUnlockedSkins = [...gameState.unlockedSkins, item.id];
              onUpdateGameState({
                coins: newCoins,
                unlockedSkins: newUnlockedSkins,
                currentSkin: item.id,
              });
            } else {
              const newUnlockedFoods = [...gameState.unlockedFoods, item.id];
              onUpdateGameState({
                coins: newCoins,
                unlockedFoods: newUnlockedFoods,
              });
            }
            
            Alert.alert('Покупка совершена!', `"${item.name}" разблокирован!`);
          },
        },
      ],
    );
  };

  const renderShopItem = (item: ShopItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.shopItem,
        item.isSelected && styles.selectedItem,
      ]}
      onPress={() => handlePurchase(item)}>
      <LinearGradient
        colors={
          item.isUnlocked
            ? ['#4ECDC4', '#6EE7DF']
            : ['#FF6B6B', '#FF8E8E']
        }
        style={styles.itemGradient}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        </View>
        
        <View style={styles.itemFooter}>
          {item.isUnlocked ? (
            <Text style={styles.unlockedText}>
              {item.type === 'skin' && item.isSelected ? 'ВЫБРАН' : 'РАЗБЛОКИРОВАН'}
            </Text>
          ) : (
            <Text style={styles.priceText}>🪙 {item.price}</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>МАГАЗИН</Text>
        <Text style={styles.subtitle}>🪙 {gameState.coins} монет</Text>
      </View>

      {/* Категории */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'skins' && styles.activeCategory,
          ]}
          onPress={() => setSelectedCategory('skins')}>
          <Text style={styles.categoryText}>Скины персонажей</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'food' && styles.activeCategory,
          ]}
          onPress={() => setSelectedCategory('food')}>
          <Text style={styles.categoryText}>Виды еды</Text>
        </TouchableOpacity>
      </View>

      {/* Список товаров */}
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        {selectedCategory === 'skins'
          ? skinItems.map(renderShopItem)
          : foodItems.map(renderShopItem)}
      </ScrollView>

      {/* Кнопка возврата */}
      <TouchableOpacity style={styles.backButton} onPress={onBackToMenu}>
        <LinearGradient
          colors={['#45B7D1', '#67C9E1']}
          style={styles.buttonGradient}>
          <Text style={styles.buttonText}>НАЗАД В МЕНЮ</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 5,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  shopItem: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  itemGradient: {
    padding: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  itemFooter: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unlockedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  backButton: {
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

export default ShopScreen; 