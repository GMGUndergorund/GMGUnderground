import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      action: "bg-primary",
      adventure: "bg-orange-600",
      rpg: "bg-green-600",
      strategy: "bg-blue-600",
      sports: "bg-yellow-600",
    };
    
    return colors[category.toLowerCase()] || "bg-gray-600";
  };
  
  const handleDownload = () => {
    // In a real application, we might want to track downloads or handle the link differently
    window.open(game.downloadUrl, "_blank");
    
    toast({
      title: "Download started",
      description: `${game.title} download initiated`,
    });
  };
  
  return (
    <>
      <Card className="game-card overflow-hidden shadow-lg border-border">
        <div className="relative">
          <img 
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowDetails(true)}
          />
          <div className={`absolute top-0 right-0 ${getCategoryColor(game.category)} text-white text-xs font-bold px-2 py-1 m-2 rounded`}>
            {game.category}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-gaming font-bold text-foreground mb-2">{game.title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{game.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              <i className="ri-hard-drive-line mr-1"></i> {game.fileSize}
            </span>
            <span className="text-sm text-muted-foreground">
              <i className="ri-calendar-line mr-1"></i> {game.releaseDate}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button 
              onClick={() => setShowDetails(true)}
              variant="outline"
              className="w-full"
            >
              <i className="ri-information-line mr-1"></i> Details
            </Button>
            <Button 
              onClick={handleDownload}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <i className="ri-download-line mr-1"></i> Download
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Game Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-card text-card-foreground border-border max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gaming font-bold flex items-center">
              {game.title} 
              <span className={`ml-3 ${getCategoryColor(game.category)} text-white text-xs font-bold px-2 py-1 rounded`}>
                {game.category}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-4 max-h-[calc(90vh-8rem)]">
            <div>
              <img 
                src={game.imageUrl} 
                alt={game.title} 
                className="w-full rounded-lg object-cover shadow-md" 
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">File Size</h4>
                  <p className="text-sm text-muted-foreground">
                    <i className="ri-hard-drive-line mr-1"></i> {game.fileSize}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Release Date</h4>
                  <p className="text-sm text-muted-foreground">
                    <i className="ri-calendar-line mr-1"></i> {game.releaseDate}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleDownload}
                className="w-full mt-4 bg-primary hover:bg-primary/90"
              >
                <i className="ri-download-line mr-1"></i> Download Now
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <div className="text-muted-foreground text-sm space-y-2">
                  {game.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Additional Information</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Category: {game.category}</li>
                  <li>Added: {game.createdAt ? new Date(game.createdAt as unknown as string).toLocaleDateString() : 'Unknown'}</li>
                  {game.featured && <li className="text-primary font-semibold">Featured Game</li>}
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
