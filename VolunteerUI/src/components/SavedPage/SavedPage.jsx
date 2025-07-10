import './SavedPage.css'
import opportunities from '../../data/opportunities';
import { Link } from 'react-router-dom';

function SavedPage() {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });
    };

    const suggestedCards = opportunities.slice(0, 3);
    const remainingCards = opportunities.slice(3);

    return (
        <div className="saved-section">
            {/* Suggested Cards Section */}
            <div className="suggested-section">
                <h2>Suggested for You</h2>
                <div className="suggested-grid">
                    {suggestedCards.map(opportunity => (
                        <Link to={`/opportunity/${opportunity.id}`} key={opportunity.id}>
                            <div className="suggested-card">
                                <div className="saved-card-header">
                                    <div className="saved-card-header-left">
                                        <h3 className="saved-card-title">{opportunity.title}</h3>
                                        <p className="saved-card-org">{opportunity.organization}</p>
                                    </div>
                                </div>
                                <div className="saved-card-details">
                                    <span> {opportunity.location} | </span>
                                    <span> {formatDate(opportunity.date)}</span>
                                </div>

                                <p className="saved-card-description">{opportunity.description}</p>
                                
                                <div className="tags">
                                    {opportunity.tags.map(tag => (
                                        <span key={tag} className="saved-card-tag">{tag}</span>
                                    ))}
                                </div>
                                
                                <div className="saved-card-actions">
                                    <button className="btn-primary">I Want to Help</button>
                                    <button className="btn-secondary">Save</button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Saved Cards Section */}
            <div className="saved-cards-section">
                <h2>Your Saved Cards</h2>
                <div className="saved-grid">
                    {remainingCards.map(opportunity => (
                        <Link to={`/opportunity/${opportunity.id}`} key={opportunity.id}>
                            <div className="saved-card">
                                <div className="saved-card-header">
                                    <div className="saved-card-header-left">
                                        <h3 className="saved-card-title">{opportunity.title}</h3>
                                        <p className="saved-card-org">{opportunity.organization}</p>
                                    </div>
                                </div>
                                <div className="saved-card-details">
                                    <span> {opportunity.location} | </span>
                                    <span> {formatDate(opportunity.date)}</span>
                                </div>

                                <p className="saved-card-description">{opportunity.description}</p>
                                
                                <div className="tags">
                                    {opportunity.tags.map(tag => (
                                        <span key={tag} className="saved-card-tag">{tag}</span>
                                    ))}
                                </div>
                                
                                <div className="saved-card-actions">
                                    <button className="btn-primary">I Want to Help</button>
                                    <button className="btn-secondary">Remove</button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SavedPage