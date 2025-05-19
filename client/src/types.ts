export interface ChallengeDay {
  day: number;
  title: string;
  description: string;
}

export type CompletionStatus = 'yes' | 'partial' | 'no';

export interface DayProgress {
  day: number;
  completed: boolean;
  reflectionText?: string;
  completionStatus?: CompletionStatus;
  completedAt?: Date | null;
}

export interface UserStats {
  totalTimeRecovered: number; // in minutes
  daysCompleted: number;
  currentStreak: number;
  totalReflections: number;
}
