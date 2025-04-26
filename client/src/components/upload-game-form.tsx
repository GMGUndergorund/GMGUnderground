import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGameSchema, type InsertGame } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface UploadGameFormProps {
  onSuccess?: () => void;
}

export default function UploadGameForm({ onSuccess }: UploadGameFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const form = useForm<InsertGame>({
    resolver: zodResolver(insertGameSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "action",
      imageUrl: "",
      downloadUrl: "",
      fileSize: "",
      releaseDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      featured: false,
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: InsertGame) => {
    const fileInput = document.getElementById("game-image") as HTMLInputElement;
    const gameImage = fileInput?.files?.[0];
    
    if (!gameImage) {
      toast({
        title: "Image required",
        description: "Please select a game image",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("downloadUrl", data.downloadUrl);
      formData.append("fileSize", data.fileSize);
      formData.append("releaseDate", data.releaseDate);
      formData.append("featured", String(data.featured));
      formData.append("image", gameImage);
      
      const response = await fetch("/api/games", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload game");
      }
      
      await queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      
      toast({
        title: "Game uploaded",
        description: "Game has been successfully added to the library",
      });
      
      form.reset();
      setLogoPreview(null);
      if (onSuccess) onSuccess();
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the game",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-card-foreground/5 rounded-lg p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter game title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="rpg">RPG</SelectItem>
                      <SelectItem value="strategy">Strategy</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter game description" 
                    rows={3} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="game-image">Game Image/Cover</FormLabel>
              <div className="flex items-center space-x-4 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => document.getElementById("game-image")?.click()}
                >
                  <i className="ri-image-add-line mr-2"></i> Choose Image
                </Button>
                <input
                  id="game-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="h-16 w-16 bg-card-foreground/5 rounded-md flex items-center justify-center overflow-hidden border border-border">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <i className="ri-image-line text-muted-foreground text-xl"></i>
                  )}
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="fileSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Size</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 4.2 GB" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the game size with unit (GB, MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="downloadUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Download Link</FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="https://example.com/download-link" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Direct download link to the game file
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Featured Game</FormLabel>
                  <FormDescription>
                    Display this game in the featured section
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i> Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="ri-upload-cloud-line"></i> Upload Game
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
