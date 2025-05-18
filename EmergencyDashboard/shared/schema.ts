import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema from the original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Emergency schema
export const emergencies = pgTable("emergencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  coordinates: json("coordinates").notNull().$type<[number, number]>(), // [lat, lng]
  eta: text("eta").notNull(),
  vehicleId: text("vehicle_id").notNull(),
  rescuers: text("rescuers").notNull(),
});

export const insertEmergencySchema = createInsertSchema(emergencies).pick({
  name: true,
  surname: true,
  coordinates: true,
  eta: true,
  vehicleId: true,
  rescuers: true,
});

// Vehicle schema
export const vehicles = pgTable("vehicles", {
  id: text("id").primaryKey(), // E.g., A-101, E-01
  type: text("type").notNull().$type<"ground" | "air">(),
  description: text("description").notNull(),
  status: text("status").notNull().$type<"active" | "available">(),
});

export const insertVehicleSchema = createInsertSchema(vehicles);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmergency = z.infer<typeof insertEmergencySchema>;
export type Emergency = typeof emergencies.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
