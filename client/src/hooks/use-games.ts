import { useQuery } from "@tanstack/react-query";
import { Game, GameQuery } from "@shared/schema";

interface UseGamesOptions {
  search?: string;
  category?: string;
  featured?: boolean;
}

export function useGames({ search, category, featured }: UseGamesOptions = {}) {
  let endpoint = "/api/games";
  let params = new URLSearchParams();
  
  if (featured) {
    endpoint = "/api/games/featured";
  } else {
    if (search) params.append("search", search);
    if (category) params.append("category", category);
  }
  
  const queryString = params.toString();
  const queryUrl = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  const { data, isLoading, error } = useQuery<Game[]>({
    queryKey: [queryUrl],
  });
  
  return {
    games: data || [],
    isLoading,
    error,
  };
}
