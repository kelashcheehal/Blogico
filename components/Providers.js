"use client";

import AuthProvider from "@/contexts/auth-context";
import ProfileProvider from "@/contexts/profile-context";
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </AuthProvider>
  );
}
