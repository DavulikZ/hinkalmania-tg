import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {GameState} from '../App';

// Styled components
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 50px 20px;
  color: white;
`;

const Header = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: white;
  text-align: center;
  opacity: 0.9;
  margin: 10px 0 0 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  margin: 30px 0;
  backdrop-filter: blur(10px);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: white;
  opacity: 0.8;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const MenuContainer = styled.div`
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MenuButton = styled(motion.button)`
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  border: none;
  border-radius: 15px;
  padding: 15px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &.shop {
    background: linear-gradient(135deg, #4ECDC4, #6EE7DF);
  }

  &.settings {
    background: linear-gradient(135deg, #45B7D1, #67C9E1);
  }
`;

const DecorativeContainer = styled.div`
  margin-bottom: 30px;
`;

const DecorativeText = styled.div`
  font-size: 24px;
  text-align: center;
`;

interface MenuScreenProps {
  gameState: GameState;
  onPlay: () => void;
  onShop: () => void;
  onSettings: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  gameState,
  onPlay,
  onShop,
  onSettings,
}) => {
  useEffect(() => {
    // Setup Telegram WebApp main button
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.MainButton.hide();
      tg.BackButton.hide();
    }
  }, []);

  const handleButtonClick = (action: () => void, hapticType?: 'light' | 'medium' | 'heavy') => {
    // Telegram haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback && hapticType) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(hapticType);
    }
    action();
  };

  return (
    <Container>
      {/* Заголовок игры */}
      <Header>
        <Title>ХИНКАЛИМАНИЯ</Title>
        <Subtitle>Собирай кавказские блюда!</Subtitle>
      </Header>

      {/* Статистика игрока */}
      <StatsContainer>
        <StatItem>
          <StatLabel>Монеты</StatLabel>
          <StatValue>🪙 {gameState.coins}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Рекорд</StatLabel>
          <StatValue>🏆 {gameState.highScore}</StatValue>
        </StatItem>
      </StatsContainer>

      {/* Кнопки меню */}
      <MenuContainer>
        <MenuButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleButtonClick(onPlay, 'medium')}>
          ИГРАТЬ
        </MenuButton>

        <MenuButton
          className="shop"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleButtonClick(onShop, 'light')}>
          МАГАЗИН
        </MenuButton>

        <MenuButton
          className="settings"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleButtonClick(onSettings, 'light')}>
          НАСТРОЙКИ
        </MenuButton>
      </MenuContainer>

      {/* Декоративные элементы */}
      <DecorativeContainer>
        <DecorativeText>Game now on test :) </DecorativeText>
      </DecorativeContainer>
    </Container>
  );
};



export default MenuScreen; 