import "./SearchHeader.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import CitySearch from '../CitySearch/CitySearch';
import { useProfile } from '../../contexts/ProfileContext';

function SearchHeader({onSearch, onSmartSearch, tags = [], selectedTag = '', onTagChange}) {
    // Search and existing states
    const [city, setCity] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]); // This can likely be removed as CitySearch handles its own suggestions
    const [searchTerm, setSearchTerm] = useState('');
    const [tag, setTag] = useState(selectedTag);
    
    // New filter states
    const [dateRange, setDateRange] = useState('');
    const [duration, setDuration] = useState('');
    const [timeCommitment, setTimeCommitment] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [organizationType, setOrganizationType] = useState('');
    const [remote, setRemote] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const { user } = useAuth();
    const { profile } = useProfile();
    
    // Collect all filter values
    const getFilters = () => ({
        keyword: searchTerm,
        city,
        tag,
        dateRange,
        duration,
        timeCommitment,
        skillLevel,
        organizationType,
        remote
    });

    const handleClick = () => {
        onSearch(getFilters());
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
                    filters: getFilters(),
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

    const clearAllFilters = () => {
        setCity('');
        setTag('');
        setDateRange('');
        setDuration('');
        setTimeCommitment('');
        setSkillLevel('');
        setOrganizationType('');
        setRemote('');
        onSearch({ keyword: searchTerm });
    };

    // Auto-search when filters change
    useEffect(() => {
        onSearch(getFilters());
    }, [city, tag, dateRange, duration, timeCommitment, skillLevel, organizationType, remote]);

    return (
        <div className="search-header">
            <div className="search-container">
                <h1 className="search-title">Find Your Next Opportunity</h1>
                <p className="search-subtitle">
                    Use our AI powered search to discover opportunities that match your skills and interests.
                </p>

                {/* Legacy Search Form for existing layout */}
                <div className="search-form">
                    <input
                        type="text"
                        placeholder="I want to volunteer for..."
                        className="search-input main-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button className="smart-search-button" onClick={handleSmartSearch}>
                        Smart Search
                    </button>
                </div>

                {/* Filter Toggle */}
                <div className="filter-toggle">
                    <button 
                        className="filter-toggle-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <span>Advanced Filters</span>
                        <span className={`arrow ${showFilters ? 'up' : 'down'}`}>▼</span>
                    </button>
                    {(city || tag || dateRange || duration || timeCommitment || skillLevel || organizationType || remote) && (
                        <button className="clear-filters-btn" onClick={clearAllFilters}>
                            Clear All Filters
                        </button>
                    )}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filters-grid">
                            {/* Location Filter */}
                            <div className="filter-group">
                                <label className="filter-label">Location</label>
                                <div className="city-search-wrapper">
                                    <CitySearch onSelect={setCity} value={city} />
                                </div>
                            </div>

                            {/* Category/Tag Filter */}
                            <div className="filter-group">
                                <label className="filter-label">Category</label>
                                <select
                                    className="filter-select"
                                    value={tag}
                                    onChange={handleTagChange}
                                >
                                    <option value="">All Categories</option>
                                    {tags.map((tagOption) => (
                                        <option key={tagOption} value={tagOption}>
                                            {tagOption}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Remote/In-Person Filter */}
                            <div className="filter-group">
                                <label className="filter-label">Format</label>
                                <select
                                    className="filter-select"
                                    value={remote}
                                    onChange={(e) => setRemote(e.target.value)}
                                >
                                    <option value="">All Formats</option>
                                    <option value="remote">Remote</option>
                                    <option value="in-person">In-Person</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            {/* Date Range Filter */}
                            <div className="filter-group">
                                <label className="filter-label">When</label>
                                <select
                                    className="filter-select"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <option value="">Any Time</option>
                                    <option value="today">Today</option>
                                    <option value="this-week">This Week</option>
                                    <option value="this-month">This Month</option>
                                    <option value="next-month">Next Month</option>
                                    <option value="this-weekend">This Weekend</option>
                                    <option value="next-weekend">Next Weekend</option>
                                </select>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchHeader;