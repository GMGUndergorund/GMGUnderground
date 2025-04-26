import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      console.log("Submitting password:", data.password);
      const success = await login(data.password);
      console.log("Login success?", success);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
        // Force a reload of the page when navigating
        onClose();
        localStorage.setItem("auth", "true");
        setTimeout(() => {
          navigate("/admin");
          // Force a reload to ensure fresh state
          window.location.href = "/admin";
        }, 100);
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid password. Please try 'GMG1707.3'",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login submission error:", error);
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground border-border login-overlay">
        <DialogHeader>
          <DialogTitle className="text-xl font-gaming font-bold">Admin Login</DialogTitle>
          <DialogDescription>
            Enter your admin password to access the management panel.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter password" 
                      className="bg-card-foreground/5" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i> Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <i className="ri-login-box-line"></i> Login
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
