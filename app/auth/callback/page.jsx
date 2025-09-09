"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error) {
          console.error("Auth error:", error.message);
          router.push("/login"); // agar error aaye to login page bhejo
          return;
        }

        // Successfully logged in → redirect to homepage
        router.push("/");
      } catch (err) {
        console.error("Unexpected error:", err);
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Signing you in...</p>
    </div>
  );
}
