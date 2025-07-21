import { createContext, useContext, useEffect, useState } from "react";

const LeaderboardContext = createContext();

export function LeaderboardProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <LeaderboardContext.Provider value={{ users, loading, refreshLeaderboard: fetchLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  return useContext(LeaderboardContext);
}
