"use client";

import { supabase } from "@/lib/supabaseClient";
import { createContext, useEffect, useState, useContext, useMemo } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoading(false);
  };

  const value = useMemo(() => {
    return {
      logout,
      isLoading,
    };
  }, [isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
