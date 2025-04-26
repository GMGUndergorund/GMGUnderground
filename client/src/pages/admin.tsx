import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import UploadGameForm from "@/components/upload-game-form";
import ManageGames from "@/components/manage-games";

export default function Admin() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");

  // Check for authentication as soon as component loads
  useEffect(() => {
    console.log("Admin page - Authentication check:", isAuthenticated);
    console.log("Local storage auth:", localStorage.getItem("auth"));
    
    // A small delay to ensure state is updated
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting");
        toast({
          title: "Authentication required",
          description: "Please login to access the admin panel",
          variant: "destructive",
        });
        navigate("/");
      } else {
        console.log("Successfully authenticated");
      }
    }, 100);
    
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, navigate, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg p-6 border border-border shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <i className="ri-gamepad-line text-primary text-3xl"></i>
              <h1 className="text-2xl font-bold font-gaming text-foreground">
                GMG <span className="text-primary">Underground</span> Admin
              </h1>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleLogout} 
              className="flex items-center gap-2"
            >
              <i className="ri-logout-box-line"></i> Logout
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload">Upload New Game</TabsTrigger>
              <TabsTrigger value="manage">Manage Games</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-0">
              <UploadGameForm onSuccess={() => setActiveTab("manage")} />
            </TabsContent>
            
            <TabsContent value="manage" className="mt-0">
              <ManageGames />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
