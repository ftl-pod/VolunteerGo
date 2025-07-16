import SearchHeader from '../SearchHeader/SearchHeader';
import NavBar from '../NavBar/NavBar';
import OpportunityGrid from '../OpportunityGrid/OpportunityGrid';
import { useState } from 'react'
import './SearchPage.css';

function SearchPage() {
    const [searchResults, setSearchResults] = useState('');
    return (
        <div className="search-page">
            <div className="search-page-content">
                <SearchHeader setSearchResults={setSearchResults} />
                <OpportunityGrid searchResults={searchResults} />
            </div>
        </div>
    );
}

export default SearchPage;
