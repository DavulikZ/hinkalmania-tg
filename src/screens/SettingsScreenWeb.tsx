import React, { useEffect } from 'react';
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
  margin: 0;
`;

const Content = styled.div`
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

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  backdrop-filter: blur(10px);
`;

const SettingLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const SettingIcon = styled.div`
  font-size: 24px;
  margin-right: 15px;
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 2px;
`;

const SettingDescription = styled.div`
  font-size: 14px;
  color: white;
  opacity: 0.8;
`;

const SettingRight = styled.div`
  display: flex;
  align-items: flex-end;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const SectionHeader = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: white;
  opacity: 0.9;
  margin: 0;
`;

const ActionButton = styled(motion.button)`
  margin-bottom: 10px;
  border-radius: 15px;
  overflow: hidden;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const ActionContent = styled.div<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px;
  background: ${props => props.danger 
    ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)'
    : 'linear-gradient(135deg, #45B7D1, #67C9E1)'};
  color: white;
`;

const ActionIcon = styled.div`
  font-size: 24px;
  margin-right: 15px;
`;

const ActionText = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
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

const Switch = styled.div<{ enabled: boolean }>`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  background: ${props => props.enabled ? '#4ECDC4' : '#767577'};
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
`;

const SwitchThumb = styled.div<{ enabled: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: white;
  position: absolute;
  top: 2px;
  left: ${props => props.enabled ? '24px' : '2px'};
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

const DialogButton = styled.button<{ danger?: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: ${props => props.danger ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.danger ? '#FF6B6B' : 'white'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

interface SettingsScreenProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onBackToMenu: () => void;
}

const SettingsScreenWeb: React.FC<SettingsScreenProps> = ({
  gameState,
  onUpdateGameState,
  onBackToMenu,
}) => {
  const [showResetDialog, setShowResetDialog] = React.useState(false);

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

  const handleSoundToggle = () => {
    onUpdateGameState({soundEnabled: !gameState.soundEnabled});
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleVibrationToggle = () => {
    onUpdateGameState({vibrationEnabled: !gameState.vibrationEnabled});
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleResetProgress = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    onUpdateGameState({
      coins: 100,
      score: 0,
      highScore: 0,
      unlockedSkins: ['default'],
      currentSkin: 'default',
      unlockedFoods: ['hinkali'],
    });
    
    setShowResetDialog(false);
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      window.Telegram.WebApp.showAlert('Прогресс сброшен! Все данные были сброшены к начальным значениям.');
    }
  };

  const cancelReset = () => {
    setShowResetDialog(false);
  };

  const handleAbout = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(
        'Хинкальмания v1.0.0\n\nСобирай кавказские блюда и становись лучшим поваром!\n\nРазработано с любовью к кавказской кухне 🥟'
      );
    }
  };

  const renderSettingItem = (
    title: string,
    description: string,
    icon: string,
    rightComponent: React.ReactNode,
  ) => (
    <SettingItem>
      <SettingLeft>
        <SettingIcon>{icon}</SettingIcon>
        <SettingInfo>
          <SettingTitle>{title}</SettingTitle>
          <SettingDescription>{description}</SettingDescription>
        </SettingInfo>
      </SettingLeft>
      <SettingRight>{rightComponent}</SettingRight>
    </SettingItem>
  );

  return (
    <Container>
      {/* Заголовок */}
      <Header>
        <Title>НАСТРОЙКИ</Title>
      </Header>

      <Content>
        {/* Звук */}
        {renderSettingItem(
          'Звук',
          'Включить звуковые эффекты',
          '🔊',
          <Switch enabled={gameState.soundEnabled} onClick={handleSoundToggle}>
            <SwitchThumb enabled={gameState.soundEnabled} />
          </Switch>
        )}

        {/* Вибрация */}
        {renderSettingItem(
          'Вибрация',
          'Включить вибрацию при сборе еды',
          '📳',
          <Switch enabled={gameState.vibrationEnabled} onClick={handleVibrationToggle}>
            <SwitchThumb enabled={gameState.vibrationEnabled} />
          </Switch>
        )}

        {/* Статистика */}
        <SectionHeader>
          <SectionTitle>СТАТИСТИКА</SectionTitle>
        </SectionHeader>

        {renderSettingItem(
          'Монеты',
          `Текущий баланс: ${gameState.coins}`,
          '🪙',
          <StatValue>{gameState.coins}</StatValue>
        )}

        {renderSettingItem(
          'Рекорд',
          `Лучший результат: ${gameState.highScore}`,
          '🏆',
          <StatValue>{gameState.highScore}</StatValue>
        )}

        {renderSettingItem(
          'Разблокированные скины',
          `${gameState.unlockedSkins.length} из 5`,
          '👤',
          <StatValue>{gameState.unlockedSkins.length}/5</StatValue>
        )}

        {renderSettingItem(
          'Разблокированная еда',
          `${gameState.unlockedFoods.length} из 4`,
          '🍽️',
          <StatValue>{gameState.unlockedFoods.length}/4</StatValue>
        )}

        {/* Действия */}
        <SectionHeader>
          <SectionTitle>ДЕЙСТВИЯ</SectionTitle>
        </SectionHeader>

        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleResetProgress}>
          <ActionContent danger>
            <ActionIcon>🔄</ActionIcon>
            <ActionText>Сбросить прогресс</ActionText>
          </ActionContent>
        </ActionButton>

        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAbout}>
          <ActionContent>
            <ActionIcon>ℹ️</ActionIcon>
            <ActionText>О игре</ActionText>
          </ActionContent>
        </ActionButton>
      </Content>

      {/* Кнопка возврата */}
      <BackButton onClick={onBackToMenu}>
        НАЗАД В МЕНЮ
      </BackButton>

      {/* Диалог подтверждения сброса */}
      {showResetDialog && (
        <ConfirmDialog
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <DialogContent>
            <DialogTitle>Сброс прогресса</DialogTitle>
            <DialogText>
              Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.
            </DialogText>
            <DialogButtons>
              <DialogButton onClick={cancelReset}>
                Отмена
              </DialogButton>
              <DialogButton danger onClick={confirmReset}>
                Сбросить
              </DialogButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </Container>
  );
};

export default SettingsScreenWeb;