import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GameState} from '../App';

interface SettingsScreenProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onBackToMenu: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  gameState,
  onUpdateGameState,
  onBackToMenu,
}) => {
  const handleSoundToggle = (value: boolean) => {
    onUpdateGameState({soundEnabled: value});
  };

  const handleVibrationToggle = (value: boolean) => {
    onUpdateGameState({vibrationEnabled: value});
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Сброс прогресса',
      'Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: () => {
            onUpdateGameState({
              coins: 100,
              score: 0,
              highScore: 0,
              unlockedSkins: ['default'],
              currentSkin: 'default',
              unlockedFoods: ['hinkali'],
            });
            Alert.alert('Прогресс сброшен', 'Все данные были сброшены к начальным значениям.');
          },
        },
      ],
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'О игре',
      'Хинкальмания v1.0.0\n\nСобирай кавказские блюда и становись лучшим поваром!\n\nРазработано с любовью к кавказской кухне 🥟',
      [{text: 'Понятно', style: 'default'}],
    );
  };

  const renderSettingItem = (
    title: string,
    description: string,
    icon: string,
    rightComponent: React.ReactNode,
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>{rightComponent}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>НАСТРОЙКИ</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Звук */}
        {renderSettingItem(
          'Звук',
          'Включить звуковые эффекты',
          '🔊',
          <Switch
            value={gameState.soundEnabled}
            onValueChange={handleSoundToggle}
            trackColor={{false: '#767577', true: '#4ECDC4'}}
            thumbColor={gameState.soundEnabled ? '#FFFFFF' : '#f4f3f4'}
          />,
        )}

        {/* Вибрация */}
        {renderSettingItem(
          'Вибрация',
          'Включить вибрацию при сборе еды',
          '📳',
          <Switch
            value={gameState.vibrationEnabled}
            onValueChange={handleVibrationToggle}
            trackColor={{false: '#767577', true: '#4ECDC4'}}
            thumbColor={gameState.vibrationEnabled ? '#FFFFFF' : '#f4f3f4'}
          />,
        )}

        {/* Статистика */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>СТАТИСТИКА</Text>
        </View>

        {renderSettingItem(
          'Монеты',
          `Текущий баланс: ${gameState.coins}`,
          '🪙',
          <Text style={styles.statValue}>{gameState.coins}</Text>,
        )}

        {renderSettingItem(
          'Рекорд',
          `Лучший результат: ${gameState.highScore}`,
          '🏆',
          <Text style={styles.statValue}>{gameState.highScore}</Text>,
        )}

        {renderSettingItem(
          'Разблокированные скины',
          `${gameState.unlockedSkins.length} из 5`,
          '👤',
          <Text style={styles.statValue}>{gameState.unlockedSkins.length}/5</Text>,
        )}

        {renderSettingItem(
          'Разблокированная еда',
          `${gameState.unlockedFoods.length} из 4`,
          '🍽️',
          <Text style={styles.statValue}>{gameState.unlockedFoods.length}/4</Text>,
        )}

        {/* Действия */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ДЕЙСТВИЯ</Text>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleResetProgress}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.actionGradient}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>Сбросить прогресс</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleAbout}>
          <LinearGradient
            colors={['#45B7D1', '#67C9E1']}
            style={styles.actionGradient}>
            <Text style={styles.actionIcon}>ℹ️</Text>
            <Text style={styles.actionText}>О игре</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Кнопка возврата */}
      <TouchableOpacity style={styles.backButton} onPress={onBackToMenu}>
        <LinearGradient
          colors={['#4ECDC4', '#6EE7DF']}
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
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  settingRight: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionButton: {
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

export default SettingsScreen; 