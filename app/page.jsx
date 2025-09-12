"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import { useBlog } from "@/contexts/blog-context";
import { Loader2, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { blogs, loading } = useBlog();
  const [likes, setLikes] = useState({});

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : 1,
    }));
  };

  const handleShare = (blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content.replace(/<[^>]+>/g, "").slice(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center h-[70vh] text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading blogs...
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
          {blogs.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No blogs found.
            </p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="rounded-lg border shadow-sm bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition"
              >
                {blog.thumbnail && (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-28 object-cover"
                  />
                )}

                <div className="p-2">
                  <h2 className="text-sm font-semibold line-clamp-1 mb-1">
                    {blog.title}
                  </h2>
                  <p className="text-[10px] text-gray-500 mb-1">
                    {blog.category}
                  </p>
                  <div
                    className="prose prose-xs max-w-none dark:prose-invert line-clamp-2 text-xs text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>

                {/* Footer */}
                <div className="px-2 pb-1 flex justify-between text-[10px] text-gray-400">
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  <span>By {blog.author_name}</span>
                </div>

                {/* Actions */}
                <div className="px-2 pb-2 flex items-center justify-between border-t pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(blog.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 h-6 px-2"
                  >
                    <Heart className="h-3 w-3" />
                    <span className="text-[10px]">{likes[blog.id] || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 h-6 px-2"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span className="text-[10px]">Comment</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(blog)}
                    className="flex items-center gap-1 text-gray-500 hover:text-green-500 h-6 px-2"
                  >
                    <Share2 className="h-3 w-3" />
                    <span className="text-[10px]">Share</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
