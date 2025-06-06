import { Achievement, DayProgress } from '../types';

// Definizione di tutti gli achievement disponibili
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Achievement giornalieri
  {
    id: 'first_activity',
    name: 'Primo Passo',
    description: 'Completa la tua prima attività',
    icon: '🎯',
    stars: 5,
    unlocked: false,
    category: 'daily'
  },
  {
    id: 'daily_warrior',
    name: 'Guerriero Quotidiano',
    description: 'Completa 7 attività',
    icon: '⚔️',
    stars: 15,
    unlocked: false,
    category: 'daily'
  },
  {
    id: 'half_journey',
    name: 'Metà del Viaggio',
    description: 'Completa 15 attività',
    icon: '🏃‍♂️',
    stars: 30,
    unlocked: false,
    category: 'completion'
  },
  {
    id: 'master_completer',
    name: 'Maestro Completista',
    description: 'Completa tutte le 30 attività',
    icon: '👑',
    stars: 100,
    unlocked: false,
    category: 'completion'
  },

  // Achievement di streak
  {
    id: 'streak_3',
    name: 'Costanza Iniziale',
    description: 'Mantieni una serie di 3 giorni consecutivi',
    icon: '🔥',
    stars: 10,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'streak_7',
    name: 'Settimana Perfetta',
    description: 'Mantieni una serie di 7 giorni consecutivi',
    icon: '🌟',
    stars: 25,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'streak_14',
    name: 'Fortezza di Volontà',
    description: 'Mantieni una serie di 14 giorni consecutivi',
    icon: '🏰',
    stars: 50,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'streak_21',
    name: 'Abitudine Radicata',
    description: 'Mantieni una serie di 21 giorni consecutivi',
    icon: '🌳',
    stars: 75,
    unlocked: false,
    category: 'streak'
  },

  // Achievement di riflessione
  {
    id: 'thoughtful_writer',
    name: 'Scrittore Riflessivo',
    description: 'Scrivi riflessioni per 10 attività',
    icon: '✍️',
    stars: 20,
    unlocked: false,
    category: 'consistency'
  },
  {
    id: 'deep_thinker',
    name: 'Pensatore Profondo',
    description: 'Scrivi riflessioni per 20 attività',
    icon: '🧠',
    stars: 40,
    unlocked: false,
    category: 'consistency'
  },

  // Achievement di tempo
  {
    id: 'time_saver',
    name: 'Risparmiatore di Tempo',
    description: 'Recupera 60 minuti dal scrolling',
    icon: '⏰',
    stars: 15,
    unlocked: false,
    category: 'special'
  },
  {
    id: 'hour_master',
    name: 'Maestro delle Ore',
    description: 'Recupera 3 ore dal scrolling',
    icon: '⏳',
    stars: 35,
    unlocked: false,
    category: 'special'
  },
  {
    id: 'time_lord',
    name: 'Signore del Tempo',
    description: 'Recupera 10 ore dal scrolling',
    icon: '🕰️',
    stars: 80,
    unlocked: false,
    category: 'special'
  },

  // Achievement check-in
  {
    id: 'consistent_checker',
    name: 'Check-in Costante',
    description: 'Completa il check-in per 5 giorni consecutivi',
    icon: '📋',
    stars: 12,
    unlocked: false,
    category: 'consistency'
  },
  {
    id: 'evening_ritual',
    name: 'Rituale Serale',
    description: 'Completa il check-in per 14 giorni consecutivi',
    icon: '🌙',
    stars: 30,
    unlocked: false,
    category: 'consistency'
  },

  // Achievement speciali
  {
    id: 'perfectionist',
    name: 'Perfezionista',
    description: 'Completa 10 attività con status "Sì, completato"',
    icon: '💎',
    stars: 25,
    unlocked: false,
    category: 'special'
  },
  {
    id: 'weekend_warrior',
    name: 'Guerriero del Weekend',
    description: 'Completa attività in weekend consecutivi',
    icon: '🏖️',
    stars: 18,
    unlocked: false,
    category: 'special'
  }
];

