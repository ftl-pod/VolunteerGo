import { useState } from "react";
import SearchHeader from "../SearchHeader/SearchHeader";
import OpportunityGrid from "../OpportunityGrid/OpportunityGrid";
import { useOpportunity } from "../../contexts/OpportunityContext";
import { useProfile } from "../../contexts/ProfileContext";
import "./SearchPage.css";

function SearchPage({ apiLoaded }) {
  const { profile } = useProfile();

  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    city: "",
    tag: "",
    format: "",
    skill: "",
  });

  const [smartResults, setSmartResults] = useState([]);
  const { opportunities } = useOpportunity();

  const allTags = opportunities?.flatMap((opp) => opp.tags || []) || [];
  const allSkills = opportunities?.flatMap((opp) => opp.skills || []) || [];
  const uniqueTags = Array.from(new Set(allTags)).sort();
  const uniqueSkills = Array.from(new Set(allSkills)).sort();

  // Smart Search with user profile logic
  const handleSmartSearch = async (searchTerm) => {
    const userProfile = profile
      ? {
          skills: profile.skills || [],
          training: profile.training || [],
          interests: profile.interests || [],
          saved_opportunities:
            profile.savedOpportunities?.map((opp) => opp.id) || [],
        }
      : {
          skills: [],
          training: [],
          interests: [],
          saved_opportunities: [],
        };

    try {
      const res = await fetch(`${import.meta.env.VITE_SEARCH_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_prompt: searchTerm,
          filters: searchFilters,
          user_profile: userProfile,
        }),
      });

      const data = await res.json();
      setSearchFilters((prev) => ({ ...prev, searchTerm }));
      smartFilter(data.recommendations);
    } catch (error) {
      console.error("Error during smart search:", error);
    }
  };

  // Apply filters on recommendations
  const smartFilter = (recommendations) => {
    const { city, tag, format, skill } = searchFilters;
    let filtered = recommendations;

    if (city) {
      filtered = filtered.filter((opp) =>
        opp.location?.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (tag) {
      filtered = filtered.filter((opp) => opp.tags?.includes(tag));
    }

    if (format) {
      filtered = filtered.filter((opp) => {
        const loc = opp.location?.toLowerCase() || "";
        const isVirtual = ["virtual", "online", "remote", "zoom"].some((kw) =>
          loc.includes(kw)
        );

        if (format === "remote") return !opp.location || isVirtual;
        if (format === "in-person") return opp.location && opp.date && !isVirtual;
        if (format === "hybrid") return opp.location && !opp.date && !isVirtual;
        return true;
      });
    }

    if (skill) {
      filtered = filtered.filter((opp) => opp.skills?.includes(skill));
    }

    setSmartResults(filtered);
  };

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => {
      const updated = { ...prev, [key]: value };
      smartFilter(smartResults);
      return updated;
    });
  };

  // Clear all filters and results
  const handleClear = () => {
    setSearchFilters({
      searchTerm: "",
      city: "",
      tag: "",
      format: "",
      skill: "",
    });
    setSmartResults([]);
  };

  return (
    <div className="search-page">
      <div className="search-page-content">
        <SearchHeader
          onSmartSearch={handleSmartSearch}
          onClear={handleClear}
          filters={searchFilters}
          onFilterChange={handleFilterChange}
          tags={uniqueTags}
          skills={uniqueSkills}
          apiLoaded={apiLoaded}
         
        />
        <OpportunityGrid
          searchResults={searchFilters}
          overrideOpportunities={smartResults}
        />
      </div>
    </div>
  );
}

export default SearchPage;
