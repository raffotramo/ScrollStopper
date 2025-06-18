export interface ChallengeDay {
  day: number;
  title: string;
  description: string;
  timeRequired?: number; // in minutes
  reflection?: string;
  category?: string;
}

export type CompletionStatus = 'yes' | 'partial' | 'no';

export interface DayProgress {
  day: number;
  completed: boolean;
  reflectionText?: string;
  completionStatus?: CompletionStatus;
  completedAt?: Date | null;
  timeSpent?: number; // in minutes - actual time spent on the activity
}

export interface UserStats {
  totalTimeRecovered: number; // in minutes
  daysCompleted: number;
  currentStreak: number;
  totalReflections: number;
  totalStars: number;
  level: number;
  pointsToNextLevel: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  stars: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'mindfulness' | 'creativity' | 'connection' | 'special';
}
