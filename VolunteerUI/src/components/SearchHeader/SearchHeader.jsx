import "./SearchHeader.css";
import { useState } from 'react';

function SearchHeader() {
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState('');

    return (
        <div className="search-header">
            <div className="search-container">
                <h1 className="search-title">Find Your Next Opportunity</h1>
                <p className="search-subtitle">Discover amazing volunteer opportunities that match your skills and interests</p>
                
                <div className="search-form">
                    <input
                        type="text"
                        placeholder="City"
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
                    />

                    <button className="search-button">Search</button>
                    <button className="smart-search-button">Smart Search</button>
                </div>
            </div>
        </div>
    );
}

export default SearchHeader;