// Calcola il livello basato sulle stelle totali
export const calculateLevel = (totalStars: number): { level: number; pointsToNext: number } => {
  const starsPerLevel = [0, 20, 50, 100, 180, 300, 450, 650, 900, 1200, 1500]; // Stelle richieste per ogni livello
  
  let level = 1;
  for (let i = starsPerLevel.length - 1; i >= 0; i--) {
    if (totalStars >= starsPerLevel[i]) {
      level = i + 1;
      break;
    }
  }
  
  const nextLevelStars = level < starsPerLevel.length ? starsPerLevel[level] : starsPerLevel[starsPerLevel.length - 1] + 500;
  const pointsToNext = Math.max(0, nextLevelStars - totalStars);
  
  return { level, pointsToNext };
};

// Controlla quali achievement sono stati sbloccati
export const checkAchievements = (
  progress: DayProgress[], 
  timeRecovered: number,
  currentStreak: number,
  currentAchievements: Achievement[]
): { newAchievements: Achievement[]; updatedAchievements: Achievement[] } => {
  const completedDays = progress.filter(day => day.completed).length;
  const reflectionsCount = progress.filter(day => day.reflectionText && day.reflectionText.trim() !== '').length;
  const perfectCompletions = progress.filter(day => day.completionStatus === 'yes').length;
  
  // Calcola check-in consecutivi (simulato per ora)
  const consecutiveCheckIns = Math.min(currentStreak, completedDays);
  
  const newAchievements: Achievement[] = [];
  const updatedAchievements = currentAchievements.map(achievement => {
    if (achievement.unlocked) return achievement;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'first_activity':
        shouldUnlock = completedDays >= 1;
        break;
      case 'daily_warrior':
        shouldUnlock = completedDays >= 7;
        break;
      case 'half_journey':
        shouldUnlock = completedDays >= 15;
        break;
      case 'master_completer':
        shouldUnlock = completedDays >= 30;
        break;
      case 'streak_3':
        shouldUnlock = currentStreak >= 3;
        break;
      case 'streak_7':
        shouldUnlock = currentStreak >= 7;
        break;
      case 'streak_14':
        shouldUnlock = currentStreak >= 14;
        break;
      case 'streak_21':
        shouldUnlock = currentStreak >= 21;
        break;
      case 'thoughtful_writer':
        shouldUnlock = reflectionsCount >= 10;
        break;
      case 'deep_thinker':
        shouldUnlock = reflectionsCount >= 20;
        break;
      case 'time_saver':
        shouldUnlock = timeRecovered >= 60;
        break;
      case 'hour_master':
        shouldUnlock = timeRecovered >= 180;
        break;
      case 'time_lord':
        shouldUnlock = timeRecovered >= 600;
        break;
      case 'consistent_checker':
        shouldUnlock = consecutiveCheckIns >= 5;
        break;
      case 'evening_ritual':
        shouldUnlock = consecutiveCheckIns >= 14;
        break;
      case 'perfectionist':
        shouldUnlock = perfectCompletions >= 10;
        break;
      case 'weekend_warrior':
        // Logica semplificata per weekend
        shouldUnlock = currentStreak >= 4 && completedDays >= 8;
        break;
    }
    
    if (shouldUnlock) {
      const unlockedAchievement = {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date()
      };
      newAchievements.push(unlockedAchievement);
      return unlockedAchievement;
    }
    
    return achievement;
  });
  
  return { newAchievements, updatedAchievements };
};

// Ottieni il titolo del livello
export const getLevelTitle = (level: number): string => {
  const titles = [
    'Principiante',        // Livello 1
    'Esploratore',         // Livello 2
    'Avventuriero',        // Livello 3
    'Guerriero',           // Livello 4
    'Veterano',            // Livello 5
    'Maestro',             // Livello 6
    'Esperto',             // Livello 7
    'Leggenda',            // Livello 8
    'Campione',            // Livello 9
    'Gran Maestro',        // Livello 10
    'Immortale'            // Livello 11+
  ];
  
  return titles[Math.min(level - 1, titles.length - 1)] || 'Immortale';
};