"use client";
import Navbar from "@/components/navbar";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Our Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing content, save your favorites, and explore our
            community of writers and readers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">Blog Post {item}</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
