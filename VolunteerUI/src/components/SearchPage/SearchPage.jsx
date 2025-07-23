import { useState } from 'react';
import SearchHeader from "../SearchHeader/SearchHeader";
import OpportunityGrid from '../OpportunityGrid/OpportunityGrid';
import { useOpportunity } from "../../contexts/OpportunityContext";
import './SearchPage.css';

function SearchPage({ apiLoaded }) {
  // only keep city and tag in searchResults since keyword is ignored
  const [searchResults, setSearchResults] = useState({ city: '', tag: '' });
  const [smartResults, setSmartResults] = useState([]);
  const { opportunities } = useOpportunity();

  // Unique tags for dropdown
  const allTags = opportunities ? opportunities.flatMap(opp => Array.isArray(opp.tags) ? opp.tags : []) : [];
  const uniqueTags = Array.from(new Set(allTags)).sort();

  // Filter smart recommendations by city and tag
  const smartFilter = (recommendations, city) => {
    // Filter by city first
    let filtered = recommendations.filter((opp) => {
      if (!city) return true;
      if (!opp.location) return false;
      return opp.location.toLowerCase().includes(city.toLowerCase());
    });

    // Then filter by tag (if any)
    if (searchResults.tag) {
      filtered = filtered.filter((opp) => opp.tags?.includes(searchResults.tag));
    }

    setSmartResults(filtered);

    // Update city in searchResults state to keep UI in sync
    setSearchResults((prev) => ({ ...prev, city }));
  };

  // When tag changes, update searchResults and re-filter smartResults by tag + city
  const handleTagChange = (tag) => {
    setSearchResults((prev) => {
      const updated = { ...prev, tag };
      // Re-filter smartResults with new tag and existing city
      let filtered = smartResults.filter((opp) => {
        if (!opp.location) return false;
        const cityMatch = !updated.city || opp.location.toLowerCase().includes(updated.city.toLowerCase());
        const tagMatch = !tag || opp.tags?.includes(tag);
        return cityMatch && tagMatch;
      });
      setSmartResults(filtered);
      return updated;
    });
  };

  return (
    <div className="search-page">
      <div className="search-page-content">
        <SearchHeader
          onSearch={() => {}}
          tags={uniqueTags}
          selectedTag={searchResults.tag}
          onTagChange={handleTagChange}
          onSmartSearch={smartFilter}
          apiLoaded={apiLoaded}
        />
        <OpportunityGrid
          searchResults={searchResults}
          overrideOpportunities={smartResults}
        />
      </div>
    </div>
  );
}

export default SearchPage;
