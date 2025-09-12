"use client";
import Navbar from "@/components/navbar";
import { useBlog } from "@/contexts/blog-context";

export default function HomePage() {
  const { blogs } = useBlog();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="rounded-xl border shadow-md bg-white dark:bg-gray-900 overflow-hidden"
          >
            {blog.thumbnail && (
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{blog.category}</p>
              <div
                className="prose prose-sm max-w-none dark:prose-invert line-clamp-3"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 flex justify-between text-xs text-gray-400">
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              <span>Author: {blog.author_id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
