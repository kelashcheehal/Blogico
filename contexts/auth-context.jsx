"use client";

import { supabase } from "@/lib/supabaseClient";
import { createContext, useEffect, useState, useContext, useMemo } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error.message);
      setCurrentUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    getCurrentUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
  };

  const value = useMemo(
    () => ({ currentUser, logout: handleLogout }),
    [currentUser, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
