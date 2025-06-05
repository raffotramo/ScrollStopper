import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
import { insertChallengeProgressSchema, insertUserStatsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe payment endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        metadata: {
          product: "ScrollStop Premium"
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Error creating payment intent: " + error.message 
      });
    }
  });
  // Create user endpoint (for future expansion)
  app.post("/api/user", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  // Get all challenge progress for a user
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getAllChallengeProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch progress" });
    }
  });

  // Get challenge progress for a specific day
  app.get("/api/progress/:userId/:day", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const day = parseInt(req.params.day);
      const progress = await storage.getChallengeProgress(userId, day);
      res.json(progress || null);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch progress for day" });
    }
  });

  // Save challenge progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertChallengeProgressSchema.parse(req.body);
      const progress = await storage.saveChallengeProgress(progressData);
      
      // If progress includes a reflection, update reflection count
      if (progressData.reflectionText && progressData.reflectionText.trim() !== "") {
        const userStats = await storage.getUserStats(progressData.userId);
        if (userStats) {
          await storage.updateUserStats({
            userId: progressData.userId,
            totalReflections: userStats.totalReflections + 1
          });
        }
      }
      
      // If challenge was completed, update streak and last activity date
      if (progressData.completed) {
        const userStats = await storage.getUserStats(progressData.userId);
        if (userStats) {
          const today = new Date();
          const lastActivityDate = userStats.lastActivityDate;
          
          // Calculate streak
          let newStreak = userStats.currentStreak;
          if (!lastActivityDate) {
            newStreak = 1;
          } else {
            const lastActivityDay = new Date(lastActivityDate);
            const diffTime = Math.abs(today.getTime() - lastActivityDay.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
          }
          
          await storage.updateUserStats({
            userId: progressData.userId,
            currentStreak: newStreak,
            lastActivityDate: today
          });
        }
      }
      
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(400).json({ message: "Failed to save progress" });
      }
    }
  });

  // Get user stats
  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      res.json(stats || null);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch user stats" });
    }
  });

  // Update user stats
  app.patch("/api/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const statsData = { userId, ...req.body };
      const stats = await storage.updateUserStats(statsData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
