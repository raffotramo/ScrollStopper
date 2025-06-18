import { Achievement, DayProgress } from '../types';

// Categorie semplificate di achievement - allineate alle macro categorie delle sfide
export const ACHIEVEMENT_CATEGORIES = {
  MINDFULNESS: {
    name: 'Mindfulness',
    description: 'Consapevolezza e crescita personale',
    icon: '🧘',
    color: 'blue'
  },
  CREATIVITY: {
    name: 'Creatività', 
    description: 'Espressione artistica e innovazione',
    icon: '🎨',
    color: 'purple'
  },
  CONNECTION: {
    name: 'Connessioni',
    description: 'Relazioni e organizzazione',
    icon: '🤝',
    color: 'green'
  }
};

// Definizione di tutti gli achievement disponibili - raggruppati nelle 3 macro categorie
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // MINDFULNESS - Achievement di consapevolezza e crescita personale
  {
    id: 'first_activity',
    name: 'Primo Passo',
    description: 'Completa la tua prima attività',
    icon: '🎯',
    stars: 5,
    unlocked: false,
    category: 'mindfulness'
  },
  {
    id: 'mindful_week',
    name: 'Settimana Mindful',
    description: 'Completa tutte le attività di Mindfulness (giorni 1-10)',
    icon: '🧘',
    stars: 25,
    unlocked: false,
    category: 'mindfulness'
  },
  {
    id: 'streak_7',
    name: 'Costanza Quotidiana',
    description: 'Mantieni una serie di 7 giorni consecutivi',
    icon: '🔥',
    stars: 20,
    unlocked: false,
    category: 'mindfulness'
  },
  {
    id: 'thoughtful_writer',
    name: 'Riflessioni Profonde',
    description: 'Scrivi riflessioni per 10 attività',
    icon: '✍️',
    stars: 15,
    unlocked: false,
    category: 'mindfulness'
  },
  {
    id: 'time_awareness',
    name: 'Consapevolezza Temporale',
    description: 'Recupera 3 ore dal scrolling',
    icon: '⏰',
    stars: 30,
    unlocked: false,
    category: 'mindfulness'
  },

  // CREATIVITY - Achievement di espressione e creatività
  {
    id: 'creative_explorer',
    name: 'Esploratore Creativo',
    description: 'Completa tutte le attività Creative (giorni 11-20)',
    icon: '🎨',
    stars: 25,
    unlocked: false,
    category: 'creativity'
  },
  {
    id: 'artistic_soul',
    name: 'Anima Artistica',
    description: 'Completa 5 attività creative consecutive',
    icon: '🌟',
    stars: 20,
    unlocked: false,
    category: 'creativity'
  },
  {
    id: 'creative_master',
    name: 'Maestro Creativo',
    description: 'Completa tutte le attività creative con riflessioni',
    icon: '🏆',
    stars: 35,
    unlocked: false,
    category: 'creativity'
  },
  {
    id: 'innovation_spirit',
    name: 'Spirito Innovativo',
    description: 'Prova 3 nuove forme di espressione creativa',
    icon: '💡',
    stars: 15,
    unlocked: false,
    category: 'creativity'
  },
  {
    id: 'storyteller',
    name: 'Narratore',
    description: 'Completa tutte le attività di scrittura creativa',
    icon: '📚',
    stars: 25,
    unlocked: false,
    category: 'creativity'
  },

  // CONNECTION - Achievement di relazioni e organizzazione
  {
    id: 'social_connector',
    name: 'Connettore Sociale',
    description: 'Completa tutte le attività di Connessioni (giorni 21-30)',
    icon: '🤝',
    stars: 25,
    unlocked: false,
    category: 'connection'
  },
  {
    id: 'organizer_pro',
    name: 'Organizzatore Pro',
    description: 'Completa tutte le attività di decluttering',
    icon: '🗂️',
    stars: 20,
    unlocked: false,
    category: 'connection'
  },
  {
    id: 'relationship_builder',
    name: 'Costruttore di Relazioni',
    description: 'Contatta almeno 3 persone diverse durante la sfida',
    icon: '💕',
    stars: 15,
    unlocked: false,
    category: 'connection'
  },
  {
    id: 'life_organizer',
    name: 'Organizzatore di Vita',
    description: 'Riorganizza 3 spazi diversi (casa, lavoro, digitale)',
    icon: '🏠',
    stars: 25,
    unlocked: false,
    category: 'connection'
  },
  {
    id: 'journey_completer',
    name: 'Completista del Viaggio',
    description: 'Completa tutte le 30 attività',
    icon: '👑',
    stars: 100,
    unlocked: false,
    category: 'connection'
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