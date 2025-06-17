import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Basic user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  username: true,
}).extend({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "Password deve essere almeno 6 caratteri"),
  username: z.string().optional(),
});

// Challenge progress schema
export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  day: integer("day").notNull(),
  completed: boolean("completed").notNull().default(false),
  reflectionText: text("reflection_text"),
  completionStatus: text("completion_status"), // 'yes', 'partial', 'no'
  completedAt: timestamp("completed_at"),
});

export const insertChallengeProgressSchema = createInsertSchema(challengeProgress).omit({
  id: true,
});

// User stats schema
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  totalTimeRecovered: integer("total_time_recovered").notNull().default(0), // in minutes
  currentStreak: integer("current_streak").notNull().default(0),
  totalReflections: integer("total_reflections").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChallengeProgress = z.infer<typeof insertChallengeProgressSchema>;
export type ChallengeProgress = typeof challengeProgress.$inferSelect;

export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;
