"use client"

import { X, Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FavoritesModal({ isOpen, onClose, favoriteBlogs = [] }) {
  const handleRemoveFavorite = (blogId) => {
    console.log("Removing blog from favorites:", blogId)
    // Handle remove logic here
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300 ease-in-out",
        isOpen ? "visible" : "invisible"
      )}>
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose} />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[30%] min-w-80 bg-background border-l shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
        <div className="modal-content flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Favorite Blogs
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {favoriteBlogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium text-muted-foreground mb-2">No favorites yet</h4>
                <p className="text-sm text-muted-foreground">Start adding blogs to your favorites!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {blog.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">by {blog.author}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                        onClick={() => handleRemoveFavorite(blog.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
