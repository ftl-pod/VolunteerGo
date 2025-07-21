// src/contexts/ProfileContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user, isSignedIn, isLoaded } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user?.uid || !isSignedIn) return;

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${user.uid}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      fetchProfile();
    }
  }, [user, isSignedIn, isLoaded]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
