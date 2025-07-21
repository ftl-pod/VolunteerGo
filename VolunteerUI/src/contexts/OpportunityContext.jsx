import React, { createContext, useContext, useState, useEffect } from "react";

const OpportunityContext = createContext();

export function OpportunityProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch opportunities based on optional filters (like searchResults)
  const fetchOpportunities = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams(filters).toString();
      const url = `${import.meta.env.VITE_API_BASE_URL}/opportunities${query ? "?" + query : ""}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      setOpportunities(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OpportunityContext.Provider
      value={{ opportunities, loading, error, fetchOpportunities, setOpportunities }}
    >
      {children}
    </OpportunityContext.Provider>
  );
}

// Custom hook for easier usage
export function useOpportunity() {
  return useContext(OpportunityContext);
}
