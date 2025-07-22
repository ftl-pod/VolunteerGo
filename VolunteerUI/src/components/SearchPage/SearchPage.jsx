import SearchHeader from '../SearchHeader/SearchHeader';
import NavBar from '../NavBar/NavBar';
import OpportunityGrid from '../OpportunityGrid/OpportunityGrid';
import { useState } from 'react'
import './SearchPage.css';

function SearchPage() {
    const [searchResults, setSearchResults] = useState({ keyword: '', city: '' });
    const [smartResults, setSmartResults] = useState([]); // new

    return (
        <div className="search-page">
            <div className="search-page-content">
                <SearchHeader onSearch={setSearchResults} onSmartSearch={setSmartResults} />
                <OpportunityGrid
                    searchResults={searchResults}
                    overrideOpportunities={smartResults}
                />
            </div>
        </div>
    );
}

export default SearchPage;
