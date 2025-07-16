import SearchHeader from '../SearchHeader/SearchHeader';
import NavBar from '../NavBar/NavBar';
import OpportunityGrid from '../OpportunityGrid/OpportunityGrid';

import './SearchPage.css';

function SearchPage() {
    return (
        <div className="search-page">
            <div className="search-page-content">
                <SearchHeader />
                <OpportunityGrid />
            </div>
        </div>
    );
}

export default SearchPage;
