import "./SearchHeader.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import CitySearch from '../CitySearch/CitySearch';

function SearchHeader({onSearch, onSmartSearch, tags = [], selectedTag = '', onTagChange}) {
    const [city, setCity] = useState(''); // This state needs to be updated by CitySearch
    const [citySuggestions, setCitySuggestions] = useState([]); // This can likely be removed as CitySearch handles its own suggestions
    const [searchTerm, setSearchTerm] = useState('');
    const [tag, setTag] = useState(selectedTag);
    const { user } = useAuth();

    const handleClick = () => {
        onSearch({ keyword: searchTerm, city, tag });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleClick();
        }
    };

    const handleSmartSearch = async () => {
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
                        skills: ["guitar", "singing"], // TODO: replace with real profile data
                        training: ["music therapy"],
                        interests: ["seniors", "health"],
                        saved_opportunities: [] // TODO: also get from profile
                    }
                })
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