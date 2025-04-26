// This file provides static data access for the HTML version

import { Game, Tag } from "@shared/schema";

// Function to fetch JSON data from local files
async function fetchLocalJson(path: string) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

// Get all games
export async function getGames(): Promise<Game[]> {
  return fetchLocalJson('/data/games.json');
}

// Get featured games
export async function getFeaturedGames(): Promise<Game[]> {
  return fetchLocalJson('/data/featured-games.json');
}

// Get game by ID
export async function getGameById(id: number): Promise<Game | undefined> {
  const games = await getGames();
  return games.find(game => game.id === id);
}

// Search games
export async function searchGames(
  query: string = "", 
  category?: string, 
  tagIds?: number[]
): Promise<Game[]> {
  const games = await getGames();
  
  return games.filter(game => {
    // Filter by search query
    if (query && !game.title.toLowerCase().includes(query.toLowerCase()) && 
        !game.description.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (category && category !== "all" && game.category !== category) {
      return false;
    }
    
    // Filter by tags (would need tag-game associations in data files)
    if (tagIds && tagIds.length > 0) {
      // This is a simplified version - would need game.tags in the data file
      return true;
    }
    
    return true;
  });
}

// Get all tags
export async function getTags(): Promise<Tag[]> {
  return fetchLocalJson('/data/tags.json');
}

// Simulated login for HTML version
export async function loginAdmin(password: string): Promise<boolean> {
  // For static HTML version, hardcode the admin password check
  return password === "GMG1707.3";
}