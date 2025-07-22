import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user, isSignedIn, isLoaded } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user?.uid || !isSignedIn) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${user.uid}`, {
        cache: "no-store", // prevent caching issues
      });

      if (res.status === 404) {
        // Profile not found in backend DB yet — not an error, but profile is null
        setProfile(null);
      } else if (!res.ok) {
        throw new Error("Failed to fetch profile");
      } else {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset profile immediately on user/signin change
    setProfile(null);

    if (isSignedIn && isLoaded) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user?.uid, isSignedIn, isLoaded]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
