import { useState } from 'react';
import SearchHeader from "../SearchHeader/SearchHeader";
import OpportunityGrid from '../OpportunityGrid/OpportunityGrid';
import { useOpportunity } from "../../contexts/OpportunityContext";
import './SearchPage.css';

function SearchPage() {
  const [searchResults, setSearchResults] = useState({ keyword: '', city: '', tag: '' });
const [smartResults, setSmartResults] = useState([]);
  const { opportunities } = useOpportunity();

  // take the unique tags from opportunities by flattening all tags arrays and creating a Set
  const allTags = opportunities ? opportunities.flatMap(opp => Array.isArray(opp.tags) ? opp.tags : []) : [];
  const uniqueTags = Array.from(new Set(allTags)).sort();

  return (
    <div className="search-page">
      <div className="search-page-content">
        <SearchHeader
          onSearch={setSearchResults}
          tags={uniqueTags}
          selectedTag={searchResults.tag}
          onTagChange={(tag) => setSearchResults((prev) => ({ ...prev, tag }))}
          onSmartSearch={setSmartResults}
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
