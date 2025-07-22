import { createContext, useContext, useState, useCallback } from 'react';

const OpportunityContext = createContext();

export function OpportunityProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchOpportunities = useCallback(async (searchResults = {}, forceRefetch = false) => {
  const cached = localStorage.getItem('opportunities');
  const hasFilters = searchResults.keyword || searchResults.city;

  if (cached && !forceRefetch && !hasFilters) {
    setOpportunities(JSON.parse(cached));
    return; // skip network call
  }

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

    // Only cache unfiltered results
    if (!hasFilters) {
      localStorage.setItem('opportunities', JSON.stringify(data));
    }
  } catch (error) {
    console.error("Failed to fetch opportunities:", error);
  } finally {
    setLoading(false);
  }
}, []);

  return (
    <OpportunityContext.Provider value={{ opportunities, loading, fetchOpportunities }}>
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunity() {
  return useContext(OpportunityContext);
}
