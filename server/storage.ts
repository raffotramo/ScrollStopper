import { 
  users, type User, type InsertUser,
  challengeProgress, type ChallengeProgress, type InsertChallengeProgress,
  userStats, type UserStats, type InsertUserStats
} from "@shared/schema";

// Storage interface for our app
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Challenge progress methods
  getChallengeProgress(userId: number, day: number): Promise<ChallengeProgress | undefined>;
  getAllChallengeProgress(userId: number): Promise<ChallengeProgress[]>;
  saveChallengeProgress(progress: InsertChallengeProgress): Promise<ChallengeProgress>;
  
  // User stats methods
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(stats: Partial<UserStats> & { userId: number }): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challengeProgressMap: Map<string, ChallengeProgress>;
  private userStatsMap: Map<number, UserStats>;
  private currentUserId: number;
  private currentChallengeProgressId: number;
  private currentUserStatsId: number;

  constructor() {
    this.users = new Map();
    this.challengeProgressMap = new Map();
    this.userStatsMap = new Map();
    this.currentUserId = 1;
    this.currentChallengeProgressId = 1;
    this.currentUserStatsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      username: insertUser.username || null
    };
    this.users.set(id, user);
    
    // Create initial user stats
    this.userStatsMap.set(id, {
      id: this.currentUserStatsId++,
      userId: id,
      totalTimeRecovered: 0,
      currentStreak: 0,
      totalReflections: 0,
      lastActivityDate: null
    });
    
    return user;
  }

  async getChallengeProgress(userId: number, day: number): Promise<ChallengeProgress | undefined> {
    const key = `${userId}-${day}`;
    return this.challengeProgressMap.get(key);
  }

  async getAllChallengeProgress(userId: number): Promise<ChallengeProgress[]> {
    return Array.from(this.challengeProgressMap.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async saveChallengeProgress(insertProgress: InsertChallengeProgress): Promise<ChallengeProgress> {
    const key = `${insertProgress.userId}-${insertProgress.day}`;
    const existingProgress = this.challengeProgressMap.get(key);
    
    if (existingProgress) {
      const updatedProgress: ChallengeProgress = {
        ...existingProgress,
        ...insertProgress,
        completedAt: insertProgress.completed ? new Date() : existingProgress.completedAt
      };
      this.challengeProgressMap.set(key, updatedProgress);
      return updatedProgress;
    }
    
    const newProgress: ChallengeProgress = {
      id: this.currentChallengeProgressId++,
      day: insertProgress.day,
      userId: insertProgress.userId,
      completed: insertProgress.completed ?? false,
      reflectionText: insertProgress.reflectionText || null,
      completionStatus: insertProgress.completionStatus || null,
      completedAt: insertProgress.completed ? new Date() : null
    };
    
    this.challengeProgressMap.set(key, newProgress);
    return newProgress;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return this.userStatsMap.get(userId);
  }

  async updateUserStats(statsUpdate: Partial<UserStats> & { userId: number }): Promise<UserStats> {
    const existingStats = this.userStatsMap.get(statsUpdate.userId);
    
    if (!existingStats) {
      const newStats: UserStats = {
        id: this.currentUserStatsId++,
        userId: statsUpdate.userId,
        totalTimeRecovered: statsUpdate.totalTimeRecovered || 0,
        currentStreak: statsUpdate.currentStreak || 0,
        totalReflections: statsUpdate.totalReflections || 0,
        lastActivityDate: statsUpdate.lastActivityDate || null
      };
      this.userStatsMap.set(statsUpdate.userId, newStats);
      return newStats;
    }
    
    const updatedStats: UserStats = {
      ...existingStats,
      ...statsUpdate
    };
    
    this.userStatsMap.set(statsUpdate.userId, updatedStats);
    return updatedStats;
  }
}

export const storage = new MemStorage();
