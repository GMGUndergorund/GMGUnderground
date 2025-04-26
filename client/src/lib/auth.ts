import React, { useState, useEffect, ReactNode } from "react";

// Simple auth service without context
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = async (password: string): Promise<boolean> => {
    try {
      // Debug output
      console.log("Attempting login with password:", password);
      
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      
      const result = await response.json();
      console.log("Login response:", result);
      
      if (response.ok) {
        localStorage.setItem("auth", "true");
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
  };
  
  return { isAuthenticated, login, logout };
}

// Fake AuthProvider for compatibility with existing code
export function AuthProvider({ children }: { children: ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}