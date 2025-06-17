import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import session from "express-session";
import { handleShopifyCustomerCreated, handleShopifyOrderCreated, importShopifyCustomers } from "./shopify";
import { sendRegistrationConfirmationEmail } from "./emailService";

// Type declaration for session
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
import { insertChallengeProgressSchema, insertUserStatsSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'scrollstop-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/signup", async (req: any, res) => {
    try {
      const { email, password, username } = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email già registrata' });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        username: username || email.split('@')[0] // Use email prefix as default username
      });

      // Set session
      req.session.userId = user.id;
      
      // Send welcome email
      await sendRegistrationConfirmationEmail(user.email, user.username || user.email.split('@')[0]);
      
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username 
        } 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ error: 'Failed to create account' });
    }
  });

  app.post("/api/auth/login", async (req: any, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Credenziali non valide' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Credenziali non valide' });
      }

      // Set session
      req.session.userId = user.id;
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: 'Login failed' });
    }
  });

  app.post("/api/auth/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  // Reset user profile data
  app.post("/api/auth/reset-profile", async (req: any, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      await storage.resetUserData(req.session.userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error resetting user data:', error);
      res.status(500).json({ error: 'Reset failed' });
    }
  });

  app.get("/api/auth/user", (req: any, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    storage.getUser(req.session.userId).then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ 
        id: user.id, 
        email: user.email, 
        username: user.username 
      });
    }).catch(error => {
      console.error("Get user error:", error);
      res.status(500).json({ error: 'Failed to get user' });
    });
  });
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

  // Get all challenge progress for current user
  app.get("/api/progress", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const progress = await storage.getAllChallengeProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch progress" });
    }
  });

  // Get challenge progress for a specific day for current user
  app.get("/api/progress/:day", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const day = parseInt(req.params.day);
      const progress = await storage.getChallengeProgress(userId, day);
      res.json(progress || null);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch progress for day" });
    }
  });

  // Save challenge progress for current user
  app.post("/api/progress", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const progressData = insertChallengeProgressSchema.parse({
        ...req.body,
        userId // Override userId with authenticated user
      });
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
            lastActivityDate: today.toISOString()
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

  // Get user stats for current user
  app.get("/api/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const stats = await storage.getUserStats(userId);
      res.json(stats || null);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch user stats" });
    }
  });

  // Update user stats for current user
  app.patch("/api/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const statsData = { userId, ...req.body };
      const stats = await storage.updateUserStats(statsData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user stats" });
    }
  });

  // Shopify Webhook Routes
  app.post("/api/shopify/webhooks/customers/create", async (req, res) => {
    try {
      const customer = req.body;
      await handleShopifyCustomerCreated(customer);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Shopify customer webhook error:", error);
      res.status(500).json({ error: "Failed to process customer" });
    }
  });

  app.post("/api/shopify/webhooks/orders/create", async (req, res) => {
    try {
      const orderData = req.body;
      await handleShopifyOrderCreated(orderData);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Shopify order webhook error:", error);
      res.status(500).json({ error: "Failed to process order" });
    }
  });

  // Shopify Integration Management
  app.post("/api/shopify/import", requireAuth, async (req: any, res) => {
    try {
      const { shopifyApiKey, shopUrl } = req.body;
      if (!shopifyApiKey || !shopUrl) {
        return res.status(400).json({ error: "API key and shop URL required" });
      }

      const result = await importShopifyCustomers(shopifyApiKey, shopUrl);
      res.json(result);
    } catch (error) {
      console.error("Shopify import error:", error);
      res.status(500).json({ error: "Failed to import customers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
