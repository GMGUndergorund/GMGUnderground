import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAdminClick: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    // This is just for UI display as we're using dark mode by default
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <i className="ri-gamepad-line text-primary text-3xl"></i>
          <h1 className="text-2xl font-bold font-gaming text-foreground">
            GMG <span className="text-primary">Underground</span>
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
          >
            {darkMode ? (
              <i className="ri-moon-line text-foreground text-xl"></i>
            ) : (
              <i className="ri-sun-line text-foreground text-xl"></i>
            )}
          </Button>
          <Button 
            onClick={onAdminClick} 
            className="bg-primary hover:bg-primary/90 flex items-center gap-1"
          >
            <i className="ri-admin-line"></i>
            <span>Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
