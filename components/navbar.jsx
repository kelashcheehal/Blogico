"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  Home,
  BookOpen,
  Info,
  Mail,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import FavoritesModal from "./favorites-modal";
import SearchModal from "./search-modal";
import { AuthModal } from "./auth-modal";
import { useProfile } from "@/contexts/profile-context";
import BlogModal from "./blog-modal";
import { useAuth } from "@/contexts/auth-context";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { profileData, avatarUrl, avatarFallback } = useProfile();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const favoriteBlogs = [
    { id: 1, title: "Getting Started with React", author: "Jane Smith" },
    { id: 2, title: "Advanced JavaScript Patterns", author: "Mike Johnson" },
    { id: 3, title: "CSS Grid Mastery", author: "Sarah Wilson" },
    { id: 4, title: "Node.js Best Practices", author: "David Brown" },
  ];

  // Memoize nav links (avoid re-creation on re-renders)
  const navLinks = useMemo(
    () => [
      { name: "Home", href: "/", icon: Home },
      { name: "Blogs", href: "/blogs", icon: BookOpen },
      { name: "About", href: "/about", icon: Info },
      { name: "Contact", href: "/contact", icon: Mail },
      { name: "Create Blog", href: "/create-blog", icon: Plus },
    ],
    []
  );

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto sm:px-6 lg:px-20">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button - Left */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="hover:bg-accent transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo */}
            <div className="flex items-center md:flex-none flex-1">
              <div className="text-2xl font-bold">Blogico</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBlogOpen(true)}
                className="hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Favorites Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavoritesOpen(true)}
                className="relative hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <Heart className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {favoriteBlogs.length}
                </Badge>
              </Button>

              {/* Profile Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(true)}
                className="hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Sidebar Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-full bg-background border-l shadow-xl transform transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-xl font-bold">Menu</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Profile Section */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  {avatarUrl ? (
                    <AvatarImage
                      src={avatarUrl}
                      alt={profileData?.name || "User"}
                    />
                  ) : (
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">
                    {profileData
                      ? profileData.name.charAt(0).toUpperCase() +
                        profileData.name.slice(1)
                      : "Guest User"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profileData?.email ? profileData?.email : "Not logged"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteBlogs={favoriteBlogs}
      />
      <AuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isLoggedIn={isLoggedIn}
        user={profileData}
        onLogin={handleLogin}
        onLogout={logout}
      />
      {/* Blog Modal OR Auth Modal */}
      {profileData ? (
        <BlogModal isOpen={isBlogOpen} onClose={() => setIsBlogOpen(false)} />
      ) : (
        <AuthModal
          isOpen={isBlogOpen}
          onClose={() => setIsBlogOpen(false)}
          isLoggedIn={isLoggedIn}
          user={profileData}
          onLogin={handleLogin}
          onLogout={logout}
        />
      )}
    </>
  );
}
