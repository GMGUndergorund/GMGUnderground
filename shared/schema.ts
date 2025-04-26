import { pgTable, text, serial, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Admin credentials schema
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  password: true,
});

// Game schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  downloadUrl: text("download_url").notNull(),
  fileSize: text("file_size").notNull(),
  releaseDate: text("release_date").notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    titleIdx: index("title_idx").on(table.title),
    categoryIdx: index("category_idx").on(table.category),
    featuredIdx: index("featured_idx").on(table.featured),
  };
});

// Define relations - this is good practice for future extensibility
export const gamesRelations = relations(games, ({ many }) => ({
  // In the future, you could add relations like reviews, downloads, etc.
}));

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  description: true,
  category: true,
  imageUrl: true,
  downloadUrl: true,
  fileSize: true,
  releaseDate: true,
  featured: true,
});

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const gameQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.number().optional(),
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type GameQuery = z.infer<typeof gameQuerySchema>;
