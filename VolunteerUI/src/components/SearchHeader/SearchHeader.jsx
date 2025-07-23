import "./SearchHeader.css";
import { useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';


function SearchHeader({onSearch, onSmartSearch, tags = [], selectedTag = '', onTagChange}) {
    const [city, setCity] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tag, setTag] = useState(selectedTag);
    const { profile } = useProfile();
    

    const handleClick = () => {
        onSearch({ keyword: searchTerm, city, tag });
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleClick();
        }
    };
    const handleSmartSearch = async () => {
      if (!profile) return;
    try {
            console.log("Smart Search triggered");
        const res = await fetch("http://localhost:8000/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_prompt: searchTerm,
            user_profile: {
              skills: profile.skills || ["guitar", "singing"],
              training: profile.training || ["music therapy"],
              interests: profile.interests || ["seniors", "health", "education"],
              saved_opportunities:
                profile.savedOpportunities?.map((opp) => opp.id) || [],
            },
          }),
        });

        const data = await res.json();
        onSmartSearch(data.recommendations); // send back to SearchPage
    } catch (err) {
        console.error("Smart search failed:", err);
    }
    };

  const handleTagChange = (e) => {
    const newTag = e.target.value;
    setTag(newTag);
    if (onTagChange) {
      onTagChange(newTag);
    }
    onSearch({ keyword: searchTerm, city, tag: newTag });
  };

  return (
    <div className="search-header">
      <div className="search-container">
        <h1 className="search-title">Find Your Next Opportunity</h1>
        <p className="search-subtitle">
          Discover amazing volunteer opportunities that match your skills and
          interests
        </p>

        <div className="search-form">
          <input
            type="text"
            placeholder="San Francisco, CA"
            className="search-input city-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search by organizations or keywords..."
            className="search-input main-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="search-button" onClick={handleClick}>
            Search
          </button>
            <button className="smart-search-button" onClick={handleSmartSearch}>
                Smart Search
            </button>
          <select
            className="tag-dropdown"
            value={tag}
            onChange={handleTagChange}
          >
            <option value="">All Tags</option>
            {tags.map((tagOption) => (
              <option key={tagOption} value={tagOption}>
                {tagOption}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchHeader;
