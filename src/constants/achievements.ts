export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (gameState: any) => boolean;
  experienceReward: number;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_game: {
    id: 'first_game',
    title: 'Первая игра',
    description: 'Сыграйте свою первую игру',
    icon: '🎮',
    condition: (gameState) => gameState.totalGamesPlayed >= 1,
    experienceReward: 50,
  },
  score_100: {
    id: 'score_100',
    title: 'Сто очков',
    description: 'Наберите 100 очков в одной игре',
    icon: '💯',
    condition: (gameState) => gameState.highScore >= 100,
    experienceReward: 100,
  },
  score_500: {
    id: 'score_500',
    title: 'Пятьсот очков',
    description: 'Наберите 500 очков в одной игре',
    icon: '🔥',
    condition: (gameState) => gameState.highScore >= 500,
    experienceReward: 200,
  },
  coins_1000: {
    id: 'coins_1000',
    title: 'Богач',
    description: 'Накопите 1000 монет',
    icon: '💰',
    condition: (gameState) => gameState.coins >= 1000,
    experienceReward: 150,
  },
  games_10: {
    id: 'games_10',
    title: 'Опытный игрок',
    description: 'Сыграйте 10 игр',
    icon: '🎯',
    condition: (gameState) => gameState.totalGamesPlayed >= 10,
    experienceReward: 100,
  },
  games_50: {
    id: 'games_50',
    title: 'Ветеран',
    description: 'Сыграйте 50 игр',
    icon: '🏆',
    condition: (gameState) => gameState.totalGamesPlayed >= 50,
    experienceReward: 300,
  },
  total_score_1000: {
    id: 'total_score_1000',
    title: 'Мастер счета',
    description: 'Наберите 1000 очков в сумме',
    icon: '📊',
    condition: (gameState) => gameState.totalScore >= 1000,
    experienceReward: 200,
  },
  level_5: {
    id: 'level_5',
    title: 'Пятый уровень',
    description: 'Достигните 5 уровня',
    icon: '⭐',
    condition: (gameState) => gameState.level >= 5,
    experienceReward: 250,
  },
  level_10: {
    id: 'level_10',
    title: 'Десятый уровень',
    description: 'Достигните 10 уровня',
    icon: '🌟',
    condition: (gameState) => gameState.level >= 10,
    experienceReward: 500,
  },
  all_foods: {
    id: 'all_foods',
    title: 'Гурман',
    description: 'Разблокируйте все виды еды',
    icon: '🍽️',
    condition: (gameState) => gameState.unlockedFoods.length >= 7,
    experienceReward: 300,
  },
  all_skins: {
    id: 'all_skins',
    title: 'Коллекционер',
    description: 'Разблокируйте все скины',
    icon: '👕',
    condition: (gameState) => gameState.unlockedSkins.length >= 7,
    experienceReward: 400,
  },
};

export const checkAchievements = (gameState: any): string[] => {
  const newAchievements: string[] = [];
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!gameState.achievements.includes(achievement.id) && achievement.condition(gameState)) {
      newAchievements.push(achievement.id);
    }
  });
  
  return newAchievements;
};

export const getExperienceForLevel = (level: number): number => {
  return level * 100; // 100 опыта за каждый уровень
};

export const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 100) + 1;
}; 