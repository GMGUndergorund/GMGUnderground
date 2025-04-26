import { games, admins, type Game, type InsertGame, type Admin, type InsertAdmin } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Admin operations
  getAdmin(): Promise<Admin | undefined>;
  setAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Game operations
  getAllGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  searchGames(query: string, category?: string): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
  getFeaturedGames(): Promise<Game[]>;
}

export class DatabaseStorage implements IStorage {
  // Admin operations
  async getAdmin(): Promise<Admin | undefined> {
    const result = await db.select().from(admins).limit(1);
    
    if (result.length === 0) {
      // Create a default admin if none exists
      const defaultAdmin = await this.setAdmin({
        password: "GMG1707.3" // Updated password as requested
      });
      return defaultAdmin;
    }
    
    return result[0];
  }

  async setAdmin(admin: InsertAdmin): Promise<Admin> {
    const existingAdmin = await db.select().from(admins).limit(1);
    
    if (existingAdmin.length === 0) {
      // Create new admin
      const [newAdmin] = await db.insert(admins).values(admin).returning();
      return newAdmin;
    } else {
      // Update existing admin
      const [updatedAdmin] = await db
        .update(admins)
        .set(admin)
        .where(eq(admins.id, existingAdmin[0].id))
        .returning();
      return updatedAdmin;
    }
  }

  // Game operations
  async getAllGames(): Promise<Game[]> {
    return db.select().from(games);
  }

  async getGameById(id: number): Promise<Game | undefined> {
    const result = await db.select().from(games).where(eq(games.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async searchGames(query: string = "", category?: string): Promise<Game[]> {
    let conditions = [];
    
    if (query) {
      conditions.push(
        or(
          like(games.title, `%${query}%`),
          like(games.description, `%${query}%`)
        )
      );
    }
    
    if (category && category !== "all") {
      conditions.push(eq(games.category, category));
    }
    
    if (conditions.length === 0) {
      return this.getAllGames();
    } else {
      return db.select().from(games).where(and(...conditions));
    }
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async updateGame(id: number, gameUpdate: Partial<InsertGame>): Promise<Game | undefined> {
    const result = await db
      .update(games)
      .set(gameUpdate)
      .where(eq(games.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteGame(id: number): Promise<boolean> {
    const result = await db.delete(games).where(eq(games.id, id)).returning();
    return result.length > 0;
  }

  async getFeaturedGames(): Promise<Game[]> {
    return db.select().from(games).where(eq(games.featured, true));
  }
}

export const storage = new DatabaseStorage();
