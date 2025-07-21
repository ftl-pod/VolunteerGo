import { createContext, useContext, useState, useCallback } from 'react';

const OpportunityContext = createContext();

export function OpportunityProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOpportunities = useCallback(async (searchResults = {}) => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (searchResults.keyword) query.append("keyword", searchResults.keyword);
      if (searchResults.city) query.append("city", searchResults.city);

      const url = `${import.meta.env.VITE_API_BASE_URL}/opportunities?${query.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      setOpportunities(data);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoading(false);
    }
  }, []); // empty dependency array so it stays stable

  return (
    <OpportunityContext.Provider value={{ opportunities, loading, fetchOpportunities }}>
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunity() {
  return useContext(OpportunityContext);
}
