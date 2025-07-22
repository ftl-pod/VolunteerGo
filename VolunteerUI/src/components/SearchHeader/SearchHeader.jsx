import "./SearchHeader.css";
import { useState } from 'react';

function SearchHeader({onSearch, onSmartSearch}) {
    const [city, setCity] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const handleClick = () => {
        onSearch({ keyword: searchTerm, city });
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


    return (
        <div className="search-header">
            <div className="search-container">
                <h1 className="search-title">Find Your Next Opportunity</h1>
                <p className="search-subtitle">Discover amazing volunteer opportunities that match your skills and interests</p>
                
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
                </div>
            </div>
        </div>
    );
}

export default SearchHeader;
