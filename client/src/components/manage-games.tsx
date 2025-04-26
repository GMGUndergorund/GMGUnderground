import { useState } from "react";
import { useGames } from "@/hooks/use-games";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Game } from "@shared/schema";
import UploadGameForm from "./upload-game-form";

export default function ManageGames() {
  const { games, isLoading, error } = useGames({});
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  
  const filteredGames = games?.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteGame = async () => {
    if (!gameToDelete) return;
    
    try {
      const response = await fetch(`/api/games/${gameToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete game");
      }
      
      await queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      
      toast({
        title: "Game deleted",
        description: `${gameToDelete.title} has been removed from the library`,
      });
      
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setGameToDelete(null);
    }
  };
  
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search games..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      
      {isLoading ? (
        <div className="bg-card-foreground/5 rounded-lg h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading games...</p>
        </div>
      ) : error ? (
        <div className="bg-card-foreground/5 rounded-lg h-64 flex items-center justify-center">
          <p className="text-destructive">Failed to load games</p>
        </div>
      ) : filteredGames?.length === 0 ? (
        <div className="bg-card-foreground/5 rounded-lg h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No games found</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames?.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={game.imageUrl}
                          alt={game.title}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{game.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {game.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{game.category}</TableCell>
                  <TableCell>{game.fileSize}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setGameToEdit(game)}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-100/10"
                      >
                        <i className="ri-edit-line"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setGameToDelete(game)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!gameToDelete} onOpenChange={(open) => !open && setGameToDelete(null)}>
        <AlertDialogContent className="bg-card text-card-foreground border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {gameToDelete?.title} from the game library.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGame} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Game Dialog */}
      <Dialog open={!!gameToEdit} onOpenChange={(open) => !open && setGameToEdit(null)}>
        <DialogContent className="bg-card text-card-foreground border-border max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Game: {gameToEdit?.title}</DialogTitle>
          </DialogHeader>
          {gameToEdit && (
            <div className="py-4">
              <UploadGameForm onSuccess={() => setGameToEdit(null)} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
