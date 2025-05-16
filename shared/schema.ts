import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  address: text("address"),
  bloodType: text("blood_type"),
  allergies: text("allergies"),
  medicalConditions: text("medical_conditions"),
  emergencyContact: text("emergency_contact"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyRequests = pgTable("emergency_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // medical, fire, accident, other
  description: text("description"),
  victimCount: text("victim_count"),
  location: json("location").notNull(),
  status: text("status").notNull().default("pending"), // pending, active, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const droneDeliveries = pgTable("drone_deliveries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  kitType: text("kit_type").notNull(), // basic, advanced, specialized
  notes: text("notes"),
  location: json("location").notNull(),
  status: text("status").notNull().default("pending"), // pending, preparing, in-flight, delivered
  estimatedArrival: timestamp("estimated_arrival"),
  droneId: text("drone_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const firstAidGuides = pgTable("first_aid_guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: json("content").notNull(),
  isOfflineAvailable: boolean("is_offline_available").default(true),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyRequestSchema = createInsertSchema(emergencyRequests).omit({
  id: true,
  createdAt: true,
});

export const insertDroneDeliverySchema = createInsertSchema(droneDeliveries).omit({
  id: true,
  createdAt: true,
});

export const insertFirstAidGuideSchema = createInsertSchema(firstAidGuides).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type EmergencyRequest = typeof emergencyRequests.$inferSelect;
export type InsertEmergencyRequest = z.infer<typeof insertEmergencyRequestSchema>;

export type DroneDelivery = typeof droneDeliveries.$inferSelect;
export type InsertDroneDelivery = z.infer<typeof insertDroneDeliverySchema>;

export type FirstAidGuide = typeof firstAidGuides.$inferSelect;
export type InsertFirstAidGuide = z.infer<typeof insertFirstAidGuideSchema>;

// Additional schemas for client validation
export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  accuracy: z.number().optional(),
});

export type Location = z.infer<typeof locationSchema>;

export const weatherDataSchema = z.object({
  temperature: z.number(),
  condition: z.string(),
  icon: z.string(),
  minTemp: z.number(),
  maxTemp: z.number(),
  feelsLike: z.number(),
  wind: z.number(),
  humidity: z.number(),
  visibility: z.string(),
  pressure: z.number(),
  alerts: z.array(z.object({
    title: z.string(),
    description: z.string(),
    validUntil: z.string(),
    severity: z.string(),
  })).optional(),
  forecast: z.array(z.object({
    day: z.string(),
    icon: z.string(),
    condition: z.string(),
    maxTemp: z.number(),
    minTemp: z.number(),
  })),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;
