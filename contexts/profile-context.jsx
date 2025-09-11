"use client";

import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProfileContext = createContext(null);

const ProfileProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // ✅ Helper function: Save user in DB if not exists
  const saveUser = async (user) => {
    if (!user) return;

    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (selectError) {
      console.error("Select error:", selectError.message);
      return;
    }

    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          name: user.user_metadata.full_name || user.user_metadata.name || "",
          email: user.email,
          role: "user",
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
      } else {
        console.log("✅ User inserted successfully");
      }
    }
  };

  // Current User
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error.message);

      const user = data.session?.user || null;
      setCurrentUser(user);
      setIsLoading(false);

      // ✅ First login -> save in DB
      if (user) {
        await saveUser(user);
      }
    };

    getCurrentUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        setCurrentUser(user);
        setIsLoading(false);

        // ✅ New session (Google login, etc.)
        if (user) {
          await saveUser(user);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Profile Data
  useEffect(() => {
    const getProfileData = async () => {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser?.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error.message);
        setProfileData(null);
        return;
      }

      if (!data) {
        console.log("No user row found in users table");
        setProfileData(null);
        return;
      }

      setProfileData(data);
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
      setCurrentUser,
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
