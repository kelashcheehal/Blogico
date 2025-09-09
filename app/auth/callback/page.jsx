"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const fn = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("Auth error:", error.message);
        router.push("/"); // ya jahan tum modal kholna chahte ho
        return;
      }

      console.log("✅ Session:", data.session);
      router.push("/"); // callback ke baad home pe bhej do
    };

    fn();
  }, [router]);

  return <p className="text-center">Signing you in...</p>;
}
