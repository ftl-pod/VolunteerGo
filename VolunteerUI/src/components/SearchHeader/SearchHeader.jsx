import "./SearchHeader.css";
import { useState, useEffect } from "react";
import CitySearch from "../CitySearch/CitySearch";

function SearchHeader({
  filters,
  onFilterChange,
  onSmartSearch,
  onClear,
  tags = [],
  skills = [],
  apiLoaded,
}) {

  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  const [city, setCity] = useState(filters.city || "");
  const [tag, setTag] = useState(filters.tag || "");
  const [format, setFormat] = useState(filters.format || "");
  const [skill, setSkill] = useState(filters.skill || "");
  const [showFilters, setShowFilters] = useState(false);

  // Sync local state with filter
  useEffect(() => {
    setSearchTerm(filters.searchTerm || "");
    setCity(filters.city || "");
    setTag(filters.tag || "");
    setFormat(filters.format || "");
    setSkill(filters.skill || "");
  }, [filters]);

  // Whenever a filter changes, notify parent
  const updateFilter = (key, value) => {
    onFilterChange(key, value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSmartSearch(searchTerm);
    }
  };

  const anyFilterActive = () =>
    !!(
      searchTerm.trim() ||
      city.trim() ||
      tag.trim() ||
      format.trim() ||
      skill.trim()
    );

  return (
    <div className="search-header">
      <div className="search-container">
        <h1 className="search-title">Find Your Next Opportunity</h1>
        <p className="search-subtitle">
          Use our AI powered search to discover opportunities that match your
          skills and interests.
        </p>

        {/* Search Input and Button */}
        <div className="search-form">
          <input
            type="text"
            placeholder="I want to volunteer for..."
            className="search-input main-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              updateFilter("searchTerm", e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <button className="smart-search-button" onClick={() => onSmartSearch(searchTerm)}>
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
            <span className={`arrow ${showFilters ? "up" : "down"}`}>▼</span>
          </button>
          {anyFilterActive() && (
            <button className="clear-filters-btn" onClick={onClear}>
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
                  <CitySearch
                    value={city}
                    onSelect={(val) => {
                      setCity(val);                 
                      updateFilter("city", val);  
                    }}
                  />
                </div>
              </div>

              {/* Category/Tag Filter */}
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  className="filter-select"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                    updateFilter("tag", e.target.value);
                  }}
                >
                  <option value="">All Categories</option>
                  {tags.map((tagOption) => (
                    <option key={tagOption} value={tagOption}>
                      {tagOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Filter */}
              <div className="filter-group">
                <label className="filter-label">Format</label>
                <select
                  className="filter-select"
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    updateFilter("format", e.target.value);
                  }}
                >
                  <option value="">All Formats</option>
                  <option value="remote">Remote</option>
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Skills Filter */}
              <div className="filter-group">
                <label className="filter-label">Skills</label>
                <select
                  className="filter-select"
                  value={skill}
                  onChange={(e) => {
                    setSkill(e.target.value);
                    updateFilter("skill", e.target.value);
                  }}
                >
                  <option value="">All Skills</option>
                  {skills.map((skillOption) => (
                    <option key={skillOption} value={skillOption}>
                      {skillOption}
                    </option>
                  ))}
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
