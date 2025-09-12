"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // track if search was attempted
  const [error, setError] = useState(null);
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .or(
        `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
      );

    if (error) {
      setError(error);
      setBlogs([]);
    } else {
      setBlogs(data || []);
    }

    setLoading(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out",
        isOpen ? "visible" : "invisible"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-md transition-all duration-300 transform",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="bg-background border rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Search</h3>
            <Button variant="ghost" size="sm" onClick={onClose} type="button">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search blogs, authors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
            <Button type="submit" disabled={loading || !searchQuery.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </form>

          {/* Results */}
          <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Searching...
              </div>
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="p-3 border rounded-lg hover:bg-accent transition cursor-pointer"
                >
                  <h4 className="font-medium">{blog.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {blog.content?.replace(/<[^>]+>/g, "").slice(0, 100)}...
                  </p>
                </div>
              ))
            ) : (
              searched && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No results found.
                </p>
              )
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
