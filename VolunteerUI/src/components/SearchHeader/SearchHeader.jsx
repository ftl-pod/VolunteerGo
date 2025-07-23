import "./SearchHeader.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import CitySearch from '../CitySearch/CitySearch';
import { useProfile } from '../../contexts/ProfileContext';

function SearchHeader({onSearch, onSmartSearch, tags = [], selectedTag = '', onTagChange}) {
    const [city, setCity] = useState(''); 
    const [citySuggestions, setCitySuggestions] = useState([]); // This can likely be removed as CitySearch handles its own suggestions
    const [searchTerm, setSearchTerm] = useState('');
    const [tag, setTag] = useState(selectedTag);
    const { user } = useAuth();
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
          if (!profile) {
            console.error("Profile not loaded yet");
            return;
          }
        try {
            console.log("Smart Search triggered");
            const res = await fetch("http://localhost:8000/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
                })
            });

            const data = await res.json();
            onSmartSearch(data.recommendations, city);
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
                    <div style={{ position: "relative" }}>
                        {/* Pass setCity as the onSelect prop */}
                        <CitySearch onSelect={setCity} />
                    </div>

                    <input
                        type="text"
                        placeholder="Search by organizations or keywords..."
                        className="search-input main-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

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