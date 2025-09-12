"use client";

import AuthProvider from "@/contexts/auth-context";
import BlogProvider from "@/contexts/blog-context";
import ProfileProvider from "@/contexts/profile-context";
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BlogProvider>{children}</BlogProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
