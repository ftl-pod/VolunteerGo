import './OpportunityGrid.css'
import opportunities from '../../data/opportunities';
import { Link } from 'react-router-dom';

function OpportunityGrid() {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });
    };


    return (
        <div className="opportunities-section">
            <div className="opportunity-grid">
                {opportunities.map(opportunity => (
                    <Link to={`/opportunity/${opportunity.id}`}>
                        <div key={opportunity.id} className="opportunity-card">
                            <div className="card-header">
                                <div className="card-header-left">
                                    <h3 className="card-title">{opportunity.title}</h3>
                                    <p className="card-org">{opportunity.organization}</p>
                                </div>
                            </div>
                            <div className="card-details">
                                <span> {opportunity.location} | </span>
                                <span> {formatDate(opportunity.date)}</span>
                            </div>

                            <p className="card-description">{opportunity.description}</p>
                            
                            
                            <div className="card-tags">
                                {opportunity.tags.map(tag => (
                                    <span key={tag} className="card-tag">{tag}</span>
                                ))}
                            </div>
                            
                            <div className="card-actions">
                                <button className="btn-primary">I Want to Help</button>
                                <button className="btn-secondary">Save</button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default OpportunityGrid
