"use client";

import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth-context";

const ProfileContext = createContext(null);

const ProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState(null);
  // 🔹 Fetch profile whenever user changes
  useEffect(() => {
    if (!currentUser?.id) {
      setProfileData(null);
      return;
    }

    const getProfileData = async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        setError(error);
      } else {
        setProfileData(data);
      }
      setLoadingProfile(false);
    };

    getProfileData();
  }, [currentUser]);

  // 🔹 Update profile
  const updateProfile = async (updates) => {
    if (!currentUser?.id) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", currentUser.id)
      .select()
      .maybeSingle();

    if (error) throw error;

    setProfileData(data);
    return data;
  };

  // 🔹 Avatar (real Google avatar if available)
  const avatar = useMemo(() => {
    if (profileData?.avatar) return profileData.avatar;
    if (currentUser?.user_metadata?.avatar_url)
      return currentUser.user_metadata.avatar_url;

    return null;
  }, [profileData?.avatar, currentUser?.user_metadata?.avatar_url]);

  // 🔹 Display name (priority: Auth → DB → fallback)
  const displayName = useMemo(() => {
    return (
      currentUser?.user_metadata?.full_name ||
      currentUser?.user_metadata?.name ||
      currentUser?.user_metadata?.username ||
      profileData?.username ||
      profileData?.full_name ||
      "User"
    );
  }, [currentUser, profileData]);

  const value = useMemo(
    () => ({
      profileData,
      loadingProfile,
      updateProfile,
      avatar,
      displayName, // 👈 ab yaha directly available
    }),
    [profileData, loadingProfile, avatar, displayName]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
export default ProfileProvider;
