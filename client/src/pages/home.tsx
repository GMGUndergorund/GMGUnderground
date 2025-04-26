import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import GameCard from "@/components/game-card";
import AdminLoginModal from "@/components/admin-login-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGames } from "@/hooks/use-games";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@shared/schema";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const { games, isLoading, error } = useGames({ 
    search: searchQuery, 
    category: selectedCategory === "all" ? undefined : selectedCategory 
  });
  
  const gamesPerPage = 8;
  const totalPages = Math.ceil((games?.length || 0) / gamesPerPage);
  
  const paginatedGames = games?.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAdminClick={() => setShowLoginModal(true)} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-gaming font-bold">GMG Underground Featured Games</h2>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Search games..." 
                className="bg-card w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <i className="ri-search-line"></i>
              </button>
            </form>
            
            <Select 
              value={selectedCategory} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="bg-card w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="rpg">RPG</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-lg border border-border animate-pulse h-80"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load games. Please try again later.</p>
          </div>
        ) : paginatedGames?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No games found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedGames?.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-r-none"
              >
                Previous
              </Button>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    className="rounded-none border-x-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-l-none"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      
      <AdminLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
