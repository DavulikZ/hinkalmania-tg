import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {GameState} from '../App';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 20px;
  color: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  margin: 0;
`;

const Subtitle = styled.div`
  font-size: 18px;
  color: white;
  opacity: 0.9;
  margin-top: 10px;
`;

const CategoryContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 5px;
  backdrop-filter: blur(10px);
`;

const CategoryButton = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 12px;
  text-align: center;
  border-radius: 10px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ItemsContainer = styled.div`
  flex: 1;
  margin-bottom: 20px;
  overflow-y: auto;
  padding-right: 10px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
`;

const ShopItem = styled(motion.div)<{ selected?: boolean; unlocked?: boolean }>`
  margin-bottom: 15px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border: ${props => props.selected ? '3px solid #FFD700' : 'none'};
  background: ${props => props.unlocked 
    ? 'linear-gradient(135deg, #4ECDC4, #6EE7DF)'
    : 'linear-gradient(135deg, #FF6B6B, #FF8E8E)'};
`;

const ItemContent = styled.div`
  padding: 15px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemEmoji = styled.div`
  font-size: 40px;
  margin-right: 15px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
`;

const ItemDescription = styled.div`
  font-size: 14px;
  color: white;
  opacity: 0.9;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PriceText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const UnlockedText = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
  opacity: 0.8;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #4ECDC4, #6EE7DF);
  border: none;
  border-radius: 15px;
  padding: 15px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ConfirmDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  border-radius: 20px;
  padding: 30px;
  max-width: 90vw;
  width: 400px;
  color: white;
  text-align: center;
`;

const DialogTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 20px;
`;

const DialogText = styled.p`
  margin: 0 0 25px 0;
  font-size: 16px;
  opacity: 0.9;
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const DialogButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: ${props => props.primary ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.primary ? '#FF6B6B' : 'white'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.primary ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

interface ShopScreenProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onBackToMenu: () => void;
}

interface ShopItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'skin' | 'food';
  emoji: string;
  isUnlocked: boolean;
  isSelected: boolean;
}

const ShopScreenWeb: React.FC<ShopScreenProps> = ({
  gameState,
  onUpdateGameState,
  onBackToMenu,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'skins' | 'food'>('skins');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItemType | null>(null);

  useEffect(() => {
    // Setup Telegram WebApp buttons
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.BackButton.onClick(onBackToMenu);
      tg.MainButton.hide();
    }

    return () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.BackButton.hide();
      }
    };
  }, [onBackToMenu]);

  const skinItems: ShopItemType[] = [
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

  const foodItems: ShopItemType[] = [
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

  const handleItemClick = (item: ShopItemType) => {
    if (item.isUnlocked) {
      if (item.type === 'skin') {
        onUpdateGameState({currentSkin: item.id});
        
        // Show success notification
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          window.Telegram.WebApp.showAlert(`Скин "${item.name}" выбран!`);
        }
      }
      return;
    }

    if (gameState.coins < item.price) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        window.Telegram.WebApp.showAlert('Недостаточно монет! Заработайте больше монет в игре.');
      }
      return;
    }

    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    const newCoins = gameState.coins - selectedItem.price;
    
    if (selectedItem.type === 'skin') {
      const newUnlockedSkins = [...gameState.unlockedSkins, selectedItem.id];
      onUpdateGameState({
        coins: newCoins,
        unlockedSkins: newUnlockedSkins,
        currentSkin: selectedItem.id,
      });
    } else {
      const newUnlockedFoods = [...gameState.unlockedFoods, selectedItem.id];
      onUpdateGameState({
        coins: newCoins,
        unlockedFoods: newUnlockedFoods,
      });
    }
    
    setShowConfirmDialog(false);
    setSelectedItem(null);

    // Show success notification
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      window.Telegram.WebApp.showAlert(`"${selectedItem.name}" разблокирован!`);
    }
  };

  const cancelPurchase = () => {
    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const renderShopItem = (item: ShopItemType) => (
    <ShopItem
      key={item.id}
      selected={item.isSelected}
      unlocked={item.isUnlocked}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleItemClick(item)}>
      <ItemContent>
        <ItemHeader>
          <ItemEmoji>{item.emoji}</ItemEmoji>
          <ItemInfo>
            <ItemName>{item.name}</ItemName>
            <ItemDescription>{item.description}</ItemDescription>
          </ItemInfo>
        </ItemHeader>
        
        <ItemFooter>
          {item.isUnlocked ? (
            <UnlockedText>
              {item.type === 'skin' && item.isSelected ? 'ВЫБРАН' : 'РАЗБЛОКИРОВАН'}
            </UnlockedText>
          ) : (
            <PriceText>🪙 {item.price}</PriceText>
          )}
        </ItemFooter>
      </ItemContent>
    </ShopItem>
  );

  return (
    <Container>
      {/* Заголовок */}
      <Header>
        <Title>МАГАЗИН</Title>
        <Subtitle>🪙 {gameState.coins} монет</Subtitle>
      </Header>

      {/* Категории */}
      <CategoryContainer>
        <CategoryButton
          active={selectedCategory === 'skins'}
          onClick={() => setSelectedCategory('skins')}>
          Скины персонажей
        </CategoryButton>
        
        <CategoryButton
          active={selectedCategory === 'food'}
          onClick={() => setSelectedCategory('food')}>
          Виды еды
        </CategoryButton>
      </CategoryContainer>

      {/* Список товаров */}
      <ItemsContainer>
        {selectedCategory === 'skins'
          ? skinItems.map(renderShopItem)
          : foodItems.map(renderShopItem)}
      </ItemsContainer>

      {/* Кнопка возврата */}
      <BackButton onClick={onBackToMenu}>
        НАЗАД В МЕНЮ
      </BackButton>

      {/* Диалог подтверждения покупки */}
      {showConfirmDialog && selectedItem && (
        <ConfirmDialog
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <DialogContent>
            <DialogTitle>Подтверждение покупки</DialogTitle>
            <DialogText>
              Купить "{selectedItem.name}" за {selectedItem.price} монет?
            </DialogText>
            <DialogButtons>
              <DialogButton onClick={cancelPurchase}>
                Отмена
              </DialogButton>
              <DialogButton primary onClick={confirmPurchase}>
                Купить
              </DialogButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </Container>
  );
};

export default ShopScreenWeb;