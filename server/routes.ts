import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEmergencyRequestSchema, insertDroneDeliverySchema, locationSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiRouter = '/api';

  // Authentication routes
  app.post(`${apiRouter}/auth/login`, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real application, we would use JWT or sessions
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiRouter}/auth/register`, async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        isAdmin: newUser.isAdmin
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Emergency request routes
  app.post(`${apiRouter}/emergency`, async (req: Request, res: Response) => {
    try {
      const requestData = insertEmergencyRequestSchema.parse(req.body);
      const newEmergencyRequest = await storage.createEmergencyRequest(requestData);
      return res.status(201).json(newEmergencyRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Emergency request error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiRouter}/emergency`, async (req: Request, res: Response) => {
    try {
      const emergencyRequests = await storage.getEmergencyRequests();
      return res.status(200).json(emergencyRequests);
    } catch (error) {
      console.error("Get emergency requests error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiRouter}/emergency/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const emergencyRequest = await storage.getEmergencyRequestById(id);
      
      if (!emergencyRequest) {
        return res.status(404).json({ message: "Emergency request not found" });
      }
      
      return res.status(200).json(emergencyRequest);
    } catch (error) {
      console.error("Get emergency request error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Drone delivery routes
  app.post(`${apiRouter}/drone-delivery`, async (req: Request, res: Response) => {
    try {
      const deliveryData = insertDroneDeliverySchema.parse(req.body);
      const newDroneDelivery = await storage.createDroneDelivery(deliveryData);
      return res.status(201).json(newDroneDelivery);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Drone delivery error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiRouter}/drone-delivery`, async (req: Request, res: Response) => {
    try {
      const droneDeliveries = await storage.getDroneDeliveries();
      return res.status(200).json(droneDeliveries);
    } catch (error) {
      console.error("Get drone deliveries error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiRouter}/drone-delivery/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const droneDelivery = await storage.getDroneDeliveryById(id);
      
      if (!droneDelivery) {
        return res.status(404).json({ message: "Drone delivery not found" });
      }
      
      return res.status(200).json(droneDelivery);
    } catch (error) {
      console.error("Get drone delivery error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // First aid guides routes
  app.get(`${apiRouter}/guides`, async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const guides = await storage.getFirstAidGuidesByCategory(category);
        return res.status(200).json(guides);
      } else {
        const guides = await storage.getFirstAidGuides();
        return res.status(200).json(guides);
      }
    } catch (error) {
      console.error("Get guides error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiRouter}/guides/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const guide = await storage.getFirstAidGuideById(id);
      
      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }
      
      return res.status(200).json(guide);
    } catch (error) {
      console.error("Get guide error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Weather data route
  app.post(`${apiRouter}/weather`, async (req: Request, res: Response) => {
    try {
      const locationData = locationSchema.parse(req.body);
      const weatherData = await storage.getWeatherData(locationData);
      return res.status(200).json(weatherData);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      console.error("Weather data error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
