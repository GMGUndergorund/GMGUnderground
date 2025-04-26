import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, loginSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "dist", "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const admin = await storage.getAdmin();
      
      if (!admin || admin.password !== data.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we would set a secure session here
      return res.json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Game CRUD operations
  // Get all games with optional filtering
  app.get("/api/games", async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      
      const games = await storage.searchGames(search || "", category);
      
      return res.json(games);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get featured games
  app.get("/api/games/featured", async (req: Request, res: Response) => {
    try {
      const games = await storage.getFeaturedGames();
      return res.json(games);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get a specific game by ID
  app.get("/api/games/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGameById(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      return res.json(game);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new game
  app.post("/api/games", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "Game image is required" });
      }
      
      const imageUrl = `/uploads/${file.filename}`;
      
      // Parse and validate the request body
      const gameData = {
        ...req.body,
        imageUrl,
        featured: req.body.featured === "true",
      };
      
      const validatedData = insertGameSchema.parse(gameData);
      const game = await storage.createGame(validatedData);
      
      return res.status(201).json(game);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update an existing game
  app.put("/api/games/:id", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingGame = await storage.getGameById(id);
      
      if (!existingGame) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      let updateData: any = { ...req.body };
      
      // Handle image update if provided
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      // Handle boolean conversion
      if (typeof updateData.featured === "string") {
        updateData.featured = updateData.featured === "true";
      }
      
      const updatedGame = await storage.updateGame(id, updateData);
      
      return res.json(updatedGame);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete a game
  app.delete("/api/games/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGame(id);
      
      if (!success) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadsDir));

  const httpServer = createServer(app);
  return httpServer;
}
