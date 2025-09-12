"use client";

import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProfileContext = createContext(null);

const ProfileProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Current User
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error.message);
      setCurrentUser(data.session?.user || null);
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

  // Profile Data
  useEffect(() => {
    const getProfileData = async () => {
      if (!currentUser) {
        setProfileData(null);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle(); // <-- safe, returns null if user doesn't exist

      if (error) {
        console.log("Error fetching profile:", error.message);
        setProfileData(null);
      } else {
        setProfileData(data); // data can be null if row doesn't exist
      }
    };

    getProfileData();
  }, [currentUser]);

  // Avatar URL
  const avatarUrl =
    profileData?.avatar || currentUser?.user_metadata?.avatar_url || null;
  const avatarFallback = currentUser?.email?.charAt(0).toUpperCase() || "?";

  const displayName = useMemo(() => {
    if (profileData?.name) return profileData.name;
    if (currentUser?.user_metadata?.full_name)
      return currentUser.user_metadata.full_name;
    return "?";
  }, [
    profileData?.name,
    currentUser?.user_metadata?.full_name,
    currentUser?.email,
  ]);

  const value = useMemo(
    () => ({
      currentUser,
      displayName,
      avatarUrl,
      avatarFallback,
      profileData,
      isLoading,
      
    }),
    [
      currentUser,
      displayName,
      avatarUrl,
      avatarFallback,
      profileData,
      isLoading,

    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
export default ProfileProvider;
