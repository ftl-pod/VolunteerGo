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

    const token = await user.getIdToken();

    let res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${user.uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (res.status === 404) {
      // Not found — create the user
      const createRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
            username: user.displayName || "Anonymous",
          }),
        }
      );

      if (!createRes.ok) {
        const errText = await createRes.text();
        throw new Error("Auto-create failed: " + errText);
      }

      // Retry fetching the newly created profile
      res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${user.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
    }

    if (!res.ok) throw new Error("Failed to fetch profile");

    const data = await res.json();
    setProfile(data);
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
